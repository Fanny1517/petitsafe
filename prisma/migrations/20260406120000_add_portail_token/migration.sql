-- AlterTable
ALTER TABLE "Enfant" ADD COLUMN "portail_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Enfant_portail_token_key" ON "Enfant"("portail_token");
