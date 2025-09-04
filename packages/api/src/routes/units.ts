import type { CreateUnitPayload, UpdateUnitPayload } from "@am-crm/shared";
import type { Hono } from "hono";
import { prisma } from "../db";
import { mapMembership, mapUnit } from "../mappers";

export const registerUnitRoutes = (app: Hono) => {
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

  // Memberships (add/remove users to a unit)
  app.get("/units/:id/members", async (c) => {
    const id = c.req.param("id");
    const members = await prisma.unitMembership.findMany({ where: { unitId: id }, include: { user: true } });
    return c.json(members.map(mapMembership));
  });

  app.delete("/units/:unitId/members/:userId", async (c) => {
    const { unitId, userId } = c.req.param();
    await prisma.unitMembership.delete({ where: { userId_unitId: { userId, unitId } } }).catch(() => null);
    return c.body(null, 204);
  });
};
