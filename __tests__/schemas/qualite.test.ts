import { describe, it, expect } from "vitest";
import {
  evaluationCritereSchema,
  actionPAQSchema,
  updateActionPAQSchema,
  filtreQualiteSchema,
} from "@/lib/schemas/qualite";

describe("evaluationCritereSchema", () => {
  it("valide une évaluation complète avec succès", () => {
    const data = {
      structureId: "11111111-1111-4111-8111-111111111111",
      critereId: "22222222-2222-4222-8222-222222222222",
      statut: "CONFORME",
      observations: "Tous les protocoles d'accueil et d'adaptation sont affichés et respectés.",
      pistes_amelioration: "Poursuivre la formation continue des auxiliaires.",
      periode: "2026",
    };
    const res = evaluationCritereSchema.safeParse(data);
    expect(res.success).toBe(true);
  });

  it("rejette un statut de conformité inexistant", () => {
    const data = {
      structureId: "11111111-1111-4111-8111-111111111111",
      critereId: "22222222-2222-4222-8222-222222222222",
      statut: "PARFAIT", // Invalide
    };
    const res = evaluationCritereSchema.safeParse(data);
    expect(res.success).toBe(false);
  });

  it("rejette un UUID de structure invalide", () => {
    const data = {
      structureId: "invalid-uuid",
      critereId: "22222222-2222-4222-8222-222222222222",
      statut: "A_AMELIORER",
    };
    const res = evaluationCritereSchema.safeParse(data);
    expect(res.success).toBe(false);
  });
});

describe("actionPAQSchema", () => {
  it("valide la création d'une action d'amélioration PAQ", () => {
    const data = {
      structureId: "11111111-1111-4111-8111-111111111111",
      critereId: "22222222-2222-4222-8222-222222222222",
      titre: "Organiser un atelier sur le sommeil apaisé",
      description: "Sensibiliser l'équipe à la synchronisation des rythmes de sieste.",
      responsable: "Directrice adjointe",
      priorite: "HAUTE",
      echeance: "2026-10-15",
    };
    const res = actionPAQSchema.safeParse(data);
    expect(res.success).toBe(true);
  });

  it("rejette un titre trop court (< 3 caractères)", () => {
    const data = {
      structureId: "11111111-1111-4111-8111-111111111111",
      critereId: "22222222-2222-4222-8222-222222222222",
      titre: "Ok",
    };
    const res = actionPAQSchema.safeParse(data);
    expect(res.success).toBe(false);
  });
});

describe("updateActionPAQSchema", () => {
  it("valide la clôture d'une action PAQ avec statut TERMINE", () => {
    const data = {
      actionId: "33333333-3333-4333-8333-333333333333",
      structureId: "11111111-1111-4111-8111-111111111111",
      statut: "TERMINE",
      commentaire_cloture: "Atelier réalisé avec 100% de présence de l'équipe.",
    };
    const res = updateActionPAQSchema.safeParse(data);
    expect(res.success).toBe(true);
  });
});

describe("filtreQualiteSchema", () => {
  it("valide les filtres par défaut", () => {
    const res = filtreQualiteSchema.safeParse({});
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.axe).toBe("TOUS");
      expect(res.data.statut).toBe("TOUS");
      expect(res.data.recherche).toBe("");
    }
  });

  it("valide un filtre d'axe spécifique", () => {
    const res = filtreQualiteSchema.safeParse({ axe: "ACCUEIL_SECURITE", statut: "A_AMELIORER" });
    expect(res.success).toBe(true);
  });
});
