import appApi from "@am-crm/api/src/index";
import { PrismaClient } from "@prisma/client";

import { beforeAll, afterAll, describe, it, expect } from "bun:test";
import { serve, spawn } from "bun";

let apiServer: ReturnType<typeof serve>;
const prisma = new PrismaClient();
let webProcess: ReturnType<typeof spawn>;

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: "nexttest@example.com" },
    update: {},
    create: { email: "nexttest@example.com", name: "Next Tester" },
  });
  apiServer = serve({ port: 0, fetch: appApi.fetch });
  console.log(`API server running on port ${apiServer.port}`);

  // start Next.js dev server on random port via env PORT
  const webPort = 3100;
  webProcess = spawn({
    cmd: ["bun", "run", "dev"],
    cwd: import.meta.dir + "/../",
    env: {
      ...process.env,
      PORT: String(webPort),
      API_BASE_URL: `http://localhost:${apiServer.port}`,
    },
    stdout: "pipe",
    stderr: "pipe",
  });
  // naive wait for server to boot
  await new Promise((r) => setTimeout(r, 1000));
});

afterAll(async () => {
  apiServer.stop();
  webProcess?.kill();
  await prisma.$disconnect();
});

describe("Web (Next.js) page", () => {
  it("renders user email fetched from API", async () => {
    const res = await fetch("http://localhost:3100");
    const html = await res.text();
    expect(html).toContain("nexttest@example.com");
  });
});
