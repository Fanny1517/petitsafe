// RZPan'Da — Types & Constantes Référentiel Qualité & Auto-évaluation
import { AxeQualite, StatutConformite } from "@prisma/client";

export const POIDS_STATUT: Record<StatutConformite, number> = {
  NON_EVALUE: 0,
  A_AMELIORER: 25,
  PARTIELLEMENT_CONFORME: 50,
  CONFORME: 85,
  EXEMPLAIRE: 100,
};

export const LIBELLES_AXES: Record<AxeQualite, string> = {
  ACCUEIL_SECURITE: "Accueil, Sécurité, Santé & Hygiène",
  DEVELOPPEMENT_EVEIL: "Développement, Éveil & Bientraitance",
  RELATION_FAMILLES: "Relation Familles & Co-éducation",
  PILOTAGE_RISQUES: "Organisation, Équipe & Pilotage des risques",
};

export interface CritereAvecEvaluation {
  id: string;
  code: string;
  axe: AxeQualite;
  titre: string;
  description: string;
  points_cles: string[];
  guide_ministeriel: string | null;
  ordre: number;
  poids: number;
  preuves_suggerees: string[];
  source_preuve_auto: string | null;
  evaluation?: {
    id: string;
    statut: StatutConformite;
    observations: string | null;
    pistes_amelioration: string | null;
    evalue_par_nom: string | null;
    derniere_eval: Date;
  } | null;
  actionsCount: number;
}

export interface StatsAxeQualite {
  axe: AxeQualite;
  label: string;
  totalCriteres: number;
  evaluesCount: number;
  scoreMoyen: number; // 0 à 100%
  repartition: Record<StatutConformite, number>;
}

export interface StatsGlobalesQualite {
  periode: string;
  totalCriteres: number;
  evaluesCount: number;
  progressionPourcent: number;
  scoreGlobal: number; // 0 à 100%
  niveauMaturite: "A_INITIER" | "EN_COURS" | "CONFIRMEE" | "EXCELLENCE";
  libelleMaturite: string;
  parAxe: Record<AxeQualite, StatsAxeQualite>;
  repartitionGlobale: Record<StatutConformite, number>;
  actionsPAQCount: number;
}

export interface PreuvesAutomatiques {
  temperaturesHaccp: {
    totalSemaine: number;
    anomaliesSemaine: number;
    dernierReleve: Date | null;
    conforme: boolean;
  };
  nettoyage: {
    validationsSemaine: number;
    conforme: boolean;
  };
  medicamentsEtPai: {
    paisActifs: number;
    administrationsSemaine: number;
    conforme: boolean;
  };
  presences: {
    presentsAujourdhui: number;
    conforme: boolean;
  };
}

export interface AxeMaturiteStat {
  total: number;
  conformes: number;
  partiels: number;
  a_ameliorer: number;
  non_evalues: number;
  taux: number;
}

export interface MaturiteStats {
  total: number;
  evalues: number;
  conformes: number;
  partiels: number;
  a_ameliorer: number;
  non_evalues: number;
  pourcentage_conformite: number;
  score_global: number;
  niveau_maturite: string;
  par_axe: Record<AxeQualite, AxeMaturiteStat>;
}

/**
 * Construit un objet MaturiteStats complet et standardisé,
 * soit à partir des statistiques serveur calculées, soit en recalculant localement à partir des critères.
 */
export function buildMaturiteStatsFromCriteres(
  criteres: Array<{
    chapitre?: string | null;
    axe?: AxeQualite | string | null;
    code?: string | null;
    evaluation?: { statut?: StatutConformite | string | null } | null;
  }>,
  serverStats?: StatsGlobalesQualite | null
): MaturiteStats {
  const axes: AxeQualite[] = [
    "ACCUEIL_SECURITE",
    "DEVELOPPEMENT_EVEIL",
    "RELATION_FAMILLES",
    "PILOTAGE_RISQUES",
  ];

  const emptyAxeStat = (): AxeMaturiteStat => ({
    total: 0,
    conformes: 0,
    partiels: 0,
    a_ameliorer: 0,
    non_evalues: 0,
    taux: 0,
  });

  const par_axe: Record<AxeQualite, AxeMaturiteStat> = {
    ACCUEIL_SECURITE: emptyAxeStat(),
    DEVELOPPEMENT_EVEIL: emptyAxeStat(),
    RELATION_FAMILLES: emptyAxeStat(),
    PILOTAGE_RISQUES: emptyAxeStat(),
  };

  if (serverStats && serverStats.parAxe) {
    for (const axe of axes) {
      const s = serverStats.parAxe[axe];
      if (s) {
        par_axe[axe] = {
          total: s.totalCriteres ?? 0,
          conformes: (s.repartition?.CONFORME || 0) + (s.repartition?.EXEMPLAIRE || 0),
          partiels: s.repartition?.PARTIELLEMENT_CONFORME || 0,
          a_ameliorer: s.repartition?.A_AMELIORER || 0,
          non_evalues: s.repartition?.NON_EVALUE || 0,
          taux: s.scoreMoyen ?? 0,
        };
      }
    }

    const repartition = serverStats.repartitionGlobale || ({} as Record<StatutConformite, number>);
    const conformes = (repartition.CONFORME || 0) + (repartition.EXEMPLAIRE || 0);
    const partiels = repartition.PARTIELLEMENT_CONFORME || 0;
    const a_ameliorer = repartition.A_AMELIORER || 0;
    const non_evalues = repartition.NON_EVALUE || 0;

    return {
      total: serverStats.totalCriteres ?? criteres.length,
      evalues: serverStats.evaluesCount ?? 0,
      conformes,
      partiels,
      a_ameliorer,
      non_evalues,
      pourcentage_conformite: serverStats.progressionPourcent ?? 0,
      score_global: serverStats.scoreGlobal ?? 0,
      niveau_maturite: serverStats.libelleMaturite || "Démarche à initier",
      par_axe,
    };
  }

  // Calcul direct à partir des critères
  const total = criteres.length;
  let conformes = 0;
  let partiels = 0;
  let a_ameliorer = 0;

  for (const c of criteres) {
    const statut = c.evaluation?.statut;
    if (statut === "CONFORME" || statut === "EXEMPLAIRE") conformes++;
    else if (statut === "PARTIELLEMENT_CONFORME") partiels++;
    else if (statut === "A_AMELIORER") a_ameliorer++;

    const axeCorrespondant = axes.find(
      (a) => c.chapitre === a || c.axe === a
    );
    if (axeCorrespondant) {
      const aStat = par_axe[axeCorrespondant];
      aStat.total++;
      if (statut === "CONFORME" || statut === "EXEMPLAIRE") aStat.conformes++;
      else if (statut === "PARTIELLEMENT_CONFORME") aStat.partiels++;
      else if (statut === "A_AMELIORER") aStat.a_ameliorer++;
      else aStat.non_evalues++;
    }
  }

  const evalues = conformes + partiels + a_ameliorer;
  const non_evalues = total - evalues;
  const score_global = total > 0 ? Math.round(((conformes * 1 + partiels * 0.5) / total) * 100) : 0;

  for (const axe of axes) {
    const a = par_axe[axe];
    a.taux = a.total > 0 ? Math.round(((a.conformes * 1 + a.partiels * 0.5) / a.total) * 100) : 0;
    a.non_evalues = a.total - (a.conformes + a.partiels + a.a_ameliorer);
  }

  let niveau = "À initier";
  if (score_global >= 90) niveau = "Excellence & Maîtrise";
  else if (score_global >= 75) niveau = "Démarche confirmée";
  else if (score_global >= 50) niveau = "En cours de structuration";

  return {
    total,
    evalues,
    conformes,
    partiels,
    a_ameliorer,
    non_evalues,
    pourcentage_conformite: total > 0 ? Math.round((evalues / total) * 100) : 0,
    score_global,
    niveau_maturite: niveau,
    par_axe,
  };
}
