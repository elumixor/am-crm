import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { prisma } from "services/prisma";
import { zId, zPaginator } from "utils/validators";
import { z } from "zod";

const unitSelect = {
  include: { users: { select: { id: true } } },
} as const;

export const units = new Hono()
  // Get all units (paginated)
  .get("/", zPaginator, async (c) => {
    const { skip, take } = c.req.valid("query");

    const units = await prisma.unit.findMany({ ...unitSelect, skip, take });
    return c.json({ data: units, pagination: { skip, count: units.length } });
  })
  // Get single unit data
  .get("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    const unit = await prisma.unit.findUnique({ where: { id }, ...unitSelect });
    if (!unit) return c.text("not found", 404);
    return c.json(unit);
  })
  // Create unit
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    ),
    async (c) => {
      const { name, description } = c.req.valid("json");
      const unit = await prisma.unit.create({ data: { name, description } });
      return c.json(unit, 201);
    },
  )
  // Update unit (and memberships)
  .put(
    "/:id",
    zId,
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        userIds: z.array(z.string()).optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { name, description, userIds } = c.req.valid("json");

      const unit = await prisma.unit.update({ where: { id }, data: { name, description } });
      if (!unit) return c.text("not found", 404);

      // Modify user memberships if userIds provided
      if (userIds) {
        // Clear users not in desired list
        await prisma.user.updateMany({
          where: { unitId: id, NOT: { id: { in: userIds } } },
          data: { unitId: null },
        });
        // Assign to desired users
        if (userIds.length) await prisma.user.updateMany({ where: { id: { in: userIds } }, data: { unitId: id } });
      }

      // Return updated unit with user IDs
      const withUsers = await prisma.unit.findUnique({
        where: { id },
        include: { users: { select: { id: true } } },
      });

      if (!withUsers) return c.text("not found", 404);
      return c.json(withUsers);
    },
  )
  // Delete unit
  .delete("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    await prisma.unit.delete({ where: { id } });
    return c.body(null, 204);
  });
