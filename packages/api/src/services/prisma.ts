import { PrismaClient } from "@am-crm/db";

// Single shared Prisma client instance for the app
export const prisma = new PrismaClient({
  omit: { user: { passwordHash: true } },
});
