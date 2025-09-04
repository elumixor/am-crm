import type { AddMemberPayload, AddTraitPayload, CreateUserPayload, UpdateUserPayload } from "@am-crm/shared";
import type { Hono } from "hono";
import { prisma } from "../db";
import { mapMembership, mapTrait, mapUser } from "../mappers";

export const registerUserRoutes = (app: Hono) => {
  // Users CRUD
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

  // Memberships (user-centric additions)
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
};
