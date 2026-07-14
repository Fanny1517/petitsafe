"use client";

import { motion } from "framer-motion";
import { FileX, LayoutGrid, ShieldAlert, Thermometer, Package, Baby, Sparkles, Users, FileDown } from "lucide-react";

export function Features() {
  const painPoints = [
    {
      icon: <FileX className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "Le classeur HACCP qui déborde",
      description: "Des relevés de température griffonnés sur post-it, oubliés certains jours. Quand la DDPP arrive, panique : il manque trois semaines.",
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      color: "text-amber-600 bg-amber-50",
      title: "Excel partout, rien de connecté",
      description: "Les transmissions sur un tableau, les menus sur un autre, les réceptions marchandises dans un cahier. Personne ne sait où est quoi.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "La peur du contrôle inopiné",
      description: "Vous savez qu’il y a des trous dans la traçabilité. Vous savez que les nouvelles réglementations durcissent les règles. Vous n’avez pas le temps de tout reprendre.",
    },
  ];

  const appFeatures = [
    {
      icon: <Thermometer className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "Relevés de température",
      description: "Frigos, congélateurs, plats témoins. Alertes automatiques et immédiates en cas de dépassement de la tolérance.",
      badge: "✓ Export DDPP",
    },
    {
      icon: <Package className="h-6 w-6" />,
      color: "text-blue-600 bg-blue-50",
      title: "Traçabilité alimentaire",
      description: "Réception de marchandises, numéros de lots, gestion des DLC/DLUO. Saisie manuelle facilitée et suivi sans faille.",
      badge: "✓ Export DDPP",
    },
    {
      icon: <Baby className="h-6 w-6" />,
      color: "text-pink-600 bg-pink-50",
      title: "Biberonnerie ANSES",
      description: "Préparation des biberons, horodatage, durée de conservation de 1h et gestion du lait maternel ou infantile selon les recommandations de l'ANSES.",
      badge: "✓ Norme ANSES",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-green-600 bg-green-50",
      title: "Plan de nettoyage",
      description: "Suivi des zones, fréquences de nettoyage, émargement horodaté et sécurisé par chaque professionnel de l'équipe.",
      badge: "✓ Export DDPP",
    },
    {
      icon: <Users className="h-6 w-6" />,
      color: "text-indigo-600 bg-indigo-50",
      title: "Suivi enfants",
      description: "Repas, siestes, changes, soins et événements. Centralisez tout dans l'appli et générez une fiche de transmission claire pour chaque famille.",
      badge: "✓ Pour l'équipe & parents",
    },
    {
      icon: <FileDown className="h-6 w-6" />,
      color: "text-purple-600 bg-purple-50",
      title: "Exports DDPP / PMI",
      description: "Générez un dossier d'exportation PDF complet en 3 clics, couvrant jusqu'à 12 mois glissants d'historique de traçabilité.",
      badge: "✓ Conforme décret 2025-304",
    },
  ];

  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section id="fonctionnalites-sections">
      {/* Section 1: Pain Points */}
      <div className="py-20 md:py-28 border-t border-gray-100 bg-rzpanda-bg">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollVariants}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
              Reconnaissez-vous ça ?
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 } },
                }}
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${point.color}`}>
                  {point.icon}
                </span>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{point.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-500">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariants}
          >
            <a
              href="#fonctionnalites-grille"
              className="inline-flex items-center gap-2 text-base font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Et si tout était regroupé dans une seule application ?
              <span className="text-xl">↓</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Section 2: Features Grid */}
      <div id="fonctionnalites" className="bg-rzpanda-bg py-20 md:py-28 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariants}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
              Une appli. Tout ce que la DDPP va vous demander.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Pensé avec et pour les professionnels de la petite enfance en crèche et MAM.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appFeatures.map((feat, index) => (
              <motion.article
                key={index}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-blue-200/50 transition duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.5 } },
                }}
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.color}`}>
                  {feat.icon}
                </span>
                <h3 className="mt-6 text-lg font-bold text-gray-900">{feat.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{feat.description}</p>
                <div className="mt-5">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    {feat.badge}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
