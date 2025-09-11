/*
  Warnings:

  - You are about to drop the column `lessons` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "lessons",
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "preferredNameType" TEXT,
ADD COLUMN     "worldlyName" TEXT;

-- CreateTable
CREATE TABLE "public"."UserLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lesson" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3),

    CONSTRAINT "UserLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLesson_userId_lesson_key" ON "public"."UserLesson"("userId", "lesson");

-- AddForeignKey
ALTER TABLE "public"."UserLesson" ADD CONSTRAINT "UserLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
