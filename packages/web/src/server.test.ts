import { describe, it, beforeAll, expect, afterAll } from "bun:test";
import web from "./server";
import api from "@am-crm/api/src/index";
import { PrismaClient } from "@prisma/client";
import { serve } from "bun";

let webServer: ReturnType<typeof serve>;
let apiServer: ReturnType<typeof serve>;
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: "webtest@example.com" },
    update: {},
    create: { email: "webtest@example.com", name: "Web Tester" },
  });
  apiServer = serve(api); // port 3001
  webServer = serve(web); // port 3000
});

afterAll(async () => {
  apiServer.stop();
  await prisma.$disconnect();
});

describe("Web server", () => {
  it("serves HTML containing user email", async () => {
    const res = await fetch("http://localhost:3000/");
    const html = await res.text();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("webtest@example.com");
  });
});
