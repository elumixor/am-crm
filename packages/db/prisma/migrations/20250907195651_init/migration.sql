/*
  Warnings:

  - You are about to drop the column `telegramHandle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramHandle",
ADD COLUMN     "telegram" TEXT;
