/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserTrait` table. All the data in the column will be lost.
  - You are about to drop the `UnitMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UnitMembership" DROP CONSTRAINT "UnitMembership_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitMembership" DROP CONSTRAINT "UnitMembership_userId_fkey";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "createdAt",
ADD COLUMN     "officialRegisteredAt" TIMESTAMP(3),
ADD COLUMN     "unofficialRegisteredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "acaryaId" TEXT,
ADD COLUMN     "lessons" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "UserTrait" DROP COLUMN "createdAt";

-- DropTable
DROP TABLE "UnitMembership";

-- DropEnum
DROP TYPE "UnitRole";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_acaryaId_fkey" FOREIGN KEY ("acaryaId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
