import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "@am-crm/shared";
import { randomUUID } from "crypto";
import type { Context } from "hono";
import type { App } from "../app";

// In-memory session store (MVP only)
const sessions = new Map<string, string>(); // token -> userId

async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

export const registerAuthRoutes = (app: App) => {
  app.post("/auth/register", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<RegisterPayload>;
    if (!body.email || !body.password) return c.text("email & password required", 400);
    const existing = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return c.text("email already registered", 400);
    const passwordHash = await hashPassword(body.password);
    // Cast due to pending Prisma type generation after schema update
    const user = await app.prisma.user.create({ data: { email: body.email, passwordHash } });
    return c.json({ id: user.id, email: user.email }, 201);
  });

  app.post("/auth/login", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<LoginPayload>;
    if (!body.email || !body.password) return c.text("email & password required", 400);
    const user = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) return c.text("invalid credentials", 401);
    const valid = await verifyPassword(body.password, user.passwordHash as string);
    if (!valid) return c.text("invalid credentials", 401);
    const token = randomUUID();
    sessions.set(token, user.id);
    return c.json({ token, userId: user.id });
  });

  app.post("/auth/reset-password", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<ResetPasswordPayload>;
    if (!body.email || !body.newPassword) return c.text("email & newPassword required", 400);
    const user = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return c.text("not found", 404);
    const passwordHash = await hashPassword(body.newPassword);
    await app.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return c.body(null, 204);
  });

  // Simple middleware to extract session (not exported). Used by profile routes.
  app.use("/me/*", async (c, next) => {
    const auth = c.req.header("authorization");
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      const userId = sessions.get(token);
      if (userId) c.set("userId" as never, userId);
    }
    await next();
  });
};

export function requireAuth(c: Context): string | null {
  const userId = c.get("userId") as string | undefined;
  if (!userId) return null;
  return userId;
}
