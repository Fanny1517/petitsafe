"use client";

import { Gift } from "lucide-react";
import { motion } from "framer-motion";

export function Timeline() {
  const steps = [
    {
      day: "Jour 0",
      title: "Inscription (2 min)",
      description: "Email + mot de passe. Pas de carte bancaire requise. Vous êtes instantanément connecté sur votre espace.",
    },
    {
      day: "Jour 1",
      title: "Paramétrage (30 min avec nos vidéos de formation)",
      description: "Vous configurez vos équipements (frigos), importez vos enfants par fichier CSV et définissez les zones de nettoyage. Des tutoriels vidéo rapides vous guident à chaque étape.",
    },
    {
      day: "Jour 2",
      title: "Votre équipe saisit (en mode réel)",
      description: "Chaque professionnel possède son code PIN sécurisé. La saisie des températures, des biberons et le suivi quotidien remplacent le papier dès le premier jour.",
    },
    {
      day: "Jour 30",
      title: "Votre premier export DDPP / PMI",
      description: "Un document PDF propre et complet avec tout l'historique de traçabilité est généré en un clic. Prêt pour un contrôle serein.",
    },
  ];

  return (
    <section className="bg-rzpanda-bg py-20 md:py-28 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
            De l'inscription au premier export DDPP : 48 heures.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Timeline steps list */}
          <div className="relative lg:col-span-2 pl-4">
            {/* Dashed vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-[34px] top-6 bottom-6 border-l-2 border-dashed border-blue-200"
            ></div>

            <ol className="space-y-10">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {/* Step number badge */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md">
                    {index + 1}
                  </div>

                  <div className="pt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {step.day}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-gray-500 max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Help box */}
          <motion.aside
            className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Gift className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-gray-900">
              Besoin d'un coup de main humain ?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Une formation en visioconférence de 1h30 personnalisée avec un formateur expert est{" "}
              <strong className="text-gray-900 font-semibold">offerte aux 20 premiers clients</strong>.
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
