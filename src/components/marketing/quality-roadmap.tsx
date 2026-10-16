"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, MessageSquareHeart, ListChecks, FileStack, Building2, BookOpen } from "lucide-react";

// Textes issus de docs/Qualité.csv : présenter ces modules comme une feuille de route
// tant qu'ils ne sont pas en production. Ne jamais écrire « 4 axes du Référentiel national ».
const modules = [
  {
    icon: <ClipboardList className="h-6 w-6" />,
    color: "text-emerald-700 bg-emerald-50",
    title: "1. Référentiel national et auto-évaluation continue",
    description:
      "Parcourez quatre axes de suivi, renseignez les critères et reliez les preuves disponibles : HACCP, médicaments, présences et incidents. Visualisez l'avancement avec un radar et un indicateur interne de maturité de 0 à 100 %.",
    disclaimer: "Ce score ne constitue pas une certification ni une conformité officielle.",
  },
  {
    icon: <MessageSquareHeart className="h-6 w-6" />,
    color: "text-pink-600 bg-pink-50",
    title: "2. Enquêtes familles et baromètre de satisfaction",
    description:
      "Diffusez des enquêtes par email à l'aide de liens de réponse mobile sans mot de passe. Centralisez les réponses confidentielles, visualisez les résultats en graphiques et consultez ou exportez les commentaires des familles, dans le respect de leur confidentialité.",
    disclaimer: null,
  },
  {
    icon: <ListChecks className="h-6 w-6" />,
    color: "text-teal-600 bg-teal-50",
    title: "3. Plan d'amélioration qualité (PAQ)",
    description:
      "Transformez les observations et les retours en actions concrètes. Pilotez les priorités, responsables, échéances et statuts à partir d'un tableau ou d'une vue Kanban, en conservant les preuves de réalisation.",
    disclaimer: null,
  },
  {
    icon: <FileStack className="h-6 w-6" />,
    color: "text-indigo-600 bg-indigo-50",
    title: "4. Dossier de préparation à l'évaluation quinquennale",
    description:
      "Regroupez auto-évaluations, preuves terrain, enquêtes et actions d'amélioration. Un export PDF en un clic est prévu pour constituer un dossier de synthèse destiné à faciliter la préparation de l'évaluation externe.",
    disclaimer: "Le dossier ne garantit pas la conformité ni l'acceptation par l'évaluateur.",
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
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
            RZPan'Da Qualité · Fonctionnalités en préparation
          </span>
          <h2
            id="qualite-heading"
            className="mt-5 text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight"
          >
            Suivi qualité et auto-évaluation pour crèches, micro-crèches et EAJE
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Préparez votre démarche d'amélioration continue avec un module pensé pour les responsables d'établissements d'accueil du jeune enfant. RZPan'Da Qualité a vocation à réunir l'auto-évaluation, les preuves de terrain, les enquêtes familles et le plan d'amélioration dans un même espace, pour faciliter la préparation documentaire de l'évaluation quinquennale.
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
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  En préparation
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">{mod.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                {mod.description}
                {mod.disclaimer && (
                  <>
                    {" "}
                    <strong className="font-semibold text-gray-900">{mod.disclaimer}</strong>
                  </>
                )}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/roadmap/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            Découvrir la feuille de route Qualité
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Section 04 bis : Acquisition sous le bloc Qualité */}
        <motion.div
          className="mt-16 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 md:p-10 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Préparer votre évaluation quinquennale sans alourdir le quotidien
            </h3>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Vous gérez une crèche ou plusieurs établissements ? Découvrez comment structurer votre auto-évaluation, rassembler les preuves du quotidien et suivre vos actions d'amélioration.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-blue-200 transition">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-lg font-bold text-gray-900">Page dédiée aux gestionnaires</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Un parcours pensé pour les responsables d'EAJE souhaitant centraliser les démarches, responsabiliser les équipes et anticiper les contrôles.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/roadmap/"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Découvrir la démarche qualité
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-blue-200 transition">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-lg font-bold text-gray-900">Guide pratique à télécharger</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Méthodologie, liste des pièces à préparer et conseils pour réussir la transition sans désorganiser le temps auprès des enfants.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/guides/"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Recevoir le guide de préparation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
