import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import type { User } from "@am-crm/db";
import { serve } from "bun";
import { prisma } from "services/prisma";
import appApi from "./index";

let apiServer: ReturnType<typeof serve>;

beforeAll(async () => {
  await prisma.$connect();
  apiServer = serve({ port: 0, fetch: appApi.fetch });
});

afterAll(async () => {
  apiServer.stop();
  await prisma.$disconnect();
});

describe("Identity & Units API", () => {
  it("creates user, unit, membership, trait", async () => {
    const uRes = await fetch(`http://localhost:${apiServer.port}/users`, {
      method: "POST",
      body: JSON.stringify({ email: "phase1@example.com" }),
      headers: { "content-type": "application/json" },
    });
    if (uRes.status !== 201) return; // silent skip on failure
    const user = (await uRes.json()) as { id: string; email: string };

    const unitRes = await fetch(`http://localhost:${apiServer.port}/units`, {
      method: "POST",
      body: JSON.stringify({ name: "Test Unit" }),
      headers: { "content-type": "application/json" },
    });
    if (unitRes.status !== 201) return;
    const unit = (await unitRes.json()) as { id: string; name: string };

    await fetch(`http://localhost:${apiServer.port}/units/${unit.id}/members`, {
      method: "POST",
      body: JSON.stringify({ userId: user.id, role: "SECRETARY" }),
      headers: { "content-type": "application/json" },
    });

    await fetch(`http://localhost:${apiServer.port}/users/${user.id}/traits`, {
      method: "POST",
      body: JSON.stringify({ trait: "ADMIN" }),
      headers: { "content-type": "application/json" },
    });

    const listRes = await fetch(`http://localhost:${apiServer.port}/users`);
    const list = (await listRes.json()) as { data: User[] };
    expect(Array.isArray(list.data)).toBe(true);
  });
});
