import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerBaseRoutes } from "./routes/base";
import { registerUnitRoutes } from "./routes/units";
import { registerUserRoutes } from "./routes/users";

const app = new Hono();

// Define allowed origins
const allowedOrigins = [process.env.LOCAL_FRONTEND_URL, process.env.VERCEL_PROD_URL, process.env.VERCEL_DEV_URL];

console.log("Allowed origins for CORS:", allowedOrigins);

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return "*";

      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      // if not in list, block
      return ""; // or throw new Error("Not allowed by CORS")
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you need cookies / auth headers
  }),
);

// Register routes (order: generic/base first, then domain specific)
registerBaseRoutes(app);
registerUserRoutes(app);
registerUnitRoutes(app);

const port = 3001;
export default { port, fetch: app.fetch };

if (import.meta.main) console.log(`API server listening on http://localhost:${port}`);
