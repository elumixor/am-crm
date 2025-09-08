import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { uploadService } from "services/aws";
import { z } from "zod";

export const signedUrl = new Hono()
  // Get signed URL for upload
  .get("/:key", zValidator("param", z.object({ key: z.string() })), async (c) => {
    const { key } = c.req.valid("param");
    const url = uploadService.getSignedUrl(key);
    return c.json({ url });
  });
