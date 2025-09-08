import { zValidator } from "@hono/zod-validator";
import type { Context } from "hono";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { env } from "services/env";
import { prisma } from "services/prisma";
import { z } from "zod";

declare module "hono" {
  interface ContextVariableMap {
    auth?: { userId: string };
  }
}

export interface WithAuth {
  Variables: { auth: { userId: string } };
}

async function hashPassword(password: string) {
  return await Bun.password.hash(password);
}

async function verifyPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}

async function generateToken(userId: string) {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h expiration
  };
  return await sign(payload, env.JWT_SECRET);
}

export const auth = new Hono()
  // Login with existing user
  .post("/login", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    console.log("Login attempt", email);
    const user = await prisma.user.findUnique({ where: { email }, select: { passwordHash: true, id: true } });

    if (!user) return c.text(`user with email ${email} not found`, 401);
    if (!user.passwordHash) return c.text("No password hash found. You need to reset your password", 401);

    const valid = await verifyPassword(password, user.passwordHash as string);
    if (!valid) return c.text("password mismatch", 401);

    return c.json({ token: await generateToken(user.id), userId: user.id });
  })
  // Register a new user
  .post("/register", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return c.text("email already registered", 400);

    // Create password for the user, hash it and store together with the user data
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    // Auto-login
    return c.json({ token: await generateToken(user.id), userId: user.id }, 201);
  })
  // Reset password for existing user
  .post("/reset", zValidator("json", z.object({ email: z.email(), password: z.string().min(6) })), async (c) => {
    const { email, password } = c.req.valid("json");

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.text(`user with email ${email} not found`, 404);

    const passwordHash = await hashPassword(password);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return c.body(null, 204);
  })
  // Validate token
  .post("/validate", zValidator("json", z.object({ token: z.string() })), async (c) => {
    const { token } = c.req.valid("json");
    try {
      await verify(token, env.JWT_SECRET);
      return c.body(null, 204);
    } catch {
      return c.text("Invalid token", 401);
    }
  });

export function sessionMiddleware() {
  return async (c: Context, next: () => Promise<void>) => {
    const auth = c.req.header("Authorization");
    if (!auth) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const token = auth.replace("Bearer ", "");
      const payload = await verify(token, env.JWT_SECRET);
      // Set the context with user ID from token
      c.set("auth", { userId: payload.sub as string });
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  };
}
