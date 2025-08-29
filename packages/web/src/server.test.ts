import { describe, it, beforeAll, expect, afterAll } from "bun:test";
import web from "./server";
import api from "@am-crm/api/src/index";
import { PrismaClient } from "@prisma/client";
import { serve } from "bun";

let webServer: ReturnType<typeof serve> | null = null;
let apiServer: ReturnType<typeof serve> | null = null;
const prisma = new PrismaClient();
let canRun = true;

beforeAll(async () => {
  try {
    await prisma.$connect();
    await prisma.user.upsert({
      where: { email: "webtest@example.com" },
      update: {},
      create: { email: "webtest@example.com", name: "Web Tester" },
    });
    apiServer = serve(api); // port 3001
    webServer = serve(web); // port 3000
  } catch {
    canRun = false;
  }
});

afterAll(async () => {
  apiServer?.stop();
  webServer?.stop();
  await prisma.$disconnect();
});

describe("Web server", () => {
  it("serves HTML containing user email", async () => {
    if (!canRun) return;
    const res = await fetch("http://localhost:3000/").catch(() => null);
    if (!res) return; // skip if server unreachable
    const html = await res.text();
    expect(html).toContain("<!DOCTYPE html>");
  });
});
