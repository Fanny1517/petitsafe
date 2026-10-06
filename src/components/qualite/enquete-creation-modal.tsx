"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { TEMPLATES_ENQUETES, type TemplateEnquete } from "@/lib/qualite/enquetes-templates";
import { AxeQualite, TypeEnquete, TypeQuestionEnquete } from "@prisma/client";
import { creerEnqueteCampagne } from "@/app/actions/enquetes";
import type { CreerEnqueteInput } from "@/lib/schemas/enquetes";

interface EnqueteCreationModalProps {
  structureId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function EnqueteCreationModal({ structureId, onClose, onCreated }: EnqueteCreationModalProps) {
  const [step, setStep] = useState<"template" | "form">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateEnquete | null>(null);

  // Form state
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [typeEnquete, setTypeEnquete] = useState<TypeEnquete>(TypeEnquete.ANNUELLE);
  const [cibleReponses, setCibleReponses] = useState<number | "">(25);
  const [dateFin, setDateFin] = useState("");
  const [anonyme, setAnonyme] = useState(true);
  const [emailsNotification, setEmailsNotification] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailInputError, setEmailInputError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<
    Array<{
      libelle: string;
      type_question: TypeQuestionEnquete;
      obligatoire: boolean;
      axe_qualite?: AxeQualite | null;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectTemplate = (tpl: TemplateEnquete) => {
    setSelectedTemplate(tpl);
    setTitre(tpl.titre);
    setDescription(tpl.description);
    setTypeEnquete(tpl.type);
    setQuestions(
      tpl.questions.map((q) => ({
        libelle: q.libelle,
        type_question: q.type_question,
        obligatoire: q.obligatoire,
        axe_qualite: q.axe_qualite || null,
      }))
    );
    setStep("form");
  };

  const handleSelectCustom = () => {
    setSelectedTemplate(null);
    setTitre("Nouvelle enquête de satisfaction");
    setDescription("");
    setTypeEnquete(TypeEnquete.AUTRE);
    setQuestions([
      {
        libelle: "Comment évaluez-vous la qualité globale de l'accueil ?",
        type_question: TypeQuestionEnquete.NOTE_5,
        obligatoire: true,
        axe_qualite: AxeQualite.ACCUEIL_SECURITE,
      },
      {
        libelle: "Avez-vous des suggestions à nous transmettre ?",
        type_question: TypeQuestionEnquete.TEXTE,
        obligatoire: false,
        axe_qualite: null,
      },
    ]);
    setStep("form");
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        libelle: "",
        type_question: TypeQuestionEnquete.NOTE_5,
        obligatoire: true,
        axe_qualite: null,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleAddEmail = () => {
    setEmailInputError(null);
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailInputError("Format d'adresse email invalide");
      return;
    }

    if (emailsNotification.includes(trimmed)) {
      setEmailInputError("Cet email est déjà dans la liste");
      return;
    }

    setEmailsNotification((prev) => [...prev, trimmed]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailsNotification((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const handleKeyDownEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!titre.trim()) {
      setErrorMsg("Veuillez indiquer un titre pour votre enquête");
      return;
    }

    if (questions.length === 0) {
      setErrorMsg("L'enquête doit comporter au moins une question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].libelle.trim()) {
        setErrorMsg(`Le libellé de la question n°${i + 1} ne peut pas être vide`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload: CreerEnqueteInput = {
        structureId,
        titre: titre.trim(),
        description: description.trim() || null,
        type_enquete: typeEnquete,
        cible_reponses: cibleReponses === "" ? null : Number(cibleReponses),
        date_fin: dateFin || null,
        anonyme,
        emails_notification: emailsNotification,
        questions: questions.map((q, idx) => ({
          libelle: q.libelle.trim(),
          type_question: q.type_question,
          obligatoire: q.obligatoire,
          ordre: idx + 1,
          axe_qualite: q.axe_qualite || null,
        })),
      };

      const res = await creerEnqueteCampagne(payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        onCreated();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg("Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Modal */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 text-emerald-800 rounded-full text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Nouvelle campagne
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === "template" ? "Choisir un modèle d'enquête" : "Configurer la campagne"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corps modal avec scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* ÉTAPE 1 : SÉLECTION DU TEMPLATE */}
          {step === "template" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Gagnez du temps en sélectionnant un questionnaire clé-en-main conforme au référentiel national 2025,
                ou partez d&apos;une enquête personnalisée.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {TEMPLATES_ENQUETES.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs border border-emerald-100">
                          {tpl.badge}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {tpl.questions.length} questions
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition mb-2">
                        {tpl.titre}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                      <span>Utiliser ce modèle</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                ))}

                {/* Modèle personnalisé */}
                <div
                  onClick={handleSelectCustom}
                  className="p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 font-semibold rounded-full text-xs">
                        Sur-mesure
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition mb-2">
                      Enquête personnalisée
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Créez vos propres questions thématiques (sorties extérieures, fête de fin d&apos;année, avis ponctuel...).
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-gray-700 group-hover:text-emerald-600 transition">
                    <span>Créer de zéro</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ÉTAPE 2 : FORMULAIRE DE CONFIGURATION */
            <form id="creer-enquete-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("template")}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  ← Changer de modèle
                </button>
                {selectedTemplate && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                    Modèle : {selectedTemplate.badge}
                  </span>
                )}
              </div>

              {/* Paramètres généraux */}
              <div className="space-y-4 bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Titre de la campagne *
                  </label>
                  <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    required
                    className="w-full p-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Message d&apos;introduction pour les parents
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Expliquez brièvement l'objet de cette consultation..."
                    className="w-full p-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Objectif de réponses (cible)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={cibleReponses}
                      onChange={(e) => setCibleReponses(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex: 25"
                      className="w-full p-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Date limite de clôture (facultatif)
                    </label>
                    <input
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      className="w-full p-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                {/* Notifications email des nouvelles soumissions */}
                <div className="pt-2 border-t border-gray-200/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Destinataires alertés à chaque évaluation reçue
                    </label>
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      Admin inclus d&apos;office
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2.5">
                    Indiquez les adresses email (ex: direction, coordinatrice) qui recevront la notification détaillée en temps réel.
                  </p>

                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setEmailInputError(null);
                        }}
                        onKeyDown={handleKeyDownEmail}
                        placeholder="nom@exemple.com (Appuyez sur Entrée ou Ajouter)"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-gray-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  {emailInputError && (
                    <p className="text-xs text-red-600 font-medium mb-2">{emailInputError}</p>
                  )}

                  {emailsNotification.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {emailsNotification.map((em) => (
                        <span
                          key={em}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200"
                        >
                          <Mail className="w-3 h-3 text-emerald-600" />
                          <span>{em}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(em)}
                            className="text-emerald-600 hover:text-red-600 transition"
                            title="Supprimer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      Aucun email supplémentaire configuré (seul l&apos;administrateur principal sera notifié).
                    </p>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Questions ({questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter une question
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Intitulé de la question..."
                          value={q.libelle}
                          onChange={(e) => handleQuestionChange(index, "libelle", e.target.value)}
                          className="flex-1 p-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          title="Supprimer la question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 pl-8">
                        <div>
                          <label className="block text-gray-500 font-medium mb-1">Type de réponse</label>
                          <select
                            value={q.type_question}
                            onChange={(e) =>
                              handleQuestionChange(index, "type_question", e.target.value as TypeQuestionEnquete)
                            }
                            className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white"
                          >
                            <option value="NOTE_5">Étoiles (1 à 5)</option>
                            <option value="OUI_NON">Oui / Non</option>
                            <option value="TEXTE">Commentaire libre</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-500 font-medium mb-1">Axe référentiel 2025</label>
                          <select
                            value={q.axe_qualite || ""}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "axe_qualite",
                                e.target.value === "" ? null : (e.target.value as AxeQualite)
                              )
                            }
                            className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white"
                          >
                            <option value="">(Aucun axe spécifique)</option>
                            <option value="ACCUEIL_SECURITE">Axe 1 : accueil et sécurité</option>
                            <option value="DEVELOPPEMENT_EVEIL">Axe 2 : éveil et rythmes</option>
                            <option value="RELATION_FAMILLES">Axe 3 : relation familles</option>
                            <option value="PILOTAGE_RISQUES">Axe 4 : organisation et qualité</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id={`obl-${index}`}
                            checked={q.obligatoire}
                            onChange={(e) => handleQuestionChange(index, "obligatoire", e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <label htmlFor={`obl-${index}`} className="text-gray-700 font-medium cursor-pointer">
                            Obligatoire
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-semibold transition"
          >
            Annuler
          </button>

          {step === "form" && (
            <button
              type="submit"
              form="creer-enquete-form"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              {loading ? (
                <span>Création en cours...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lancer la campagne</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
