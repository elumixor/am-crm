import { helloShared } from "@am-crm/shared";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();
const app = new Hono();

app.get("/", (c) => c.json({ ok: true, msg: helloShared() }));

// Lightweight health / liveness endpoint (no DB dependency)
app.get("/health", (c) => c.json({ status: "ok" }));

// Users CRUD
app.get("/users", async (c) => {
  const users = await prisma.user.findMany({ include: { traits: true, memberships: true } });
  return c.json(users);
});

app.post("/users", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.email) return c.text("email required", 400);
  const user = await prisma.user.create({ data: { email: body.email, name: body.name ?? null } });
  return c.json(user, 201);
});

app.put("/users/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const user = await prisma.user
    .update({ where: { id }, data: { email: body.email, name: body.name } })
    .catch(() => null);
  if (!user) return c.text("not found", 404);
  return c.json(user);
});

app.delete("/users/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.user.delete({ where: { id } }).catch(() => null);
  return c.body(null, 204);
});

// Traits
app.get("/users/:id/traits", async (c) => {
  const id = c.req.param("id");
  const traits = await prisma.userTrait.findMany({ where: { userId: id } });
  return c.json(traits);
});

app.post("/users/:id/traits", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  if (!body.trait) return c.text("trait required", 400);
  const created = await prisma.userTrait.upsert({
    where: { userId_trait: { userId: id, trait: body.trait } },
    update: {},
    create: { userId: id, trait: body.trait },
  });
  return c.json(created, 201);
});

app.delete("/users/:id/traits/:trait", async (c) => {
  const { id, trait } = c.req.param();
  await prisma.userTrait.delete({ where: { userId_trait: { userId: id, trait } } }).catch(() => null);
  return c.body(null, 204);
});

// Units CRUD
app.get("/units", async (c) => {
  const units = await prisma.unit.findMany({ include: { memberships: true } });
  return c.json(units);
});

app.post("/units", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return c.text("name required", 400);
  const unit = await prisma.unit.create({ data: { name: body.name, description: body.description ?? null } });
  return c.json(unit, 201);
});

app.put("/units/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const unit = await prisma.unit
    .update({ where: { id }, data: { name: body.name, description: body.description } })
    .catch(() => null);
  if (!unit) return c.text("not found", 404);
  return c.json(unit);
});

app.delete("/units/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.unit.delete({ where: { id } }).catch(() => null);
  return c.body(null, 204);
});

// Memberships
app.get("/units/:id/members", async (c) => {
  const id = c.req.param("id");
  const members = await prisma.unitMembership.findMany({ where: { unitId: id }, include: { user: true } });
  return c.json(members);
});

app.post("/units/:id/members", async (c) => {
  const unitId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  if (!body.userId) return c.text("userId required", 400);
  const membership = await prisma.unitMembership.upsert({
    where: { userId_unitId: { userId: body.userId, unitId } },
    update: { role: body.role ?? undefined },
    create: { userId: body.userId, unitId, role: body.role ?? "MEMBER" },
  });
  return c.json(membership, 201);
});

app.delete("/units/:unitId/members/:userId", async (c) => {
  const { unitId, userId } = c.req.param();
  await prisma.unitMembership.delete({ where: { userId_unitId: { userId, unitId } } }).catch(() => null);
  return c.body(null, 204);
});

const port = 3001;
export default { port, fetch: app.fetch };

if (import.meta.main) console.log(`API server listening on http://localhost:${port}`);
