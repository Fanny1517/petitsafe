"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, AlertCircle, Send, Heart, Building2, Calendar, User, Mail, ShieldCheck } from "lucide-react";
import { soumettreReponseParent } from "@/app/actions/enquetes";
import type { ReponseValeurInput } from "@/lib/schemas/enquetes";

interface QuestionPublic {
  id: string;
  libelle: string;
  type_question: "NOTE_5" | "OUI_NON" | "TEXTE" | "CHOIX_UNIQUE";
  obligatoire: boolean;
  ordre: number;
}

interface EnqueteParentFormProps {
  token: string;
  titre: string;
  description?: string | null;
  structureNom: string;
  structureVille?: string | null;
  questions: QuestionPublic[];
}

export function EnqueteParentForm({
  token,
  titre,
  description,
  structureNom,
  structureVille,
  questions,
}: EnqueteParentFormProps) {
  // Coordonnées du parent (obligatoires)
  const [parentNom, setParentNom] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  // State des réponses : Record<question_id, ReponseValeurInput>
  const [reponses, setReponses] = useState<Record<string, ReponseValeurInput>>(() => {
    const initial: Record<string, ReponseValeurInput> = {};
    questions.forEach((q) => {
      initial[q.id] = {
        question_id: q.id,
        valeur_note: null,
        valeur_booleen: null,
        valeur_texte: "",
      };
    });
    return initial;
  });

  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNoteChange = (questionId: string, note: number) => {
    setReponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        valeur_note: note,
      },
    }));
  };

  const handleBooleenChange = (questionId: string, val: boolean) => {
    setReponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        valeur_booleen: val,
      },
    }));
  };

  const handleTexteChange = (questionId: string, text: string) => {
    setReponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        valeur_texte: text,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation préalable côté client
    for (const q of questions) {
      if (q.obligatoire) {
        const val = reponses[q.id];
        if (!val) {
          setErrorMsg(`Merci de répondre à la question : "${q.libelle}"`);
          return;
        }
        if (q.type_question === "NOTE_5" && (val.valeur_note === null || val.valeur_note === undefined)) {
          setErrorMsg(`Merci de noter la question : "${q.libelle}"`);
          return;
        }
        if (q.type_question === "OUI_NON" && (val.valeur_booleen === null || val.valeur_booleen === undefined)) {
          setErrorMsg(`Merci de répondre par Oui ou Non à : "${q.libelle}"`);
          return;
        }
      }
    }

    // Validation des coordonnées obligatoires du parent
    if (!parentNom.trim() || parentNom.trim().length < 2) {
      setErrorMsg("Veuillez renseigner votre Nom et prénom (obligatoire).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!parentEmail.trim() || !emailRegex.test(parentEmail.trim())) {
      setErrorMsg("Veuillez renseigner une adresse email valide (obligatoire).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = Object.values(reponses);
      const res = await soumettreReponseParent({
        token,
        parent_nom: parentNom.trim(),
        parent_email: parentEmail.trim(),
        reponses: payload,
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Merci {parentNom} pour votre retour précieux !
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Votre évaluation a été enregistrée avec succès. Elle permet à l&apos;équipe de{" "}
          <strong className="text-gray-800 font-semibold">{structureNom}</strong> d&apos;améliorer en continu
          la qualité de l&apos;accueil, du bien-être et de la sécurité de votre enfant.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Participation enregistrée avec l&apos;adresse {parentEmail}</span>
        </div>
      </div>
    );
  }

  // Calcul du nombre de questions répondues pour la jauge
  const totalQuestions = questions.length;
  const questionsRepondues = questions.filter((q) => {
    const r = reponses[q.id];
    if (!r) return false;
    if (q.type_question === "NOTE_5") return r.valeur_note !== null;
    if (q.type_question === "OUI_NON") return r.valeur_booleen !== null;
    if (q.type_question === "TEXTE") return (r.valeur_texte?.trim().length ?? 0) > 0;
    return false;
  }).length;
  const progressPct = totalQuestions > 0 ? Math.round((questionsRepondues / totalQuestions) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto my-6">
      {/* En-tête de l'enquête */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />
        
        <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs sm:text-sm font-medium mb-3">
          <Building2 className="w-4 h-4" />
          <span>{structureNom} {structureVille ? `(${structureVille})` : ""}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
          {titre}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {/* Barre de progression */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progression du questionnaire</span>
            <span className="font-semibold text-emerald-700">{questionsRepondues} / {totalQuestions}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Message d'erreur s'il y a lieu */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Liste des questions */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const currentRep = reponses[q.id];
          const currentHover = hoveredStars[q.id] || 0;

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 transition-all hover:border-emerald-200/80"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                      {q.libelle}
                      {q.obligatoire && <span className="text-red-500 ml-1 font-bold">*</span>}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Rendu selon le type de question */}
              {q.type_question === "NOTE_5" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        currentHover > 0
                          ? star <= currentHover
                          : currentRep?.valeur_note !== null &&
                            currentRep?.valeur_note !== undefined &&
                            star <= currentRep.valeur_note;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleNoteChange(q.id, star)}
                          onMouseEnter={() =>
                            setHoveredStars((prev) => ({ ...prev, [q.id]: star }))
                          }
                          onMouseLeave={() =>
                            setHoveredStars((prev) => ({ ...prev, [q.id]: 0 }))
                          }
                          className="p-2 sm:p-2.5 rounded-xl hover:bg-amber-50 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          aria-label={`${star} étoile sur 5`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                                : "text-gray-300 hover:text-amber-200"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>Très insatisfait (1)</span>
                    <span>Très satisfait (5)</span>
                  </div>
                </div>
              )}

              {q.type_question === "OUI_NON" && (
                <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                  <button
                    type="button"
                    onClick={() => handleBooleenChange(q.id, true)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      currentRep?.valeur_booleen === true
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    <span>Oui</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBooleenChange(q.id, false)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      currentRep?.valeur_booleen === false
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    <span>Non</span>
                  </button>
                </div>
              )}

              {q.type_question === "TEXTE" && (
                <div>
                  <textarea
                    rows={3}
                    placeholder="Votre commentaire ou suggestion (facultatif)..."
                    value={currentRep?.valeur_texte ?? ""}
                    onChange={(e) => handleTexteChange(q.id, e.target.value)}
                    className="w-full p-3.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coordonnées obligatoires du parent */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100/80 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Vos coordonnées (obligatoire)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Afin d'assurer la sincérité et l'authenticité du baromètre, une seule évaluation est acceptée par adresse email.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Nom et prénom *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={parentNom}
                onChange={(e) => setParentNom(e.target.value)}
                placeholder="Ex: Marie Dupont"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Adresse email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="Ex: marie.dupont@exemple.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-base sm:text-lg transition-all"
        >
          {isSubmitting ? (
            <span>Transmission en cours...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Transmettre mes réponses</span>
            </>
          )}
        </button>
        {/* Mention d'information RGPD (art. 13) : texte à faire valider par le DPO */}
        <p className="text-xs text-gray-400 mt-3 flex items-start justify-center gap-1.5 max-w-xl mx-auto leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Vos informations sont transmises de manière sécurisée à {structureNom} pour mesurer la
            satisfaction des familles et améliorer l&apos;accueil, conformément au RGPD. L&apos;email sert
            à n&apos;accepter qu&apos;une réponse par personne. Vous pouvez demander leur suppression à la
            structure.
          </span>
        </p>
      </div>
    </form>
  );
}
