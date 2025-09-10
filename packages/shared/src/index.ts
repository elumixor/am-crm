// Shared utilities & type contracts across backend and frontend.
// Keep this package free of server-only dependencies (e.g. Prisma client) so
// it can be safely imported in browser bundles.

export * from "./constants";
export * from "./utils";
