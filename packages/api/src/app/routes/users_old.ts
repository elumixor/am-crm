import { zValidator } from "@hono/zod-validator";
import { ApiError } from "errors";
import { Hono } from "hono";
import { authMiddleware, requireAuth } from "services/auth";
import { prisma } from "services/prisma";
import { zId, zPaginator } from "utils/validators";
import { z } from "zod";

export const userSelect = {
  select: {
    id: true,
    email: true,
    spiritualName: true,
    worldlyName: true,
    displayName: true,
    preferredName: true,
    preferredNameType: true,
    telegram: true,
    whatsapp: true,
    photoKey: true,
    dateOfBirth: true,
    nationality: true,
    languages: true,
    location: true,
    preferredLanguage: true,
    mentorId: true,
    mentees: { select: { id: true, email: true, displayName: true, spiritualName: true, worldlyName: true } },
    initiates: { select: { id: true, email: true, displayName: true, spiritualName: true, worldlyName: true } },
  },
};

export const users = new Hono()
  // Get all users (paginated)
  .get("/", zPaginator, async (c) => {
    const { skip, take } = c.req.valid("query") ?? {};

    const users = await prisma.user.findMany({ ...userSelect, skip, take });

    return c.json({ data: users, pagination: { skip, count: users.length } });
  })
  // Get single user data
  .get("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    const user = await prisma.user.findUnique({ where: { id }, ...userSelect });
    if (!user) throw new ApiError("User not found", 404);
    return c.json(user);
  })
  // Create new user
  .post("/", zValidator("json", z.object({ email: z.email() })), async (c) => {
    const { email } = c.req.valid("json");
    const user = await prisma.user.create({ data: { email } });
    return c.json(user, 201);
  })
  // Edit user
  .put("/:id", zId, zValidator("json", userUpdateSchema), authMiddleware, async (c) => {
    const { userId: editorId } = requireAuth(c);

    // Check permissions: only admin or self-edit
    const { id } = c.req.valid("param");

    if (editorId !== id) throw new ApiError(`Forbidden to edit user ${id} by ${editorId}`, 403);

    // Ok, we can edit
    const body = c.req.valid("json");

    // Filter out undefined values to avoid Prisma issues
    const updateData = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined));

    // We should map the date to iso datetime
    if (updateData.dateOfBirth) updateData.dateOfBirth = new Date(updateData.dateOfBirth).toISOString();

    const user = await prisma.user.update({ where: { id }, data: updateData, ...userSelect });

    // Return updated user
    return c.json(user);
  })
  // Upload user photo
  .post("/:id/photo", zId, zValidator("form", z.object({ photo: z.instanceof(File) })), authMiddleware, async (c) => {
    const { userId: editorId } = requireAuth(c);
    const { id } = c.req.valid("param");

    if (editorId !== id) throw new ApiError(`Forbidden to edit user ${id} by ${editorId}`, 403);

    const { photo } = c.req.valid("form");

    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = photo.type ?? "application/octet-stream";
    const key = `user-photos/${id}`;

    await uploadService.upload(key, buffer, contentType);

    // Store the not signed key to the user record
    await prisma.user.update({ where: { id }, data: { photoKey: key } });

    // Signed URL for immediate use
    return c.json({ url: await uploadService.getSignedUrl(key), key });
  })
  // Delete user by id
  .delete("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    await prisma.user.delete({ where: { id } });
    return c.body(null, 204);
  })
  // Add lesson to user
  .post(
    "/:id/lessons",
    zId,
    zValidator(
      "json",
      z.object({
        lesson: z.number().int().min(0).max(6),
        receivedAt: z.string().datetime().optional(),
      }),
    ),
    async (c) => {
      const { userId: editorId } = c.get("auth") ?? {};
      if (!editorId) return c.text("unauthorized", 401);

      const { id } = c.req.valid("param");
      const { lesson, receivedAt } = c.req.valid("json");

      // Check permissions: only admin or self-edit
      if (editorId !== id) {
        return c.text("forbidden", 403);
      }

      const userLesson = await prisma.userLesson.upsert({
        where: { userId_lesson: { userId: id, lesson } },
        update: { receivedAt: receivedAt ? new Date(receivedAt) : null },
        create: {
          userId: id,
          lesson,
          receivedAt: receivedAt ? new Date(receivedAt) : null,
        },
      });

      return c.json(userLesson, 201);
    },
  )
  // Remove lesson from user
  .delete("/:id/lessons/:lesson", zValidator("param", z.object({ id: z.string(), lesson: z.string() })), async (c) => {
    const { userId: editorId } = c.get("auth") ?? {};
    if (!editorId) return c.text("unauthorized", 401);

    const { id, lesson } = c.req.valid("param");
    const lessonNum = parseInt(lesson, 10);

    // Check permissions: only admin or self-edit
    if (editorId !== id) {
      return c.text("forbidden", 403);
    }

    await prisma.userLesson.delete({
      where: { userId_lesson: { userId: id, lesson: lessonNum } },
    });

    return c.body(null, 204);
  })
  // Add trait to user
  .post("/:id/traits", zId, zValidator("json", z.object({ trait: z.string() })), authMiddleware, async (c) => {
    const { userId: editorId } = requireAuth(c);
    const { id } = c.req.valid("param");
    const { trait } = c.req.valid("json");

    // Check permissions: only admin or self-edit
    if (editorId !== id) throw new ApiError(`Forbidden to edit user ${id} by ${editorId}`, 403);

    const userTrait = await prisma.userTrait.upsert({
      where: { userId_trait: { userId: id, trait } },
      update: {},
      create: { userId: id, trait },
    });

    return c.json(userTrait, 201);
  })
  // Remove trait from user
  .delete(
    "/:id/traits/:trait",
    zValidator("param", z.object({ id: z.string(), trait: z.string() })),
    authMiddleware,
    async (c) => {
      const { userId: editorId } = requireAuth(c);
      const { id, trait } = c.req.valid("param");

      // Check permissions: only admin or self-edit
      if (editorId !== id) throw new ApiError(`Forbidden to edit user ${id} by ${editorId}`, 403);

      await prisma.userTrait.delete({
        where: { userId_trait: { userId: id, trait } },
      });

      return c.body(null, 204);
    },
  );
