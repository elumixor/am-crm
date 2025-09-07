import type { SetMenteesPayload, UpdateUserPayload } from "@am-crm/shared";
import type { App } from "../app/app";
import { mapUser } from "../utils/mappers";
import { requireAuth } from "./auth";

export const registerProfileRoutes = (app: App) => {
  // Attach auth extraction for /me root as well
  app.use("/me", async (c, next) => {
    const auth = c.req.header("authorization");
    if (auth?.startsWith("Bearer ")) {
      const _token = auth.slice(7);
      // Will be set by auth route middleware if exists, else ignore
    }
    await next();
  });

  app.get("/me", async (c) => {
    const userId = requireAuth(c);
    if (!userId) return c.text("unauthorized", 401);
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      include: { traits: true, mentees: true },
    });
    if (!user) return c.text("not found", 404);
    return c.json(mapUser(user));
  });

  app.put("/me", async (c) => {
    const userId = requireAuth(c);
    if (!userId) return c.text("unauthorized", 401);
    const body = (await c.req.json().catch(() => ({}))) as UpdateUserPayload;
    const data: Record<string, unknown> = {};
    const fields: (keyof UpdateUserPayload)[] = [
      // Allow updating email from profile editor (optional)
      "email",
      "fullName",
      "spiritualName",
      "displayName",
      "telegramHandle",
      "whatsapp",
      // photoUrl not directly writable; use /me/photo upload flow
      "dateOfBirth",
      "nationality",
      "languages",
      "location",
      "preferredLanguage",
      "unitId",
      "mentorId",
      "acaryaId",
      "lessons",
    ];
    for (const f of fields) if (f in body) data[f] = body[f];
    if (body.dateOfBirth) data.dateOfBirth = new Date(body.dateOfBirth);
    if (body.lessons) data.lessons = body.lessons; // pass JSON array directly
    const user = await app.prisma.user.update({
      where: { id: userId },
      data,
      include: { traits: true, mentees: true },
    });
    return c.json(mapUser(user));
  });

  app.put("/me/mentees", async (c) => {
    const userId = requireAuth(c);
    if (!userId) return c.text("unauthorized", 401);
    const body = (await c.req.json().catch(() => ({}))) as SetMenteesPayload;
    const menteeIds = Array.isArray(body.menteeIds) ? body.menteeIds : [];
    // Clear existing mentees not in list
    await app.prisma.user.updateMany({
      where: { mentorId: userId, NOT: { id: { in: menteeIds } } },
      data: { mentorId: null },
    });
    // Set mentor for each id
    if (menteeIds.length)
      await app.prisma.user.updateMany({ where: { id: { in: menteeIds } }, data: { mentorId: userId } });
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      include: { traits: true, mentees: true },
    });
    if (!user) return c.text("not found", 404);
    return c.json(mapUser(user));
  });

  // Photo upload: client sends multipart/form-data with field "photo"
  app.post("/me/photo", async (c) => {
    const userId = requireAuth(c);
    if (!userId) return c.text("unauthorized", 401);

    let form: FormData | null = null;
    try {
      form = await c.req.formData();
    } catch {
      return c.text("invalid form-data", 400);
    }
    if (!form) return c.text("form-data required", 400);

    const file = form.get("photo");
    if (!(file instanceof File)) return c.text("photo file required", 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || "application/octet-stream";
    const key = `user-photos/${userId}`;
    await app.uploadService.upload(key, buffer, contentType);

    // Update only the photoKey; cast the field name to satisfy pre-generate types
    await app.prisma.user.update({ where: { id: userId }, data: { /* @ts-ignore-next-line */ photoKey: key } });

    // Return a fresh signed URL for immediate use
    const url = await app.s3.getSignedUrl(key);
    return c.json({ url });
  });
};
