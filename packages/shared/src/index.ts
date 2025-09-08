// Shared utilities & type contracts across backend and frontend.
// Keep this package free of server-only dependencies (e.g. Prisma client) so
// it can be safely imported in browser bundles.

export type { AppType } from "@am-crm/api";
export * from "./data";
export * from "./utils";
