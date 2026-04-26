-- CreateEnum
CREATE TYPE "RoleProfil" AS ENUM ('ADMINISTRATEUR', 'PROFESSIONNEL');

-- AlterTable
ALTER TABLE "Biberon" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "Change" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "ReceptionMarchandise" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "RelevePlat" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "ReleveTemperature" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "Repas" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "Sieste" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "Transmission" ADD COLUMN     "profil_id" TEXT;

-- AlterTable
ALTER TABLE "ValidationNettoyage" ADD COLUMN     "profil_id" TEXT;

-- CreateTable
CREATE TABLE "Profil" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "poste" TEXT,
    "role" "RoleProfil" NOT NULL DEFAULT 'PROFESSIONNEL',
    "telephone" TEXT,
    "email" TEXT,
    "certifications" TEXT,
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profil_structure_id_idx" ON "Profil"("structure_id");

-- CreateIndex
CREATE INDEX "Profil_structure_id_actif_idx" ON "Profil"("structure_id", "actif");

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biberon" ADD CONSTRAINT "Biberon_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repas" ADD CONSTRAINT "Repas_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Change" ADD CONSTRAINT "Change_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sieste" ADD CONSTRAINT "Sieste_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleveTemperature" ADD CONSTRAINT "ReleveTemperature_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelevePlat" ADD CONSTRAINT "RelevePlat_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionMarchandise" ADD CONSTRAINT "ReceptionMarchandise_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationNettoyage" ADD CONSTRAINT "ValidationNettoyage_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
