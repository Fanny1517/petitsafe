"use client";

import { motion } from "framer-motion";
import { FileX, LayoutGrid, ShieldAlert, Thermometer, Package, Baby, Sparkles, Users, FileDown } from "lucide-react";

export function Features() {
  const painPoints = [
    {
      icon: <FileX className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "Le classeur HACCP de la crèche qui déborde",
      description: "Des relevés sur papier difficiles à retrouver au moment de préparer un contrôle DDPP ou PMI.",
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      color: "text-amber-600 bg-amber-50",
      title: "Excel partout, rien de connecté",
      description: "Les transmissions, menus et réceptions sont répartis entre plusieurs supports.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "La peur du contrôle inopiné",
      description: "Les exigences d'hygiène, de traçabilité et d'organisation documentaire demandent un suivi régulier, sans que vous ayez toujours le temps de tout centraliser.",
    },
  ];

  const appFeatures = [
    {
      icon: <Thermometer className="h-6 w-6" />,
      color: "text-red-600 bg-red-50",
      title: "Relevés et contrôle de température en crèche",
      description: "Consignez les températures des réfrigérateurs et congélateurs, consultez l'historique des mesures et suivez les alertes selon les seuils configurés.",
      badge: "✓ Relevés et alertes",
    },
    {
      icon: <Package className="h-6 w-6" />,
      color: "text-blue-600 bg-blue-50",
      title: "Traçabilité alimentaire en crèche",
      description: "Enregistrez la réception des repas et marchandises, les numéros de lots et les dates limites pour retrouver les informations utiles lors de vos vérifications.",
      badge: "✓ DLC et lots",
    },
    {
      icon: <Baby className="h-6 w-6" />,
      color: "text-pink-600 bg-pink-50",
      title: "Traçabilité de la biberonnerie",
      description: "Suivez la préparation des biberons, les horaires et les informations relatives au lait infantile ou maternel, selon les protocoles appliqués dans votre établissement.",
      badge: "✓ Biberonnerie",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-green-600 bg-green-50",
      title: "Plan de nettoyage et de désinfection en crèche",
      description: "Organisez les zones et fréquences d'entretien, consignez les opérations réalisées et conservez un historique horodaté pour le suivi de l'équipe.",
      badge: "✓ Nettoyage et émargement",
    },
    {
      icon: <Users className="h-6 w-6" />,
      color: "text-indigo-600 bg-indigo-50",
      title: "Suivi quotidien des enfants",
      description: "Repas, siestes, changes et événements : centralisez les informations utiles aux transmissions entre professionnels et familles.",
      badge: "✓ Équipe et familles",
    },
    {
      icon: <FileDown className="h-6 w-6" />,
      color: "text-purple-600 bg-purple-50",
      title: "Historique et exports pour les contrôles DDPP / PMI",
      description: "Retrouvez vos relevés et documents de traçabilité dans un historique centralisé et préparez les exports PDF utiles aux vérifications.",
      badge: "✓ Exports DDPP / PMI",
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
              Une application HACCP pour centraliser la traçabilité en crèche
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Pensée pour les crèches, micro-crèches, EAJE et MAM, RZPan'Da réunit les principales tâches de suivi sanitaire et de traçabilité dans une seule application.
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
