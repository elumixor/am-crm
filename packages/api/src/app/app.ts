import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { env } from "services/env";
import { auth } from "./routes/auth";
import { signedUrl } from "./routes/signed-url";
import { units } from "./routes/units";
import { users } from "./routes/users";

const app = new Hono()
  // Middlewares:
  // Error handling
  .onError((err, c) => {
    console.error(`Error: ${err.message}`);
    const status = Reflect.get(err, "status") ?? 500;
    return c.json({ message: err.message }, status);
  })
  // Logger
  .use(logger())
  // CORS
  .use(
    cors({
      origin: (origin) => {
        // allow requests with no origin (Postman, curl, server-to-server)
        if (!origin) return "*";

        // Allow our frontend URLs
        if ([env.FRONT_LOCAL_URL, env.FRONT_PROD_URL, env.FRONT_DEV_URL].includes(origin)) return origin;

        // if not in list, block
        return "";
      },
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  // Add some basic health checks
  .get("/", (c) => c.json({ ok: true }))
  .get("/health", (c) => c.json({ status: "ok" }))
  // Service to get signed URLs (e.g. for photo uploads)
  .route("/signedUrl", signedUrl)
  // Auth routes
  .route("/auth", auth)
  // Users routes
  .route("/users", users)
  // Units routes
  .route("/units", units);

showRoutes(app);

export default app;
export type AppType = typeof app;
