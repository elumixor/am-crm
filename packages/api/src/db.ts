import { PrismaClient } from "@prisma/client";

// Single Prisma client instance for the API process.
export const prisma = new PrismaClient();
