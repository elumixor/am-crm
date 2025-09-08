import { Prisma } from "@am-crm/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { prisma } from "services/prisma";
import { zId, zPaginator } from "utils/validators";
import { z } from "zod";

export const userSelect = {
  include: Prisma.validator<Prisma.UserInclude>()({
    mentees: { select: { id: true } },
    initiates: { select: { id: true } },
  }),
};

export const users = new Hono()
  // Get all users (paginated)
  .get("/", zPaginator, async (c) => {
    const { skip, take } = c.req.valid("query");

    const users = await prisma.user.findMany({ ...userSelect, skip, take });

    return c.json({ data: users, pagination: { skip, count: users.length } });
  })
  // Get single user data
  .get("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    const user = await prisma.user.findUnique({ where: { id }, ...userSelect });
    if (!user) return c.text("not found", 404);
    return c.json(user);
  })
  // Create new user
  .post("/", zValidator("json", z.object({ email: z.email() })), async (c) => {
    const { email } = c.req.valid("json");
    const user = await prisma.user.create({ data: { email } });
    return c.json(user, 201);
  })
  // Edit user
  .put(
    "/:id",
    zId,
    zValidator(
      "json",
      z
        .object({
          email: z.email(),
          fullName: z.string().nullable(),
          spiritualName: z.string().nullable(),
          displayName: z.string().nullable(),
          telegram: z.string().nullable(),
          whatsapp: z.string().nullable(),
          dateOfBirth: z.string().nullable(),
          nationality: z.string().nullable(),
          languages: z.string().nullable(),
          location: z.string().nullable(),
          preferredLanguage: z.string().nullable(),
          unitId: z.string().nullable(),
          mentorId: z.string().nullable(),
          acaryaId: z.string().nullable(),
          lessons: z.string().optional(),
        })
        .partial(),
    ),
    async (c) => {
      const { userId: editorId } = c.get("auth") ?? {}; // get the current user, the one making the edit request
      if (!editorId) return c.text("unauthorized", 401);

      // Check permissions: only admin or self-edit
      const { id } = c.req.valid("param");

      if (editorId !== id) {
        return c.text("forbidden", 403); // todo: later add different permissions (admins, unit secretaries, etc.)
        // const user = await prisma.user.findUnique({ where: { id } });
        // if (!user || user.role !== "admin") {
        //   return c.text("forbidden", 403);
        // }
      }

      // Ok, we can edit

      const body = c.req.valid("json");

      // Just pass the body, it was already validated
      const user = await prisma.user.update({ where: { id }, data: { ...body }, ...userSelect });

      // Return updated user
      return c.json(user);
    },
  )
  // Delete user by id
  .delete("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    await prisma.user.delete({ where: { id } });
    return c.body(null, 204);
  });
