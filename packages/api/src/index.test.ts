import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { PrismaClient, type User } from "@prisma/client";
import { serve } from "bun";
import app from "./index";

const prisma = new PrismaClient();
let server: ReturnType<typeof serve>;

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", name: "Test User" },
  });
  server = serve({ port: 0, fetch: app.fetch });
});

afterAll(async () => {
  if (server) server.stop();
  await prisma.$disconnect();
});

describe("API", () => {
  it("root returns ok", async () => {
    const res = await fetch(`http://localhost:${server.port}/`);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });
  it("users returns list", async () => {
    const res = await fetch(`http://localhost:${server.port}/users`);
    const json = (await res.json()) as User[];
    expect(Array.isArray(json)).toBe(true);
    expect(json[0]?.email).toBeDefined();
  });
});
