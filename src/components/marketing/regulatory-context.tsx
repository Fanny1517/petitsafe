"use client";

import { motion } from "framer-motion";
import { TriangleAlert, Clock, FolderOpen, Calendar } from "lucide-react";

export function RegulatoryContext() {
  const stats = [
    {
      icon: <TriangleAlert className="h-6 w-6 text-red-500" />,
      number: "6 500",
      label: "micro-crèches menacées d’ici fin 2026",
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      number: "12 h",
      label: "par semaine perdues en paperasse",
    },
    {
      icon: <FolderOpen className="h-6 w-6 text-blue-500" />,
      number: "3",
      label: "classeurs papier par structure",
    },
    {
      icon: <Calendar className="h-6 w-6 text-indigo-500" />,
      number: "Sept. 2026",
      label: "nouvelles obligations décret 2025-304",
    },
  ];

  return (
    <section
      aria-label="Contexte réglementaire"
      className="border-y border-gray-100 bg-rzpanda-bg py-10"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-gray-100 md:gap-0">
          {stats.map((stat, index) => (
            <motion.li
              key={index}
              className="flex flex-col items-start gap-2 px-2 md:px-6 first:pl-0 last:pr-0"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              {stat.icon}
              <div className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
                {stat.number}
              </div>
              <div className="text-xs leading-snug text-gray-500 font-medium">
                {stat.label}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
