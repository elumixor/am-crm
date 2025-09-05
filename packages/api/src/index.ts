import { App } from "./app";
import { registerAuthRoutes } from "./routes/auth";
import { registerBaseRoutes } from "./routes/base";
import { registerProfileRoutes } from "./routes/profile";
import { registerUnitRoutes } from "./routes/units";
import { registerUserRoutes } from "./routes/users";

const app = new App();

// Register routes (order: generic/base first, then domain specific)
registerBaseRoutes(app);
registerAuthRoutes(app);
registerProfileRoutes(app);
registerUserRoutes(app);
registerUnitRoutes(app);

const port = 3001;
export default { port, fetch: app.fetch };

if (import.meta.main) console.log(`API server listening on http://localhost:${port}`);
