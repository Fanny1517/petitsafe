"use client";

import Link from "next/link";
import { ArrowRight, Check, Rocket, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export function Pricing() {
  const trustPoints = [
    {
      icon: <span className="text-2xl">🇫🇷</span>,
      title: "100 % français",
      description: "Développé en France, hébergé en Europe, conforme RGPD. Support assuré par une équipe qui comprend les enjeux de la DDPP et de la PMI.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-blue-600" />,
      title: "Programme Early Access",
      description: "Faites partie des 10 premières crèches pilotes et bénéficiez de : 3 mois offerts, la formation visio personnalisée offerte.",
    },
    {
      icon: <Megaphone className="h-6 w-6 text-blue-600" />,
      title: "Co-construisons l'outil",
      description: "Vos retours façonnent la feuille de route du produit. Une fonctionnalité est indispensable pour vous ? Nous la développons en priorité.",
    },
  ];

  return (
    <section>
      {/* Pilot structures Section */}
      <div className="bg-rzpanda-bg py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
              Rejoignez les 10 premières structures pilotes.
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustPoints.map((point, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  {point.icon}
                </span>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{point.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-500">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95"
            >
              Postuler au programme Early Access
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Pricing Single Tier Section */}
      <div id="tarifs" className="bg-rzpanda-bg py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2
              className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Un seul prix. Sans engagement.
            </motion.h2>
            <p className="mt-4 text-lg text-gray-500">
              Pas de palier complexe, pas de devis caché, pas de surprise.
            </p>
          </div>

          <motion.div
            className="mx-auto mt-12 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600/20 bg-white p-8 shadow-xl md:p-12">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-100">
                  Abonnement RZPan'Da
                </span>
              </div>

              <div className="mt-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
                    30 jours d'essai gratuit
                  </span>
                  <span className="text-lg text-gray-400 font-medium mt-1">
                    sans carte bancaire requis
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95 w-full sm:w-auto"
                >
                  Démarrer l'essai gratuit 30 jours
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <p className="mt-5 text-center text-sm font-medium text-gray-400">
                Sans engagement · Annulation simple en 1 clic
              </p>
            </div>
          </motion.div>

          <div className="mx-auto mt-8 max-w-2xl space-y-2 text-center text-sm font-medium text-gray-500">
            <p>
              <span aria-hidden="true" className="mr-1.5">💼</span>
              <em>Réseau de plusieurs structures ?</em> Contactez-nous pour une offre multi-structures adaptée.
            </p>
            <p>
              <span aria-hidden="true" className="mr-1.5">📞</span>
              <em>Formation en visioconférence personnalisée</em> — offerte pour le lancement.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-gray-400 justify-center">
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-blue-600 stroke-[3]" />
                <span>Sans carte bancaire</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-blue-600 stroke-[3]" />
                <span>Conforme décret 2025-304</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-blue-600 stroke-[3]" />
                <span>Exports DDPP/PMI</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-blue-600 stroke-[3]" />
                <span>Hébergé en Europe</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
