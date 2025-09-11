/*
  Warnings:

  - The `preferredNameType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."PreferredNameType" AS ENUM ('SPIRITUAL', 'WORLDLY', 'CUSTOM');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "preferredNameType",
ADD COLUMN     "preferredNameType" "public"."PreferredNameType";
