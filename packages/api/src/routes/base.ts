import type { Hono } from "hono";

export const registerBaseRoutes = (app: Hono) => {
  app.get("/", (c) => c.json({ ok: true }));
  // Lightweight health / liveness endpoint (no DB dependency)
  app.get("/health", (c) => c.json({ status: "ok" }));
};
