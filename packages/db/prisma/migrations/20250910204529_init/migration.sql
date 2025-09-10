/*
  Warnings:

  - Made the column `preferredNameType` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "preferredNameType" SET NOT NULL,
ALTER COLUMN "preferredNameType" SET DEFAULT 'spiritual';
