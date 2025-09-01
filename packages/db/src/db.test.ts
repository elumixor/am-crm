import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Prisma DB", () => {
  it("creates and reads a User", async () => {
    const email = `db-test-${Date.now()}@example.com`;
    const created = await prisma.user.create({
      data: { email, name: "DB Tester" },
    });
    expect(created.email).toBe(email);
    const fetched = await prisma.user.findUnique({ where: { email } });
    expect(fetched?.name).toBe("DB Tester");
  });
});
