-- AlterTable
ALTER TABLE "Enfant" ADD COLUMN     "groupe_force" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "seuil_bebes_max" INTEGER NOT NULL DEFAULT 18,
ADD COLUMN     "seuil_moyens_max" INTEGER NOT NULL DEFAULT 30;
