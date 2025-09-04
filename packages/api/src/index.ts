import type {
  AddMemberPayload,
  AddTraitPayload,
  CreateUnitPayload,
  CreateUserPayload,
  Unit as UnitDTO,
  UnitMembership as UnitMembershipDTO,
  UpdateUnitPayload,
  UpdateUserPayload,
  User as UserDTO,
  UserTrait as UserTraitDTO,
} from "@am-crm/shared";
import {
  PrismaClient,
  type Unit as PrismaUnit,
  type UnitMembership as PrismaUnitMembership,
  type User as PrismaUser,
  type UserTrait as PrismaUserTrait,
} from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";

const prisma = new PrismaClient();
const app = new Hono();

// Define allowed origins
const allowedOrigins = [process.env.LOCAL_FRONTEND_URL, process.env.VERCEL_PROD_URL, process.env.VERCEL_DEV_URL];

console.log("Allowed origins for CORS:", allowedOrigins);

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return "*";

      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      // if not in list, block
      return ""; // or throw new Error("Not allowed by CORS")
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you need cookies / auth headers
  }),
);

app.get("/", (c) => c.json({ ok: true }));

// Lightweight health / liveness endpoint (no DB dependency)
app.get("/health", (c) => c.json({ status: "ok" }));

// Users CRUD
// Mapping helpers: Prisma -> DTO. Keep isolated so persistence changes don't leak.
const mapTrait = (t: PrismaUserTrait): UserTraitDTO => ({
  id: t.id,
  createdAt: t.createdAt.toISOString(),
  userId: t.userId,
  trait: t.trait,
});
const mapMembership = (m: PrismaUnitMembership): UnitMembershipDTO => ({
  id: m.id,
  createdAt: m.createdAt.toISOString(),
  userId: m.userId,
  unitId: m.unitId,
  role: m.role,
});

const mapUser = (u: PrismaUser & { traits?: PrismaUserTrait[]; memberships?: PrismaUnitMembership[] }): UserDTO => ({
  id: u.id,
  createdAt: u.createdAt.toISOString(),
  email: u.email,
  name: u.name,
  traits: (u.traits ?? []).map(mapTrait),
  memberships: (u.memberships ?? []).map(mapMembership),
});

const mapUnit = (u: PrismaUnit & { memberships?: PrismaUnitMembership[] }): UnitDTO => ({
  id: u.id,
  createdAt: u.createdAt.toISOString(),
  name: u.name,
  description: u.description,
  memberships: (u.memberships ?? []).map(mapMembership),
});

app.get("/users", async (c) => {
  const users = await prisma.user.findMany({ include: { traits: true, memberships: true } });
  return c.json(users.map(mapUser));
});

app.post("/users", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Partial<CreateUserPayload>;
  if (!body.email) return c.text("email required", 400);
  const user = await prisma.user.create({ data: { email: body.email, name: body.name ?? null } });
  return c.json(mapUser(user), 201);
});

app.put("/users/:id", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Partial<UpdateUserPayload>;
  const data: Record<string, unknown> = {};
  if (body.email !== undefined) data.email = body.email;
  if (body.name !== undefined) data.name = body.name;
  const user = await prisma.user.update({ where: { id }, data }).catch(() => null);
  if (!user) return c.text("not found", 404);
  return c.json(mapUser(user));
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
  return c.json(traits.map(mapTrait));
});

app.post("/users/:id/traits", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Partial<AddTraitPayload>;
  if (!body.trait) return c.text("trait required", 400);
  const created = await prisma.userTrait.upsert({
    where: { userId_trait: { userId: id, trait: body.trait } },
    update: {},
    create: { userId: id, trait: body.trait },
  });
  return c.json(mapTrait(created), 201);
});

app.delete("/users/:id/traits/:trait", async (c) => {
  const { id, trait } = c.req.param();
  await prisma.userTrait.delete({ where: { userId_trait: { userId: id, trait } } }).catch(() => null);
  return c.body(null, 204);
});

// Units CRUD
app.get("/units", async (c) => {
  const units = await prisma.unit.findMany({ include: { memberships: true } });
  return c.json(units.map(mapUnit));
});

app.post("/units", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Partial<CreateUnitPayload>;
  if (!body.name) return c.text("name required", 400);
  const unit = await prisma.unit.create({ data: { name: body.name, description: body.description ?? null } });
  return c.json(mapUnit(unit), 201);
});

app.put("/units/:id", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Partial<UpdateUnitPayload>;
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  const unit = await prisma.unit.update({ where: { id }, data }).catch(() => null);
  if (!unit) return c.text("not found", 404);
  return c.json(mapUnit(unit));
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
  return c.json(members.map(mapMembership));
});

app.post("/units/:id/members", async (c) => {
  const unitId = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Partial<AddMemberPayload>;
  if (!body.userId) return c.text("userId required", 400);
  const membership = await prisma.unitMembership.upsert({
    where: { userId_unitId: { userId: body.userId, unitId } },
    update: { role: body.role ?? undefined },
    create: { userId: body.userId, unitId, role: body.role ?? "MEMBER" },
  });
  return c.json(mapMembership(membership), 201);
});

app.delete("/units/:unitId/members/:userId", async (c) => {
  const { unitId, userId } = c.req.param();
  await prisma.unitMembership.delete({ where: { userId_unitId: { userId, unitId } } }).catch(() => null);
  return c.body(null, 204);
});

const port = 3001;
export default { port, fetch: app.fetch };

if (import.meta.main) console.log(`API server listening on http://localhost:${port}`);
