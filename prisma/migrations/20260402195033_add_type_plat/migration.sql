-- CreateEnum
CREATE TYPE "TypePlat" AS ENUM ('CHAUD', 'FROID');

-- AlterTable
ALTER TABLE "RelevePlat" ADD COLUMN     "type_plat" "TypePlat" NOT NULL DEFAULT 'CHAUD';
