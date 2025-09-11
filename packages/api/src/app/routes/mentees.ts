// .put("/mentees", zValidator("json", z.object({ menteeIds: z.array(z.string()) })), async (c) => {
//   const userId = requireAuth(c);
//   if (!userId) return c.text("unauthorized", 401);
//   const { menteeIds } = c.req.valid("json");
//   await prisma.user.updateMany({
//     where: { mentorId: userId, NOT: { id: { in: menteeIds } } },
//     data: { mentorId: null },
//   });
//   if (menteeIds.length)
//     await prisma.user.updateMany({ where: { id: { in: menteeIds } }, data: { mentorId: userId } });
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: { traits: true, mentees: true },
//   });
//   if (!user) return c.text("not found", 404);
//   return c.json(await mapUser(user));
// })
