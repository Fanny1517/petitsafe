"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { demanderGuideEvaluation } from "@/app/actions/newsletter";

/**
 * Bloc d'acquisition « Guide pratique : préparer l'évaluation quinquennale » (plan SEO ligne 41).
 * Capte l'email via la server action demanderGuideEvaluation (même base SMTP que le guide DDPP).
 */
export function GuideEvaluationForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [resultat, setResultat] = useState<null | { pdfDisponible: boolean }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    try {
      const res = await demanderGuideEvaluation({ email, website });
      if (res.success) {
        setResultat({ pdfDisponible: res.pdfDisponible });
        toast.success(
          res.pdfDisponible
            ? "Le guide vous a été envoyé par email."
            : "Demande enregistrée : vous recevrez le guide dès sa parution."
        );
        setEmail("");
        setWebsite("");
      } else {
        toast.error(res.error || "Une erreur est survenue.");
      }
    } catch {
      toast.error("Erreur d'envoi. Veuillez réessayer.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.section
      id="guide-evaluation-quinquennale"
      aria-labelledby="guide-evaluation-heading"
      className="mt-20 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8 md:p-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:items-center">
        <div className="md:col-span-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
            <FileText className="h-3.5 w-3.5" />
            Guide PDF gratuit
          </span>
          <h2 id="guide-evaluation-heading" className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
            Guide pratique : préparer l’évaluation quinquennale de votre crèche
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
            Le Code de la santé publique prévoit une évaluation des EAJE tous les cinq ans. Ce guide vous aide à
            structurer l’auto-évaluation, les preuves de terrain, la consultation des familles et le plan
            d’amélioration à partir du Référentiel national publié en 2025.
          </p>
        </div>

        <div className="md:col-span-2">
          {resultat ? (
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span>
                {resultat.pdfDisponible
                  ? "C’est envoyé : vérifiez votre boîte mail."
                  : "Demande enregistrée : vous recevrez le guide par email dès sa parution."}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <label htmlFor="guide-evaluation-email" className="text-sm font-semibold text-gray-800">
                Votre email professionnel
              </label>
              <input
                id="guide-evaluation-email"
                type="email"
                name="email"
                required
                placeholder="direction@creche.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none"
              />
              {/* Champ piège anti-spam (honeypot) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <button
                id="guide-evaluation-submit"
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Recevoir le guide PDF"}
              </button>
            </form>
          )}
          <p className="mt-3 text-[11px] leading-snug text-gray-400">
            Guide pratique ; son contenu doit être actualisé si les modalités réglementaires évoluent.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
