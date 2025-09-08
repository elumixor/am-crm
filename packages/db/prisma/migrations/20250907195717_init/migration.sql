/*
  Warnings:

  - You are about to drop the `UserTrait` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTrait" DROP CONSTRAINT "UserTrait_userId_fkey";

-- DropTable
DROP TABLE "UserTrait";
