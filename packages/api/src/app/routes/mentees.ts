import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authMiddleware, requireAuth } from "services/auth";
import { prisma } from "services/prisma";
import { userSelect } from "./users";
import { mapUser } from "utils/mappers";
import { z } from "zod";

export const mentees = new Hono()
  .put("/", zValidator("json", z.object({ menteeIds: z.array(z.string()) })), authMiddleware, async (c) => {
    const userId = requireAuth(c);
    if (!userId) return c.text("unauthorized", 401);
    
    const { menteeIds } = c.req.valid("json");
    
    // Remove all current mentees for this mentor
    await prisma.user.updateMany({
      where: { mentorId: userId },
      data: { mentorId: null },
    });
    
    // Add new mentees if any
    if (menteeIds.length) {
      await prisma.user.updateMany({ 
        where: { id: { in: menteeIds } }, 
        data: { mentorId: userId } 
      });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      ...userSelect,
    });
    
    if (!user) return c.text("not found", 404);
    
    return c.json(await mapUser(user));
  });
