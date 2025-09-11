import { z } from "zod";

const schema = z.object({
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  DATABASE_URL: z.string(),
  FRONT_LOCAL_URL: z.string(),
  FRONT_PROD_URL: z.string().optional(),
  FRONT_DEV_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
