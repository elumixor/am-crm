import type { CreateUnitPayload, UpdateUnitPayload } from "@am-crm/shared";
import type { App } from "../app";
import { mapUnit, mapUser } from "../utils/mappers";

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

  // Single unit with user details (names/emails) for profile page
  app.get("/units/:id", async (c) => {
    const id = c.req.param("id");
    const unit = await app.prisma.unit.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!unit) return c.text("not found", 404);
    return c.json({ ...mapUnit(unit), users: unit.users.map(mapUser), userIds: unit.users.map((u) => u.id) });
  });

  app.post("/units", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<CreateUnitPayload>;
    if (!body.name) return c.text("name required", 400);
    const unit = await app.prisma.unit.create({ data: { name: body.name, description: body.description ?? null } });
    return c.json(mapUnit(unit), 201);
  });

  app.put("/units/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Partial<UpdateUnitPayload & { userIds?: string[] }>;
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    const desiredUserIds = Array.isArray(body.userIds) ? body.userIds : null;

    const unit = await app.prisma.unit.update({ where: { id }, data }).catch(() => null);
    if (!unit) return c.text("not found", 404);

    if (desiredUserIds) {
      // Clear unitId for users currently in this unit but not in desired list
      await app.prisma.user.updateMany({
        where: { unitId: id, NOT: { id: { in: desiredUserIds } } },
        data: { unitId: null },
      });
      // Assign unitId to users in desired list
      if (desiredUserIds.length) {
        await app.prisma.user.updateMany({ where: { id: { in: desiredUserIds } }, data: { unitId: id } });
      }
    }

    const withUsers = await app.prisma.unit.findUnique({
      where: { id },
      include: { users: { select: { id: true } } },
    });
    if (!withUsers) return c.text("not found", 404); // Should not happen
    return c.json({ ...mapUnit(withUsers), userIds: withUsers.users.map((x) => x.id) });
  });

  app.delete("/units/:id", async (c) => {
    const id = c.req.param("id");
    await app.prisma.unit.delete({ where: { id } }).catch(() => null);
    return c.body(null, 204);
  });
};
