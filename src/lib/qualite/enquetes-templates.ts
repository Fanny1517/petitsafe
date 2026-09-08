import { AxeQualite, TypeEnquete, TypeQuestionEnquete } from "@prisma/client";

export interface TemplateQuestion {
  libelle: string;
  type_question: TypeQuestionEnquete;
  obligatoire: boolean;
  ordre: number;
  axe_qualite?: AxeQualite;
  options?: string[]; // Pour CHOIX_UNIQUE
}

export interface TemplateEnquete {
  id: string;
  titre: string;
  description: string;
  type: TypeEnquete;
  icon: string;
  badge: string;
  questions: TemplateQuestion[];
}

export const TEMPLATES_ENQUETES: TemplateEnquete[] = [
  {
    id: "barometre_annuel_2025",
    titre: "Baromètre Annuel des Familles 2025",
    description:
      "Évaluation complète de la satisfaction des familles alignée sur les 4 axes du Référentiel National Qualité (RNQ 2025). Idéal pour le bilan annuel et les audits PMI/CAF.",
    type: "ANNUELLE",
    icon: "ClipboardCheck",
    badge: "Référentiel 2025",
    questions: [
      {
        libelle: "Comment évaluez-vous la qualité de l'accueil quotidien de votre enfant et le sentiment de sécurité ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 1,
        axe_qualite: "ACCUEIL_SECURITE",
      },
      {
        libelle: "Les locaux et l'hygiène de la structure répondent-ils à vos attentes ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 2,
        axe_qualite: "ACCUEIL_SECURITE",
      },
      {
        libelle: "Comment jugez-vous la diversité et la bienveillance des activités d'éveil proposées ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 3,
        axe_qualite: "DEVELOPPEMENT_EVEIL",
      },
      {
        libelle: "Le rythme de sommeil et les besoins individuels de votre enfant sont-ils bien respectés ?",
        type_question: "OUI_NON",
        obligatoire: true,
        ordre: 4,
        axe_qualite: "DEVELOPPEMENT_EVEIL",
      },
      {
        libelle: "Les transmissions quotidiennes de l'équipe (matin et soir) sont-elles claires et rassurantes ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 5,
        axe_qualite: "RELATION_FAMILLES",
      },
      {
        libelle: "Vous sentez-vous écouté(e) et soutenu(e) par la direction et les professionnelles en cas de besoin ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 6,
        axe_qualite: "RELATION_FAMILLES",
      },
      {
        libelle: "Globalement, recommanderiez-vous notre structure à d'autres parents ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 7,
        axe_qualite: "PILOTAGE_RISQUES",
      },
      {
        libelle: "Avez-vous des remarques, suggestions ou compliments à transmettre à l'équipe ?",
        type_question: "TEXTE",
        obligatoire: false,
        ordre: 8,
      },
    ],
  },
  {
    id: "fin_adaptation",
    titre: "Enquête Fin d'Adaptation & Intégration",
    description:
      "Mesure le vécu des parents et de l'enfant lors des premières semaines d'accueil (familiarisation, séparation, repères de l'enfant).",
    type: "INTEGRATION",
    icon: "HeartHandshake",
    badge: "Nouveaux Parents",
    questions: [
      {
        libelle: "La période de familiarisation progressive a-t-elle été adaptée au rythme de votre enfant ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 1,
        axe_qualite: "ACCUEIL_SECURITE",
      },
      {
        libelle: "Avez-vous reçu toutes les informations nécessaires lors de l'admission et de l'installation ?",
        type_question: "OUI_NON",
        obligatoire: true,
        ordre: 2,
        axe_qualite: "RELATION_FAMILLES",
      },
      {
        libelle: "Votre enfant semble-t-il serein et en confiance au moment de la séparation le matin ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 3,
        axe_qualite: "DEVELOPPEMENT_EVEIL",
      },
      {
        libelle: "Un mot ou un conseil pour améliorer le déroulement des prochaines intégrations ?",
        type_question: "TEXTE",
        obligatoire: false,
        ordre: 4,
      },
    ],
  },
  {
    id: "flash_restauration_sommeil",
    titre: "Enquête Flash : Restauration, Rythmes & Sommeil",
    description:
      "Sondage rapide en 3 questions pour sonder les habitudes alimentaires, le goût des repas et les siestes.",
    type: "FLASH",
    icon: "Utensils",
    badge: "Flash 60s",
    questions: [
      {
        libelle: "Comment évaluez-vous les repas et collations servis à la crèche (qualité, équilibre, textures) ?",
        type_question: "NOTE_5",
        obligatoire: true,
        ordre: 1,
        axe_qualite: "ACCUEIL_SECURITE",
      },
      {
        libelle: "Les habitudes alimentaires ou régimes particuliers de votre enfant sont-ils scrupuleusement respectés ?",
        type_question: "OUI_NON",
        obligatoire: true,
        ordre: 2,
        axe_qualite: "PILOTAGE_RISQUES",
      },
      {
        libelle: "Une suggestion particulière sur l'alimentation ou le temps calme ?",
        type_question: "TEXTE",
        obligatoire: false,
        ordre: 3,
      },
    ],
  },
];
