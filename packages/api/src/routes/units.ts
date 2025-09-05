import type { CreateUnitPayload, UpdateUnitPayload } from "@am-crm/shared";
import type { App } from "../app";
import { mapUnit } from "../utils/mappers";

export const registerUnitRoutes = (app: App) => {
  // Units CRUD
  app.get("/units", async (c) => {
    const units = await app.prisma.unit.findMany({ include: { users: { select: { id: true } } } });
    return c.json(
      units.map((u) => ({
        ...mapUnit(u),
        userIds: u.users.map((x) => x.id),
      })),
    );
  });

  app.post("/units", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<CreateUnitPayload>;
    if (!body.name) return c.text("name required", 400);
    const unit = await app.prisma.unit.create({ data: { name: body.name, description: body.description ?? null } });
    return c.json(mapUnit(unit), 201);
  });

  app.put("/units/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Partial<UpdateUnitPayload>;
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    const unit = await app.prisma.unit
      .update({ where: { id }, data, include: { users: { select: { id: true } } } })
      .catch(() => null);
    if (!unit) return c.text("not found", 404);
    return c.json({ ...mapUnit(unit), userIds: unit.users.map((x) => x.id) });
  });

  app.delete("/units/:id", async (c) => {
    const id = c.req.param("id");
    await app.prisma.unit.delete({ where: { id } }).catch(() => null);
    return c.body(null, 204);
  });
};
