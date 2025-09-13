import { zValidator } from "@hono/zod-validator";
import { ApiError } from "errors";
import { Hono } from "hono";
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
  // Delete user by id
  .delete("/:id", zId, async (c) => {
    const { id } = c.req.valid("param");
    await prisma.user.delete({ where: { id } });
    return c.body(null, 204);
  });
