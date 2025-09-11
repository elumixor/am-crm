import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { User } from "@am-crm/db";
import { serve } from "bun";
import { prisma } from "services/prisma";
import app from "./index";

let server: ReturnType<typeof serve>;

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", displayName: "Test User" },
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
    const json = (await res.json()) as { data: User[] };
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data[0]?.email).toBeDefined();
  });
});
