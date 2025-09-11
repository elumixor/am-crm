import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const zPaginator = zValidator(
  "query",
  // Pagination params
  z
    .object({ skip: z.coerce.number().min(0).default(0), take: z.coerce.number().min(1).max(100).default(100) })
    .partial()
    .optional(),
);

export const zId = zValidator("param", z.object({ id: z.string() }));
