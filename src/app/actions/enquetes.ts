"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/supabase/prisma";
import { assertAccess } from "@/lib/security/auth-context";
import { randomBytes } from "crypto";
import {
  CreerEnqueteSchema,
  SoumettreReponseParentSchema,
  type CreerEnqueteInput,
  type SoumettreReponseParentInput,
} from "@/lib/schemas/enquetes";
import { AxeQualite } from "@prisma/client";
import { envoyerNotificationNouvelleEvaluation } from "@/lib/email";

/**
 * Récupère les enquêtes d'une structure pour l'espace gestionnaire
 */
export async function getEnquetesStructure(structureId: string) {
  try {
    await assertAccess(structureId);

    const enquetes = await prisma.enqueteSatisfaction.findMany({
      where: { structure_id: structureId },
      include: {
        _count: {
          select: { reponses: true, questions: true },
        },
        questions: {
          orderBy: { ordre: "asc" },
        },
      },
      orderBy: { date_creation: "desc" },
    });

    return { enquetes };
  } catch (err: any) {
    console.error("Erreur getEnquetesStructure:", err);
    return { error: err.message || "Impossible de charger les enquêtes" };
  }
}

/**
 * Crée une nouvelle campagne d'enquête (sur template ou personnalisée)
 */
export async function creerEnqueteCampagne(rawInput: CreerEnqueteInput) {
  try {
    const parsed = CreerEnqueteSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Données invalides" };
    }

    const data = parsed.data;
    await assertAccess(data.structureId);
    const token = randomBytes(12).toString("hex");

    const enquete = await prisma.enqueteSatisfaction.create({
      data: {
        structure_id: data.structureId,
        titre: data.titre,
        description: data.description || null,
        type_enquete: data.type_enquete,
        token: token,
        actif: true,
        anonyme: data.anonyme,
        emails_notification: data.emails_notification || [],
        cible_reponses: data.cible_reponses || null,
        date_debut: data.date_debut ? new Date(data.date_debut) : new Date(),
        date_fin: data.date_fin ? new Date(data.date_fin) : null,
        questions: {
          create: data.questions.map((q, idx) => ({
            libelle: q.libelle,
            type_question: q.type_question,
            obligatoire: q.obligatoire,
            ordre: q.ordre || idx + 1,
            axe_qualite: q.axe_qualite || null,
            options: q.options || [],
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    revalidatePath(`/dashboard/${data.structureId}/qualite/enquetes`);
    revalidatePath(`/dashboard/${data.structureId}/qualite/enquetes/`);
    return { success: true, enquete };
  } catch (err: any) {
    console.error("Erreur creerEnqueteCampagne:", err);
    return { error: "Impossible de créer la campagne d'enquête" };
  }
}

/**
 * Active ou clôture une enquête
 */
export async function toggleStatutEnquete(enqueteId: string, actif: boolean, structureId: string) {
  try {
    await assertAccess(structureId);

    const enquete = await prisma.enqueteSatisfaction.update({
      where: { id: enqueteId },
      data: { actif },
    });

    revalidatePath(`/dashboard/${structureId}/qualite/enquetes`);
    revalidatePath(`/dashboard/${structureId}/qualite/enquetes/`);
    return { success: true, enquete };
  } catch (err: any) {
    console.error("Erreur toggleStatutEnquete:", err);
    return { error: err.message || "Erreur lors du changement de statut" };
  }
}

/**
 * Supprime une enquête et toutes ses réponses
 */
export async function supprimerEnquete(enqueteId: string, structureId: string) {
  try {
    await assertAccess(structureId);

    await prisma.enqueteSatisfaction.delete({
      where: { id: enqueteId },
    });

    revalidatePath(`/dashboard/${structureId}/qualite/enquetes`);
    revalidatePath(`/dashboard/${structureId}/qualite/enquetes/`);
    return { success: true };
  } catch (err: any) {
    console.error("Erreur supprimerEnquete:", err);
    return { error: err.message || "Erreur lors de la suppression" };
  }
}

/**
 * Récupère les informations publiques d'une enquête pour les familles (via token)
 */
export async function getEnquetePublicData(token: string) {
  try {
    const enquete = await prisma.enqueteSatisfaction.findUnique({
      where: { token },
      include: {
        structure: {
          select: { nom: true, ville: true, email: true },
        },
        questions: {
          orderBy: { ordre: "asc" },
        },
        _count: {
          select: { reponses: true },
        },
      },
    });

    if (!enquete) {
      return { error: "Enquête introuvable ou lien expiré" };
    }

    // Vérifier si le quota d'objectif est atteint
    const objectifAtteint = Boolean(
      enquete.cible_reponses &&
      enquete.cible_reponses > 0 &&
      enquete._count.reponses >= enquete.cible_reponses
    );

    if (objectifAtteint) {
      return {
        quotaAtteint: true,
        enquete,
        error: "L'objectif de réponses pour cette enquête a été atteint.",
      };
    }

    if (!enquete.actif) {
      return { error: "Cette enquête est actuellement clôturée. Merci pour votre intérêt." };
    }

    if (enquete.date_fin && new Date(enquete.date_fin) < new Date()) {
      return { error: "La période de réponse à cette enquête est désormais terminée." };
    }

    return { enquete };
  } catch (err: any) {
    console.error("Erreur getEnquetePublicData:", err);
    return { error: "Impossible de charger le questionnaire" };
  }
}

/**
 * Soumission de la réponse par un parent
 */
export async function soumettreReponseParent(rawInput: SoumettreReponseParentInput) {
  try {
    const parsed = SoumettreReponseParentSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Données incomplètes" };
    }

    const { token, parent_nom, parent_email, reponses } = parsed.data;
    const emailNormalise = parent_email.trim().toLowerCase();
    const nomNormalise = parent_nom.trim();

    const enquete = await prisma.enqueteSatisfaction.findUnique({
      where: { token },
      include: {
        structure: { select: { nom: true } },
        questions: { orderBy: { ordre: "asc" } },
        _count: { select: { reponses: true } },
      },
    });

    if (!enquete || !enquete.actif) {
      return { error: "Enquête inaccessible ou terminée" };
    }

    // Bloquer si le nombre d'objectif de réponses est atteint ou dépassé
    if (
      enquete.cible_reponses &&
      enquete.cible_reponses > 0 &&
      enquete._count.reponses >= enquete.cible_reponses
    ) {
      return {
        error:
          "Le nombre maximal de réponses prévu pour cette enquête a été atteint. Les participations sont désormais closes.",
      };
    }

    // Vérifier si un parent avec cet email a déjà soumis une évaluation pour cette enquête
    const reponseExistante = await prisma.reponseEnquete.findFirst({
      where: {
        enquete_id: enquete.id,
        parent_email: {
          equals: emailNormalise,
          mode: "insensitive",
        },
      },
    });

    if (reponseExistante) {
      return {
        error: "Une évaluation a déjà été soumise avec cette adresse email pour cette enquête.",
      };
    }

    // Vérifier les questions obligatoires
    const questionsObligatoires = enquete.questions.filter((q) => q.obligatoire);
    for (const q of questionsObligatoires) {
      const rep = reponses.find((r) => r.question_id === q.id);
      if (!rep) {
        return { error: `La question "${q.libelle}" est obligatoire` };
      }
      if (q.type_question === "NOTE_5" && (rep.valeur_note === null || rep.valeur_note === undefined)) {
        return { error: `Veuillez attribuer une note à la question "${q.libelle}"` };
      }
      if (q.type_question === "OUI_NON" && (rep.valeur_booleen === null || rep.valeur_booleen === undefined)) {
        return { error: `Veuillez répondre Oui ou Non à la question "${q.libelle}"` };
      }
    }

    // Enregistrer la réponse
    await prisma.reponseEnquete.create({
      data: {
        enquete_id: enquete.id,
        parent_nom: nomNormalise,
        parent_email: emailNormalise,
        valeurs: {
          create: reponses.map((r) => ({
            question_id: r.question_id,
            valeur_note: r.valeur_note ?? null,
            valeur_booleen: r.valeur_booleen ?? null,
            valeur_texte: r.valeur_texte ? r.valeur_texte.trim() : null,
          })),
        },
      },
    });

    // Préparer le détail des réponses pour l'email
    const reponsesDetail = enquete.questions.map((q) => {
      const rep = reponses.find((r) => r.question_id === q.id);
      let texteReponse = "Non renseigné";
      if (rep) {
        if (q.type_question === "NOTE_5" && rep.valeur_note !== null && rep.valeur_note !== undefined) {
          texteReponse = `${rep.valeur_note} / 5 ★`;
        } else if (q.type_question === "OUI_NON" && rep.valeur_booleen !== null && rep.valeur_booleen !== undefined) {
          texteReponse = rep.valeur_booleen ? "Oui" : "Non";
        } else if (rep.valeur_texte) {
          texteReponse = rep.valeur_texte;
        }
      }
      return {
        question: q.libelle,
        reponse: texteReponse,
        axe: q.axe_qualite,
      };
    });

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const lienAdmin = `${appBaseUrl}/dashboard/${enquete.structure_id}/qualite/enquetes/`;

    // Déclencher la notification email (non-bloquant pour la réponse parent)
    envoyerNotificationNouvelleEvaluation({
      titreCampagne: enquete.titre,
      nomStructure: enquete.structure?.nom || "Établissement",
      structureId: enquete.structure_id,
      parentNom: nomNormalise,
      parentEmail: emailNormalise,
      dateSoumission: new Date(),
      destinataires: enquete.emails_notification || [],
      reponsesDetail,
      lienAdmin,
    }).catch((mailErr) => {
      console.error("[soumettreReponseParent] Erreur envoi email notification:", mailErr);
    });

    revalidatePath(`/dashboard/${enquete.structure_id}/qualite/enquetes/`);
    return { success: true };
  } catch (err: any) {
    console.error("Erreur soumettreReponseParent:", err);
    return { error: "Erreur lors de l'enregistrement de votre avis" };
  }
}

/**
 * Calcule les statistiques complètes d'une enquête
 */
export async function getStatistiquesEnquete(enqueteId: string) {
  try {
    const enquete = await prisma.enqueteSatisfaction.findUnique({
      where: { id: enqueteId },
      include: {
        questions: {
          orderBy: { ordre: "asc" },
        },
        reponses: {
          orderBy: { date_soumission: "desc" },
          include: {
            valeurs: true,
          },
        },
      },
    });

    if (!enquete) {
      return { error: "Enquête introuvable" };
    }

    await assertAccess(enquete.structure_id);

    const totalReponses = enquete.reponses.length;

    // Aplatir les valeurs de réponses
    const toutesValeurs = enquete.reponses.flatMap((r) => r.valeurs);

    // Statistiques par question
    const questionsStats = enquete.questions.map((q) => {
      const valeursQ = toutesValeurs.filter((v) => v.question_id === q.id);
      const nbReponses = valeursQ.length;

      let moyenne: number | null = null;
      let distributionNotes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let tauxOui: number | null = null;
      let verbatims: string[] = [];

      if (q.type_question === "NOTE_5") {
        const notes = valeursQ.map((v) => v.valeur_note).filter((n): n is number => n !== null && n !== undefined);
        if (notes.length > 0) {
          const somme = notes.reduce((acc, curr) => acc + curr, 0);
          moyenne = parseFloat((somme / notes.length).toFixed(2));
          notes.forEach((n) => {
            if (distributionNotes[n] !== undefined) {
              distributionNotes[n]++;
            }
          });
        }
      } else if (q.type_question === "OUI_NON") {
        const bools = valeursQ.map((v) => v.valeur_booleen).filter((b): b is boolean => b !== null && b !== undefined);
        if (bools.length > 0) {
          const nbOui = bools.filter(Boolean).length;
          tauxOui = Math.round((nbOui / bools.length) * 100);
        }
      } else if (q.type_question === "TEXTE") {
        verbatims = valeursQ
          .map((v) => v.valeur_texte)
          .filter((t): t is string => !!t && t.trim().length > 0);
      }

      return {
        questionId: q.id,
        libelle: q.libelle,
        type_question: q.type_question,
        axe_qualite: q.axe_qualite,
        nbReponses,
        moyenne,
        distributionNotes,
        tauxOui,
        verbatims,
      };
    });

    // Score de satisfaction globale : pourcentage des notes >= 4 ou OUI
    let totalItemsSatisfaits = 0;
    let totalItemsEvalues = 0;

    for (const v of toutesValeurs) {
      if (v.valeur_note !== null && v.valeur_note !== undefined) {
        totalItemsEvalues++;
        if (v.valeur_note >= 4) {
          totalItemsSatisfaits++;
        }
      } else if (v.valeur_booleen !== null && v.valeur_booleen !== undefined) {
        totalItemsEvalues++;
        if (v.valeur_booleen === true) {
          totalItemsSatisfaits++;
        }
      }
    }

    const satisfactionGlobalePct =
      totalItemsEvalues > 0 ? Math.round((totalItemsSatisfaits / totalItemsEvalues) * 100) : 0;

    // Statistiques par axe RNQ 2025
    const parAxe: Record<AxeQualite, { moyenneSur5: number; nbQuestions: number; nbEvaluations: number }> = {
      ACCUEIL_SECURITE: { moyenneSur5: 0, nbQuestions: 0, nbEvaluations: 0 },
      DEVELOPPEMENT_EVEIL: { moyenneSur5: 0, nbQuestions: 0, nbEvaluations: 0 },
      RELATION_FAMILLES: { moyenneSur5: 0, nbQuestions: 0, nbEvaluations: 0 },
      PILOTAGE_RISQUES: { moyenneSur5: 0, nbQuestions: 0, nbEvaluations: 0 },
    };

    const notesParAxe: Record<AxeQualite, number[]> = {
      ACCUEIL_SECURITE: [],
      DEVELOPPEMENT_EVEIL: [],
      RELATION_FAMILLES: [],
      PILOTAGE_RISQUES: [],
    };

    enquete.questions.forEach((q) => {
      if (q.axe_qualite) {
        parAxe[q.axe_qualite].nbQuestions++;
        const vals = toutesValeurs.filter((v) => v.question_id === q.id);
        vals.forEach((v) => {
          if (v.valeur_note) {
            notesParAxe[q.axe_qualite!].push(v.valeur_note);
          } else if (v.valeur_booleen !== null && v.valeur_booleen !== undefined) {
            // Un Oui vaut 5, un Non vaut 1
            notesParAxe[q.axe_qualite!].push(v.valeur_booleen ? 5 : 1);
          }
        });
      }
    });

    (Object.keys(parAxe) as AxeQualite[]).forEach((axe) => {
      const notes = notesParAxe[axe];
      parAxe[axe].nbEvaluations = notes.length;
      if (notes.length > 0) {
        const somme = notes.reduce((a, b) => a + b, 0);
        parAxe[axe].moyenneSur5 = parseFloat((somme / notes.length).toFixed(2));
      }
    });

    // Tous les verbatims combinés
    const tousLesVerbatims = questionsStats.flatMap((qs) =>
      qs.verbatims.map((texte) => ({
        question: qs.libelle,
        texte,
      }))
    );

    // Détail individuel par parent ayant répondu
    const reponsesParents = enquete.reponses.map((r) => ({
      id: r.id,
      nom: r.parent_nom || "Parent anonyme",
      email: r.parent_email || "Non renseigné",
      date_soumission: r.date_soumission,
      reponses: enquete.questions.map((q) => {
        const val = r.valeurs.find((v) => v.question_id === q.id);
        let reponseAffichee = "Non renseigné";
        if (val) {
          if (q.type_question === "NOTE_5" && val.valeur_note !== null && val.valeur_note !== undefined) {
            reponseAffichee = `${val.valeur_note} / 5 ★`;
          } else if (q.type_question === "OUI_NON" && val.valeur_booleen !== null && val.valeur_booleen !== undefined) {
            reponseAffichee = val.valeur_booleen ? "Oui" : "Non";
          } else if (q.type_question === "TEXTE" && val.valeur_texte) {
            reponseAffichee = val.valeur_texte;
          }
        }
        return {
          questionId: q.id,
          libelle: q.libelle,
          type_question: q.type_question,
          axe_qualite: q.axe_qualite,
          valeur_note: val?.valeur_note ?? null,
          valeur_booleen: val?.valeur_booleen ?? null,
          valeur_texte: val?.valeur_texte ?? null,
          reponseAffichee,
        };
      }),
    }));

    return {
      enquete: {
        id: enquete.id,
        titre: enquete.titre,
        description: enquete.description,
        type_enquete: enquete.type_enquete,
        token: enquete.token,
        actif: enquete.actif,
        cible_reponses: enquete.cible_reponses,
        date_debut: enquete.date_debut,
        date_fin: enquete.date_fin,
      },
      stats: {
        totalReponses,
        satisfactionGlobalePct,
        parAxe,
        questionsStats,
        tousLesVerbatims,
        reponsesParents,
      },
    };
  } catch (err: any) {
    console.error("Erreur getStatistiquesEnquete:", err);
    return { error: "Impossible de calculer les statistiques" };
  }
}
