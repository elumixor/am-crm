import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { generateToken, hashPassword, verifyPassword } from "services/auth";
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
  });
