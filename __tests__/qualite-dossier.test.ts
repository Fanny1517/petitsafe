import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDossierQuinquennalData } from "@/app/actions/qualite-dossier";
import { prisma } from "@/lib/supabase/prisma";

// Mock des accès de sécurité
vi.mock("@/lib/security/auth-context", () => ({
  assertAccess: vi.fn().mockResolvedValue({ id: "mock-user", role: "DIRECTRICE" }),
}));

describe("Axe 4 : getDossierQuinquennalData", () => {
  const structureId = "10992019-922e-4e22-a022-67bda51e49d4";

  it("doit consolider les données de la structure et les indicateurs des 3 axes", async () => {
    const res = await getDossierQuinquennalData(structureId, "Cycle 2021-2026");

    expect(res.success).toBe(true);
    if (res.success && res.data) {
      const { structure, completude, criteresAvecEval, enquetesSynthese, actionsPAQ, preuvesTerrain } = res.data;

      // 1. Structure
      expect(structure.id).toBe(structureId);
      expect(structure.nom).toBeDefined();

      // 2. Complétude
      expect(completude.tauxGlobal).toBeGreaterThanOrEqual(0);
      expect(completude.tauxGlobal).toBeLessThanOrEqual(100);
      expect(["NON_DEMARRE", "EN_CONSTITUTION", "PRET_POUR_TRANSMISSION"]).toContain(completude.statutPreparation);
      expect(Array.isArray(completude.pointsForts)).toBe(true);
      expect(Array.isArray(completude.pointsVigilance)).toBe(true);

      // 3. Axe 1 : Critères
      expect(Array.isArray(criteresAvecEval)).toBe(true);
      expect(criteresAvecEval.length).toBeGreaterThanOrEqual(0);

      // 4. Axe 2 : Enquêtes
      expect(Array.isArray(enquetesSynthese)).toBe(true);

      // 5. Axe 3 : Actions PAQ
      expect(Array.isArray(actionsPAQ)).toBe(true);

      // 6. Preuves opérationnelles terrain
      expect(preuvesTerrain.temperaturesHaccp).toBeDefined();
      expect(preuvesTerrain.nettoyage).toBeDefined();
      expect(preuvesTerrain.medicamentsEtPai).toBeDefined();
      expect(preuvesTerrain.presences).toBeDefined();
    }
  });

  it("doit renvoyer une erreur si la structure n'existe pas", async () => {
    const res = await getDossierQuinquennalData("structure-inexistante-999");
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toBe("Structure introuvable.");
    }
  });
});
