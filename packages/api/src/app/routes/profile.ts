import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { uploadService } from "services/aws";
import { prisma } from "services/prisma";
import { z } from "zod";
import type { WithAuth } from "./auth";
import { userSelect } from "./users";

export const profile = new Hono<WithAuth>()
  // Get my own data
  .get("/", async (c) => {
    const { userId } = c.get("auth");

    const user = await prisma.user.findUnique({ where: { id: userId }, ...userSelect });
    if (!user) return c.text("not found", 404);

    return c.json(user);
  })
  // Upload or update profile photo
  .post("/photo", zValidator("form", z.object({ photo: z.instanceof(File) })), async (c) => {
    const { userId } = c.get("auth");

    const { photo } = c.req.valid("form");

    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = photo.type ?? "application/octet-stream";
    const key = `user-photos/${userId}`;

    await uploadService.upload(key, buffer, contentType);
    await prisma.user.update({ where: { id: userId }, data: { photoKey: key } });

    // Signed URL for immediate use
    return c.json({ url: await uploadService.getSignedUrl(key) });
  });
