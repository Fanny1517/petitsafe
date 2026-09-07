import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/supabase/prisma";
import {
  getGrilleAutoEvaluation,
  sauvegarderEvaluationCritere,
  calculerStatistiquesQualite,
  creerActionPAQ,
  getActionsPAQ,
  mettreAJourStatutActionPAQ,
} from "@/app/actions/qualite";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Axe 1 - Server Actions Référentiel Qualité & Auto-évaluation (RZPan'Da)", () => {
  let structureId: string;
  let premierCritereId: string;
  let actionCreeeId: string;

  beforeAll(async () => {
    const s = await prisma.structure.findFirst();
    if (!s) throw new Error("Aucune structure disponible pour le test");
    structureId = s.id;
  });

  afterAll(async () => {
    // Nettoyage des données de test créées
    if (actionCreeeId) {
      await prisma.actionQualite.deleteMany({ where: { id: actionCreeeId } });
    }
  });

  it("1. getGrilleAutoEvaluation charge tous les critères du référentiel national", async () => {
    const res = await getGrilleAutoEvaluation(structureId, "2026");
    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThanOrEqual(20);

    const premier = res.data[0];
    expect(premier).toHaveProperty("code");
    expect(premier).toHaveProperty("axe");
    expect(premier).toHaveProperty("titre");
    expect(premier).toHaveProperty("points_cles");
    premierCritereId = premier.id;
  });

  it("2. sauvegarderEvaluationCritere enregistre ou met à jour l'évaluation d'un critère", async () => {
    const res = await sauvegarderEvaluationCritere({
      structureId,
      critereId: premierCritereId,
      statut: "CONFORME",
      observations: "Éléments concrets validés en crèche (protocole affiché).",
      pistesAmelioration: "Poursuivre la veille.",
      periode: "2026",
    });

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.data).toBeDefined();
    expect(res.data?.statut).toBe("CONFORME");
    expect(res.data?.observations).toContain("protocole affiché");
  });

  it("3. calculerStatistiquesQualite calcule la progression et le niveau de maturité", async () => {
    const res = await calculerStatistiquesQualite(structureId, "2026");
    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.data).toBeDefined();

    expect(res.data.totalCriteres).toBeGreaterThanOrEqual(20);
    expect(res.data.evaluesCount).toBeGreaterThanOrEqual(1);
    expect(res.data.scoreGlobal).toBeGreaterThanOrEqual(0);
    expect(res.data.scoreGlobal).toBeLessThanOrEqual(100);
    expect(["A_INITIER", "EN_COURS", "CONFIRMEE", "EXCELLENCE"]).toContain(res.data.niveauMaturite);
    expect(res.data.libelleMaturite).toBeDefined();
    expect(res.data.parAxe).toBeDefined();
  });

  it("4. creerActionPAQ génère une action d'amélioration liée au critère", async () => {
    const res = await creerActionPAQ({
      structureId,
      critereId: premierCritereId,
      titre: "Sensibilisation équipe aux protocoles d'accueil",
      description: "Animation d'une réunion pédagogique d'une heure sur les transmissions",
      responsable: "Directrice de crèche",
      priorite: "HAUTE",
      echeance: "2026-11-30",
    });

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.data).toBeDefined();
    expect(res.data?.titre).toContain("Sensibilisation équipe");
    expect(res.data?.priorite).toBe("HAUTE");
    expect(res.data?.statut).toBe("A_FAIRE");
    actionCreeeId = res.data.id;
  });

  it("5. getActionsPAQ liste les actions associées à la structure", async () => {
    const res = await getActionsPAQ(structureId);
    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.some((a) => a.id === actionCreeeId)).toBe(true);
  });

  it("6. mettreAJourStatutActionPAQ permet de faire avancer et terminer une action", async () => {
    const res = await mettreAJourStatutActionPAQ({
      actionId: actionCreeeId,
      structureId,
      statut: "TERMINE",
      commentaireCloture: "Réunion menée le 15/09 avec toute l'équipe.",
    });

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.data?.statut).toBe("TERMINE");
  });
});
