-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "modules_actifs" TEXT[] DEFAULT ARRAY['temperatures', 'tracabilite', 'nettoyage', 'biberonnerie', 'repas', 'changes', 'siestes', 'transmissions', 'stocks', 'protocoles']::TEXT[];
