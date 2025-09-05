-- DropForeignKey
ALTER TABLE "UnitMembership" DROP CONSTRAINT "UnitMembership_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitMembership" DROP CONSTRAINT "UnitMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTrait" DROP CONSTRAINT "UserTrait_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mentorId" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "preferredLanguage" TEXT,
ADD COLUMN     "spiritualName" TEXT,
ADD COLUMN     "telegramHandle" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitMembership" ADD CONSTRAINT "UnitMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitMembership" ADD CONSTRAINT "UnitMembership_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
