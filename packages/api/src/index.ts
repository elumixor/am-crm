import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { helloShared } from "@am-crm/shared";
import { serve } from "bun";

const prisma = new PrismaClient();
const app = new Hono();

app.get("/", (c) => c.json({ ok: true, msg: helloShared() }));

app.get("/users", async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

export default {
  port: 3001,
  fetch: app.fetch,
};

if (import.meta.main) {
  serve({ port: 3001, fetch: app.fetch });
  console.log("API server listening on http://localhost:3001");
}
