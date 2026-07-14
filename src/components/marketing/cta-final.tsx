"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CTAFinal() {
  const benefits = [
    "Sans carte bancaire",
    "Conforme décret 2025-304",
    "Exports DDPP/PMI",
    "Hébergé en Europe",
  ];

  return (
    <section
      aria-labelledby="cta-final-heading"
      className="bg-gradient-to-br from-rzpanda-primary to-rzpanda-secondary py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="cta-final-heading"
            className="text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            Septembre 2026 approche.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 md:text-xl">
            Mettez-vous en conformité dès aujourd'hui. L'essai est gratuit, l'installation prend 2 minutes.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-700 transition hover:bg-white/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
          >
            Démarrer l'essai gratuit
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-white/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Sans carte bancaire · 30 jours pleins · Annulation en 1 clic
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ul
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90 justify-center"
            aria-label="Garanties de l'essai"
          >
            {benefits.map((benefit, index) => (
              <li key={index} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
