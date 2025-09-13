-- CreateTable
CREATE TABLE "UserTrait" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trait" TEXT NOT NULL,

    CONSTRAINT "UserTrait_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserTrait_trait_idx" ON "UserTrait"("trait");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrait_userId_trait_key" ON "UserTrait"("userId", "trait");

-- AddForeignKey
ALTER TABLE "UserTrait" ADD CONSTRAINT "UserTrait_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;