"use client";

import Link from "next/link";
import { ArrowRight, Play, Check, Zap, Thermometer, Baby, ClipboardCheck, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  // Keyframes pour les animations d'entrée
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),transparent_55%)]"
      ></div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 md:grid-cols-12 md:gap-8 md:px-8">
        {/* Left Side: Content */}
        <motion.div
          className="md:col-span-7 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100"
          >
            <Zap className="h-3.5 w-3.5 fill-blue-600 stroke-blue-600" />
            Décret 2025-304 — conformité septembre 2026
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-[38px] font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-[54px] lg:text-[62px]"
          >
            Le contrôle DDPP ne devrait pas vous empêcher de dormir.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-lg text-gray-600 md:text-xl md:leading-[1.5]"
          >
            RZPan'Da réunit HACCP, traçabilité, biberonnerie ANSES et suivi enfants dans une seule appli. Vos équipes gagnent 1 h/jour. Vos contrôles se préparent en 3 clics.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white transition hover:bg-blue-700 hover:shadow-lg active:scale-95"
              aria-label="Démarrer l'essai gratuit — 30 jours"
            >
              Démarrer l'essai gratuit — 30 jours
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#fonctionnalites"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-800 transition hover:bg-gray-50 hover:border-gray-300"
            >
              <Play className="h-4 w-4 fill-gray-800" />
              Voir la démo
            </Link>
          </motion.div>

          {/* Key Checklist points */}
          <motion.div variants={itemVariants} className="mt-8">
            <ul
              className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-medium text-gray-500"
              aria-label="Garanties de l'essai"
            >
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4.5 w-4.5 text-blue-600 stroke-[3]" />
                <span>Sans carte bancaire</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4.5 w-4.5 text-blue-600 stroke-[3]" />
                <span>Conforme décret 2025-304</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4.5 w-4.5 text-blue-600 stroke-[3]" />
                <span>Exports DDPP/PMI</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4.5 w-4.5 text-blue-600 stroke-[3]" />
                <span>Hébergé en Europe</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Side: Interactive Mockup */}
        <motion.div
          className="relative md:col-span-5 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full">
            {/* Browser frame mockup */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Window controls */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]"></span>
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]"></span>
                <span className="h-3 w-3 rounded-full bg-[#28C840]"></span>
                <div className="ml-4 flex h-6 flex-1 items-center rounded-lg bg-white px-3 text-[11px] text-gray-400 border border-gray-100 shadow-inner">
                  rzpanda.fr/dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 bg-gray-50/50 space-y-4">
                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Temperatures */}
                  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Thermometer className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold text-green-600">+2</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 font-medium leading-none">Relevés aujourd'hui</div>
                    <div className="text-base font-bold text-gray-800 mt-1">12 / 12</div>
                  </div>

                  {/* Children */}
                  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                        <Baby className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">—</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 font-medium leading-none">Enfants présents</div>
                    <div className="text-base font-bold text-gray-800 mt-1">24</div>
                  </div>

                  {/* HACCP Tasks */}
                  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <ClipboardCheck className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600">89 %</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 font-medium leading-none">Tâches HACCP</div>
                    <div className="text-base font-bold text-gray-800 mt-1">8 / 9</div>
                  </div>

                  {/* Alerts */}
                  <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <TriangleAlert className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold text-red-600">ouvertes</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 font-medium leading-none">Alertes</div>
                    <div className="text-base font-bold text-gray-800 mt-1">2</div>
                  </div>
                </div>

                {/* Sub grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                  {/* Temp graph */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-gray-800">Températures frigo — 7j</div>
                        <div className="text-[10px] text-gray-400">Tolérance : 0 – 6 °C</div>
                      </div>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-700 border border-green-100">
                        ✓ Conforme
                      </span>
                    </div>
                    
                    {/* SVG Curve graph */}
                    <div className="mt-4 h-24 w-full">
                      <svg viewBox="0 0 260 80" className="h-full w-full">
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Area */}
                        <path
                          d="M 0.0 24.0 L 23.6 29.3 L 47.3 21.3 L 70.9 25.3 L 94.5 18.7 L 118.2 22.7 L 141.8 26.7 L 165.5 20.0 L 189.1 24.0 L 212.7 28.0 L 236.4 22.7 L 260.0 25.3 L 260 80 L 0 80 Z"
                          fill="url(#tempGradient)"
                        />
                        {/* Line */}
                        <path
                          d="M 0.0 24.0 L 23.6 29.3 L 47.3 21.3 L 70.9 25.3 L 94.5 18.7 L 118.2 22.7 L 141.8 26.7 L 165.5 20.0 L 189.1 24.0 L 212.7 28.0 L 236.4 22.7 L 260.0 25.3"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Dots on key points */}
                        <circle cx="94.5" cy="18.7" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="165.5" cy="20.0" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Active alerts panel */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2">
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <TriangleAlert className="h-3.5 w-3.5 text-amber-500 fill-amber-50" />
                      Alertes actives
                    </div>
                    <ul className="space-y-2">
                      <li className="flex flex-col gap-0.5 rounded-lg bg-gray-50 p-2 text-[10px]">
                        <span className="font-semibold text-gray-800 truncate">DLC lait infantile — lot 2451</span>
                        <span className="text-amber-600 font-bold">Dans 2 jours</span>
                      </li>
                      <li className="flex flex-col gap-0.5 rounded-lg bg-gray-50 p-2 text-[10px]">
                        <span className="font-semibold text-gray-800 truncate">Relevé frigo cuisine — 14 h</span>
                        <span className="text-blue-600 font-bold">À saisir</span>
                      </li>
                      <li className="flex flex-col gap-0.5 rounded-lg bg-gray-50 p-2 text-[10px]">
                        <span className="font-semibold text-gray-800 truncate">Plat témoin — mercredi</span>
                        <span className="text-green-600 font-bold">Prélevé ✓</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Float tags */}
            <div className="absolute -right-3 -top-3 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-md">
              🇫🇷 Conçu en France
            </div>
            <div className="absolute -bottom-3 -left-3 hidden items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-md md:flex">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                €
              </span>
              <div>
                <div className="font-bold text-xs text-gray-800">Essai gratuit 30 jours</div>
                <div className="text-[9px] text-gray-400 font-medium">sans carte bancaire</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
