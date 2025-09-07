import type { App } from "../app/app";

export const registerBaseRoutes = (app: App) => {
  app.get("/", (c) => c.json({ ok: true }));
  // Lightweight health / liveness endpoint (no DB dependency)
  app.get("/health", (c) => c.json({ status: "ok" }));
};
