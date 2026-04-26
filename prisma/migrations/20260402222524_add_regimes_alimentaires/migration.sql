-- AlterTable
ALTER TABLE "Enfant" ADD COLUMN     "regimes" TEXT[] DEFAULT ARRAY[]::TEXT[];
