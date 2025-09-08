export type { AppType } from "./app/app";

import app from "./app/app";

const port = 3001;
export default { port, fetch: app.fetch };

if (import.meta.main) console.log(`API server listening on http://localhost:${port}`);
