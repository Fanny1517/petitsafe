"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const faqs = [
    {
      question: "Est-ce que c’est vraiment conforme au décret 2025-304 ?",
      answer: "Oui, RZPan'Da a été conçu pour respecter scrupuleusement les exigences réglementaires. Il intègre le suivi des températures, la traçabilité alimentaire HACCP avec photos de lots, le protocole biberonnerie de l'ANSES et les plans de nettoyage émargés requis lors des contrôles DDPP / PMI.",
    },
    {
      question: "Mon équipe n’est pas à l’aise avec le digital.",
      answer: "L'application a été pensée pour le terrain, pas pour des ingénieurs. Les saisies se font en 30 secondes chrono avec de grands boutons tactiles. De plus, chaque professionnel utilise un code PIN individuel très simple pour signer ses actions, éliminant le besoin de gérer des mots de passe complexes au quotidien.",
    },
    {
      question: "Quelles données sont stockées et où ?",
      answer: "Toutes vos données (fiches enfants, relevés HACCP) sont stockées de façon sécurisée en Europe sur des serveurs conformes au RGPD. Nous effectuons des sauvegardes automatiques quotidiennes pour vous garantir un historique de 12 mois glissants sans risque de perte.",
    },
    {
      question: "Je peux importer mes enfants ou mes équipements existants ?",
      answer: "Tout à fait ! Vous pouvez importer la liste de vos enfants via un fichier Excel ou CSV en 2 clics pour démarrer instantanément. Pour vos équipements (frigos, congélateurs, zones), notre guide de paramétrage interactif vous permet de les ajouter en moins de 10 minutes.",
    },
    {
      question: "Ça fonctionne sur tablette ? Smartphone ?",
      answer: "Oui, responsive complet. Les équipes utilisent principalement tablette en salle. Les gestionnaires utilisent ordinateur pour les exports. Pas d’appli native à télécharger, tout dans le navigateur.",
    },
    {
      question: "Qu’est-ce qui se passe après les 30 jours d’essai ?",
      answer: "Rien d’automatique. L’essai se termine, vous décidez. Si vous ne faites rien, le compte passe en mode lecture (vos données restent accessibles 6 mois). Aucun prélèvement sans votre accord explicite.",
    },
    {
      question: "Vous avez combien de clients aujourd’hui ?",
      answer: "Nous sommes en phase early access avec nos premières structures pilotes. C’est pour cela que les 20 premiers clients bénéficient de 3 mois gratuits et d’un accompagnement direct du fondateur.",
    },
    {
      question: "Mon réseau a 4 micro-crèches, comment ça marche ?",
      answer: "Chaque structure a son abonnement indépendant. Un même utilisateur (vous, la gestionnaire) peut basculer entre les 4 structures d’un clic. Les exports DDPP sont par structure (comme le demande la réglementation).",
    },
    //{
    //question: "Différence concrète avec Meeko ou Leia ?",
    // answer: "Meeko ne fait PAS le HACCP (températures, traçabilité). Leia fait le HACCP mais n’a ni portail parents ni suivi enfants détaillé. RZPan’Da est le seul à tout combiner, à un prix plus bas.",
    //},
    {
      question: "Puis-je parler à une vraie personne avant de m’inscrire ?",
      answer: "Oui. Prenez 20 minutes avec le fondateur via notre Calendly. Pas de commercial, pas de script. Juste une conversation pour voir si l’outil vous correspond.",
    },
  ];

  return (
    <section id="faq" className="bg-rzpanda-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
            Les questions qu’on vous pose tous les jours.
          </h2>
        </motion.div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-gray-800 transition hover:bg-gray-50/50 md:text-lg"
        >
          <span>{question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""
              }`}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-sm md:text-base leading-relaxed text-gray-500 border-t border-gray-50/50 pt-2 bg-gray-50/10">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
