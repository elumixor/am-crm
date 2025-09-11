import { ApiError } from "errors";
import type { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { env } from "./env";

declare module "hono" {
  interface ContextVariableMap {
    auth?: { userId: string };
  }
}

export interface WithAuth {
  Variables: { auth: { userId: string } };
}

export async function hashPassword(password: string) {
  return await Bun.password.hash(password);
}

export async function verifyPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}

export async function generateToken(userId: string) {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h expiration
  };
  return await sign(payload, env.JWT_SECRET);
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const auth = c.req.header("Authorization");
  if (!auth) throw new ApiError("Unauthorized", 401);

  try {
    const token = auth.replace("Bearer ", "");
    const payload = await verify(token, env.JWT_SECRET);

    // Set the context with user ID from token
    c.set("auth", { userId: payload.sub as string });
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}

export function requireAuth(c: Context) {
  const auth = c.get("auth");
  if (!auth) throw new ApiError("Unauthorized", 401);
  return auth as { userId: string };
}
