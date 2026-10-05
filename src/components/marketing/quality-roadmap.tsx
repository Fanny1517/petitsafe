"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, MessageSquareHeart, ListChecks, FileStack, Building2 } from "lucide-react";

// Textes issus de docs/Qualité.csv : présenter ces modules comme une feuille de route
// tant qu'ils ne sont pas en production. Ne jamais écrire « 4 axes du Référentiel national ».
const modules = [
  {
    icon: <ClipboardList className="h-6 w-6" />,
    color: "text-blue-600 bg-blue-50",
    title: "Auto-évaluation & preuves de terrain",
    description:
      "Parcourez les critères du Référentiel national, documentez votre progression et rattachez automatiquement les preuves déjà produites sur le terrain : présences, incidents, suivi des médicaments, HACCP et autres éléments pertinents. Un radar de progression et un score interne RZPan'Da de 0 à 100 % aident à visualiser l’avancement ; ils ne constituent pas une évaluation officielle.",
  },
  {
    icon: <MessageSquareHeart className="h-6 w-6" />,
    color: "text-pink-600 bg-pink-50",
    title: "Enquêtes familles & baromètre de satisfaction",
    description:
      "Envoyez automatiquement par email un lien de réponse mobile sans mot de passe, recueillez des réponses confidentielles, réservées à la structure, et analysez les tendances dans des graphiques de synthèse, avec verbatims consultables et exportables.",
  },
  {
    icon: <ListChecks className="h-6 w-6" />,
    color: "text-green-600 bg-green-50",
    title: "Plan d’amélioration qualité",
    description:
      "Transformez les constats en actions concrètes : priorité, responsable, échéance, statut et preuve de réalisation. Le plan d’amélioration reste relié aux observations et aux retours des familles.",
  },
  {
    icon: <FileStack className="h-6 w-6" />,
    color: "text-indigo-600 bg-indigo-50",
    title: "Dossier de préparation à l’évaluation quinquennale",
    description:
      "Regroupez l’auto-évaluation, les preuves, les enquêtes et le plan d’amélioration dans un dossier de synthèse exportable en PDF en un clic. Le format sera maintenu à jour selon les modalités réglementaires applicables à l’évaluation quinquennale.",
  },
];

export function QualityRoadmap() {
  return (
    <section
      id="feuille-de-route-qualite"
      aria-labelledby="qualite-heading"
      className="bg-white py-20 md:py-28 border-b border-gray-100"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 border border-amber-100">
            Feuille de route qualité
          </span>
          <h2
            id="qualite-heading"
            className="mt-5 text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight"
          >
            Préparez la démarche qualité et l’évaluation quinquennale sans multiplier les fichiers
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Le Référentiel national de la qualité d’accueil du jeune enfant constitue un socle commun pour les pratiques
            d’accueil et l’évaluation des EAJE. RZPan'Da prépare quatre modules fonctionnels pour relier
            l’auto-évaluation, les preuves du quotidien, la parole des familles et le plan d’amélioration dans un même
            espace.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {modules.map((mod, index) => (
            <motion.article
              key={mod.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-rzpanda-bg p-6 shadow-sm transition duration-300 hover:border-blue-200/50 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${mod.color}`}>
                  {mod.icon}
                </span>
                {/*<span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  En développement
                </span>*/}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">{mod.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{mod.description}</p>
            </motion.article>
          ))}
        </div>

        {/* Bloc gestionnaires (plan SEO ligne 17) */}
        <motion.div
          className="mt-10 flex flex-col gap-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 md:flex-row md:items-center md:justify-between md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                Pour les gestionnaires : préparez l’évaluation quinquennale sans alourdir le quotidien des équipes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
                Centralisez l’auto-évaluation, les preuves de terrain, les retours des familles et le plan
                d’amélioration dans une même démarche, avec un dossier de synthèse exportable.
              </p>
            </div>
          </div>
          <Link
            href="/roadmap/"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            Voir la feuille de route
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
