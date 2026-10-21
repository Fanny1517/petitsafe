"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const faqs = [
    {
      question: "Un logiciel HACCP suffit-il à assurer la conformité de ma crèche ?",
      answer: "Non. RZPan'Da facilite la saisie, la centralisation et la consultation de certaines données de traçabilité. La conformité dépend également des procédures de votre établissement, de leur application et des exigences réglementaires qui vous concernent.",
    },
    {
      question: "Comment RZPan'Da aide-t-il à organiser les informations du plan de maîtrise sanitaire (PMS) ?",
      answer: "L'application permet de centraliser plusieurs suivis utiles à votre organisation sanitaire, notamment les relevés de température, la traçabilité alimentaire et le nettoyage. Elle ne remplace pas à elle seule l'élaboration et la mise en œuvre de votre PMS.",
    },
    {
      question: "Puis-je suivre la biberonnerie et les informations de traçabilité des biberons ?",
      answer: "RZPan'Da permet de consigner les informations de préparation et de suivi de la biberonnerie décrites dans l'application. Les protocoles de conservation et de manipulation applicables restent à définir et vérifier selon les situations et recommandations en vigueur.",
    },
    {
      question: "Puis-je préparer mes documents pour un contrôle DDPP ou PMI ?",
      answer: "RZPan'Da regroupe les historiques et propose des exports de données de suivi. Ces documents peuvent faciliter vos préparatifs, sans garantir le résultat d'un contrôle ni remplacer les justificatifs propres à votre structure.",
    },
    {
      question: "RZPan'Da convient-il aux micro-crèches et aux réseaux de plusieurs structures ?",
      answer: "RZPan'Da s'adresse notamment aux crèches et micro-crèches. Pour un réseau de plusieurs établissements, contactez notre équipe afin d'étudier les modalités adaptées à votre organisation.",
    },
    {
      question: "Le module RZPan'Da Qualité est-il déjà disponible ?",
      answer: "RZPan'Da Qualité figure dans notre feuille de route. Ses fonctionnalités et sa disponibilité seront confirmées lors de son lancement.",
    },
    {
      question: "Mon équipe n'est pas à l'aise avec le digital.",
      answer: "L'application a été pensée pour le terrain, pas pour des ingénieurs. Les saisies se font en 30 secondes chrono avec de grands boutons tactiles. De plus, chaque professionnel utilise un code PIN individuel très simple pour signer ses actions, éliminant le besoin de gérer des mots de passe complexes au quotidien.",
    },
    {
      question: "Quelles données sont stockées et où ?",
      answer: "Toutes vos données (fiches enfants, relevés HACCP) sont stockées de façon sécurisée en Europe sur des serveurs conformes au RGPD. Nous effectuons des sauvegardes automatiques quotidiennes pour vous garantir un historique sans risque de perte.",
    },
    {
      question: "Je peux importer mes enfants ou mes équipements existants ?",
      answer: "Tout à fait ! Vous pouvez importer la liste de vos enfants via un fichier Excel ou CSV en 2 clics pour démarrer instantanément. Pour vos équipements (frigos, congélateurs, zones), notre guide de paramétrage interactif vous permet de les ajouter en moins de 10 minutes.",
    },
    {
      question: "Ça fonctionne sur tablette ? Smartphone ?",
      answer: "Oui, responsive complet. Les équipes utilisent principalement la tablette en salle. Les gestionnaires utilisent l'ordinateur pour les exports. Aucune application native à télécharger, tout se passe directement dans votre navigateur.",
    },
    {
      question: "Qu'est-ce qui se passe après les 30 jours d'essai ?",
      answer: "Rien d'automatique. L'essai se termine, vous décidez. Si vous ne faites rien, le compte passe en mode lecture (vos données restent accessibles 6 mois). Aucun prélèvement sans votre accord explicite.",
    },
    {
      question: "Puis-je parler à une vraie personne avant de m'inscrire ?",
      answer: "Oui. Prenez rendez-vous avec notre équipe via notre page contact. Pas de script commercial agressif : juste un échange direct pour voir si l'outil correspond aux besoins de votre établissement.",
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
            Les questions qu'on vous pose tous les jours
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
