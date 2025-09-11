/*
  Warnings:

  - The values [SPIRITUAL,WORLDLY,CUSTOM] on the enum `PreferredNameType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PreferredNameType_new" AS ENUM ('spiritual', 'worldly', 'custom');
ALTER TABLE "public"."User" ALTER COLUMN "preferredNameType" TYPE "public"."PreferredNameType_new" USING ("preferredNameType"::text::"public"."PreferredNameType_new");
ALTER TYPE "public"."PreferredNameType" RENAME TO "PreferredNameType_old";
ALTER TYPE "public"."PreferredNameType_new" RENAME TO "PreferredNameType";
DROP TYPE "public"."PreferredNameType_old";
COMMIT;
