import type { AddTraitPayload, CreateUserPayload, UpdateUserPayload } from "@am-crm/shared";
import type { App } from "../app";
import { mapTrait, mapUser } from "../utils/mappers";

export const registerUserRoutes = (app: App) => {
  // Users CRUD
  app.get("/users", async (c) => {
    // Include mentees relation so menteeIds are populated in DTO (frontend relies on this)
    const users = await app.prisma.user.findMany({ include: { traits: true, mentees: true } });
    return c.json(users.map(mapUser));
  });

  app.get("/users/:id", async (c) => {
    const id = c.req.param("id");
    const user = await app.prisma.user.findUnique({
      where: { id },
      include: { traits: true, mentees: true },
    });
    if (!user) return c.text("not found", 404);
    return c.json(mapUser(user));
  });

  app.post("/users", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<CreateUserPayload>;
    if (!body.email) return c.text("email required", 400);
    const user = await app.prisma.user.create({ data: { email: body.email } });
    return c.json(mapUser(user), 201);
  });

  app.put("/users/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Partial<UpdateUserPayload>;
    const data: Record<string, unknown> = {};
    if (body.email !== undefined) data.email = body.email;
    const user = await app.prisma.user.update({ where: { id }, data }).catch(() => null);
    if (!user) return c.text("not found", 404);
    return c.json(mapUser(user));
  });

  app.delete("/users/:id", async (c) => {
    const id = c.req.param("id");
    await app.prisma.user.delete({ where: { id } }).catch(() => null);
    return c.body(null, 204);
  });

  // Traits
  app.get("/users/:id/traits", async (c) => {
    const id = c.req.param("id");
    const traits = await app.prisma.userTrait.findMany({ where: { userId: id } });
    return c.json(traits.map(mapTrait));
  });

  app.post("/users/:id/traits", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Partial<AddTraitPayload>;
    if (!body.trait) return c.text("trait required", 400);
    const created = await app.prisma.userTrait.upsert({
      where: { userId_trait: { userId: id, trait: body.trait } },
      update: {},
      create: { userId: id, trait: body.trait },
    });
    return c.json(mapTrait(created), 201);
  });

  app.delete("/users/:id/traits/:trait", async (c) => {
    const { id, trait } = c.req.param();
    await app.prisma.userTrait.delete({ where: { userId_trait: { userId: id, trait } } }).catch(() => null);
    return c.body(null, 204);
  });
};
