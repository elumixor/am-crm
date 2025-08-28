import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { serve } from "bun";
import app from "./index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let server: ReturnType<typeof serve>;

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", name: "Test User" },
  });
  server = serve({ port: 0, fetch: app.fetch });
});

afterAll(async () => {
  server.stop();
  await prisma.$disconnect();
});

describe("API", () => {
  it("root returns ok", async () => {
    const res = await fetch(`http://localhost:${server.port}/`);
    const json = (await res.json()) as any;
    expect(json.ok).toBe(true);
  });
  it("users returns list", async () => {
    const res = await fetch(`http://localhost:${server.port}/users`);
    const json = (await res.json()) as any[];
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].email).toBeDefined();
  });
});
