import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { generateToken, hashPassword, verifyPassword, authMiddleware, requireAuth } from "services/auth";
import { env } from "services/env";
import { prisma } from "services/prisma";
import { z } from "zod";

export const auth = new Hono()
  // Login with existing user
  .post("/login", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    console.log("Login attempt", email);
    const user = await prisma.user.findUnique({ where: { email }, select: { passwordHash: true, id: true } });

    if (!user) return c.json({ error: `User with email ${email} not found` }, 401);
    if (!user.passwordHash) return c.json({ error: "No password hash found. You need to reset your password" }, 401);

    const valid = await verifyPassword(password, user.passwordHash as string);
    if (!valid) return c.json({ error: "Password mismatch" }, 401);

    return c.json({ token: await generateToken(user.id) });
  })
  // Register a new user
  .post("/register", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: `Email ${email} already registered` }, 400);

    // Create password for the user, hash it and store together with the user data
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    // Auto-login
    return c.json({ token: await generateToken(user.id) }, 201);
  })
  // Reset password for existing user
  .post("/reset", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ error: `user with email ${email} not found` }, 404);

    const passwordHash = await hashPassword(password);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return c.body(null, 204);
  })
  // Validate token
  .post("/validate", zValidator("json", z.object({ token: z.string() })), async (c) => {
    const { token } = c.req.valid("json");
    try {
      await verify(token, env.JWT_SECRET);
      return c.json({ valid: true });
    } catch {
      return c.json({ valid: false }, 401);
    }
  })
  // Refresh token
  .post("/refresh", zValidator("json", z.object({ token: z.string() })), async (c) => {
    const { token } = c.req.valid("json");
    try {
      const payload = await verify(token, env.JWT_SECRET);
      const userId = payload.sub as string;

      // Generate new token
      return c.json({ token: await generateToken(userId) });
    } catch {
      return c.json({ error: "Token invalid or expired" }, 401);
    }
  })
  // Create magic link invitation (authenticated)
  .post(
    "/create-magic-link",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        email: z.email(),
      }),
    ),
    async (c) => {
      const { email } = c.req.valid("json");
      const { userId: createdBy } = requireAuth(c);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return c.json({ error: "User with this email already exists" }, 400);
      }

      // Check if there's already an unused magic link for this email
      const existingInvitation = await prisma.magicLinkInvitation.findFirst({
        where: {
          email,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvitation) {
        return c.json({
          token: existingInvitation.token,
          expiresAt: existingInvitation.expiresAt,
        });
      }

      // Create new magic link invitation (expires in 7 days)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const invitation = await prisma.magicLinkInvitation.create({
        data: {
          email,
          createdBy,
          expiresAt,
        },
      });

      return c.json(
        {
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
        201,
      );
    },
  )
  // Get magic link information
  .get("/magic-link/:token", async (c) => {
    const token = c.req.param("token");

    const invitation = await prisma.magicLinkInvitation.findUnique({
      where: { token },
      select: {
        email: true,
        expiresAt: true,
        usedAt: true,
        creator: {
          select: {
            spiritualName: true,
            worldlyName: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return c.json({ error: "Invalid magic link" }, 404);
    }

    if (invitation.usedAt) {
      return c.json({ error: "Magic link has already been used" }, 410);
    }

    if (invitation.expiresAt < new Date()) {
      return c.json({ error: "Magic link has expired" }, 410);
    }

    return c.json({
      email: invitation.email,
      expiresAt: invitation.expiresAt,
      createdBy: invitation.creator,
    });
  })
  // Complete magic link registration
  .post(
    "/complete-magic-link",
    zValidator(
      "json",
      z.object({
        token: z.string(),
        password: z.string().min(6),
        spiritualName: z.string().optional(),
        worldlyName: z.string().optional(),
        preferredName: z.string().optional(),
      }),
    ),
    async (c) => {
      const { token, password, spiritualName, worldlyName, preferredName } = c.req.valid("json");

      // Find and validate magic link
      const invitation = await prisma.magicLinkInvitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        return c.json({ error: "Invalid magic link" }, 404);
      }

      if (invitation.usedAt) {
        return c.json({ error: "Magic link has already been used" }, 410);
      }

      if (invitation.expiresAt < new Date()) {
        return c.json({ error: "Magic link has expired" }, 410);
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: invitation.email },
      });
      if (existingUser) {
        return c.json({ error: "User with this email already exists" }, 400);
      }

      // Create user and mark invitation as used
      const passwordHash = await hashPassword(password);

      const user = await prisma.$transaction(async (tx: typeof prisma) => {
        // Create the user
        const newUser = await tx.user.create({
          data: {
            email: invitation.email,
            passwordHash,
            spiritualName,
            worldlyName,
            preferredName,
            displayName: preferredName || spiritualName || worldlyName,
          },
        });

        // Mark invitation as used
        await tx.magicLinkInvitation.update({
          where: { token },
          data: { usedAt: new Date() },
        });

        return newUser;
      });

      // Auto-login the new user
      const authToken = await generateToken(user.id);

      return c.json(
        {
          token: authToken,
          user: {
            id: user.id,
            email: user.email,
            spiritualName: user.spiritualName,
            worldlyName: user.worldlyName,
            preferredName: user.preferredName,
            displayName: user.displayName,
          },
        },
        201,
      );
    },
  );
