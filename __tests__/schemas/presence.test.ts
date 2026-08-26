import { describe, it, expect } from "vitest";
import {
  pointagePresenceSchema,
  declarationAbsenceSchema,
  updateHeuresPresenceSchema,
} from "@/lib/schemas/presence";

describe("pointagePresenceSchema", () => {
  it("accepte un pointage rapide présent valide", () => {
    const res = pointagePresenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      est_present: true,
      releve_par_nom: "Julie",
    });
    expect(res.success).toBe(true);
  });

  it("accepte un pointage rapide absent valide", () => {
    const res = pointagePresenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      est_present: false,
    });
    expect(res.success).toBe(true);
  });

  it("rejette si structure_id ou enfant_id est vide", () => {
    const res = pointagePresenceSchema.safeParse({
      structure_id: "",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      est_present: true,
    });
    expect(res.success).toBe(false);
  });
});

describe("declarationAbsenceSchema", () => {
  it("accepte une absence avec motif et certificat", () => {
    const res = declarationAbsenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      statut: "ABSENT_JUSTIFIE",
      motif_absence: "Fièvre et toux",
      certificat_fourni: true,
      observations: "Retour prévu après avis pédiatre",
    });
    expect(res.success).toBe(true);
  });

  it("accepte un congé", () => {
    const res = declarationAbsenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      statut: "CONGE",
      motif_absence: "Vacances d'avril",
    });
    expect(res.success).toBe(true);
  });

  it("rejette sans motif_absence", () => {
    const res = declarationAbsenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      statut: "ABSENT",
      motif_absence: "",
    });
    expect(res.success).toBe(false);
  });
});

describe("updateHeuresPresenceSchema", () => {
  it("accepte les heures d'arrivée et de départ", () => {
    const res = updateHeuresPresenceSchema.safeParse({
      structure_id: "struct-1",
      enfant_id: "enfant-1",
      date: "2026-03-30",
      heure_arrivee: new Date().toISOString(),
      heure_depart: new Date().toISOString(),
      observations: "Récupéré par les grands-parents",
    });
    expect(res.success).toBe(true);
  });
});
