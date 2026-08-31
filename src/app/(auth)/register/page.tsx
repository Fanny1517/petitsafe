"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { PandaIcon } from "@/components/shared/panda-icon";
import { LogoText } from "@/components/shared/logo-text";
import Link from "next/link";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  MailCheck,
  RotateCcw,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import {
  TYPES_STRUCTURE,
  MODULES_DISPONIBLES,
  PRESETS_MODULES,
  type ModuleId,
} from "@/lib/constants";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [typeStructure, setTypeStructure] = useState("");
  const [nomStructure, setNomStructure] = useState("");
  const [modulesActifs, setModulesActifs] = useState<ModuleId[]>([...PRESETS_MODULES.complet]);
  const [showCustomModules, setShowCustomModules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // État post-soumission (attente de confirmation par email)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resending, setResending] = useState(false);

  const toggleModule = (moduleId: ModuleId) => {
    setModulesActifs((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  const selectPreset = (preset: ModuleId[]) => {
    setModulesActifs([...preset]);
    setShowCustomModules(false);
  };

  const isPresetSelected = (preset: readonly ModuleId[]) => {
    return preset.length === modulesActifs.length && preset.every((m) => modulesActifs.includes(m));
  };

  const validateStep1 = () => {
    if (!prenom.trim() || !nom.trim() || !email.trim() || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!typeStructure || !nomStructure.trim()) {
      toast.error("Veuillez remplir tous les champs.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (modulesActifs.length === 0) {
      toast.error("Activez au moins un module.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          prenom: prenom.trim(),
          nom: nom.trim(),
          nomStructure: nomStructure.trim(),
          typeStructure,
          modulesActifs,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Erreur lors de la demande d'inscription.");
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
      toast.success("Demande enregistrée ! Vérifiez votre boîte de réception.");
    } catch (error) {
      console.error("[RegisterPage] Erreur :", error);
      toast.error("Une erreur réseau est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/register/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          prenom: prenom.trim(),
          nom: nom.trim(),
          nomStructure: nomStructure.trim(),
          typeStructure,
          modulesActifs,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Impossible de renvoyer l'email pour le moment.");
      } else {
        toast.success("Un nouvel email de validation a été envoyé.");
      }
    } catch {
      toast.error("Erreur réseau lors de la tentative de renvoi.");
    } finally {
      setResending(false);
    }
  };

  const categoriesModules = {
    haccp: Object.entries(MODULES_DISPONIBLES).filter(([, m]) => m.categorie === "haccp"),
    suivi: Object.entries(MODULES_DISPONIBLES).filter(([, m]) => m.categorie === "suivi"),
    gestion: Object.entries(MODULES_DISPONIBLES).filter(([, m]) => m.categorie === "gestion"),
  };

  // ══════════════════════════════════════════════════════════════════
  // Écran de confirmation d'envoi d'email
  // ══════════════════════════════════════════════════════════════════
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-teal-100/80 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 mb-5 shadow-inner">
            <MailCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Vérifiez votre boîte mail 📬
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Un email de confirmation sécurisé vient d&apos;être envoyé à l&apos;adresse :
            <br />
            <strong className="text-slate-900 font-semibold text-base">{email}</strong>
          </p>

          {/* Instructions pas-à-pas */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <p className="text-xs text-slate-700 leading-normal">
                Ouvrez l&apos;email reçu de <strong>RZPan&apos;Da</strong> (expéditeur : info@rzpanda.com).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <p className="text-xs text-slate-700 leading-normal">
                Cliquez sur le bouton <strong>« Valider mon inscription »</strong> pour activer votre structure « {nomStructure} ».
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <p className="text-xs text-slate-700 leading-normal">
                Votre lien sécurisé est valable pendant <strong>24 heures</strong>.
              </p>
            </div>
          </div>

          {/* Rappel PIN 0000 */}
          <div className="bg-teal-50/60 border border-teal-200/60 rounded-xl p-3.5 text-left mb-6 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-900">
              <strong>Code PIN d&apos;équipe :</strong> Le code PIN par défaut configuré sera <strong>0000</strong> pour déverrouiller vos futures sessions tablettes.
            </p>
          </div>

          {/* Boutons d'actions */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              ) : (
                <RotateCcw className="w-4 h-4 text-slate-500" />
              )}
              <span>Renvoyer l&apos;email de validation</span>
            </button>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Aller à la page de connexion</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // Formulaire d'inscription en 3 étapes
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-rzpanda-fond flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center flex flex-col items-center">
          <PandaIcon size={64} />
          <h1 className="mt-3 text-3xl font-bold">
            <LogoText />
          </h1>
          <p className="mt-2 text-sm text-gray-500">Créer votre compte — Étape {step}/3</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? "bg-rzpanda-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 — Infos personnelles */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 caractères minimum"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              onClick={() => validateStep1() && setStep(2)}
              className="w-full h-12 rounded-xl bg-rzpanda-primary text-white font-medium hover:bg-rzpanda-primary/90 flex items-center justify-center gap-2 transition-colors"
            >
              Suivant <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2 — Structure */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type de structure
              </label>
              <select
                id="type"
                value={typeStructure}
                onChange={(e) => setTypeStructure(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none bg-white"
              >
                <option value="">Sélectionnez...</option>
                {Object.entries(TYPES_STRUCTURE).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="nomStructure"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom de la structure
              </label>
              <input
                id="nomStructure"
                type="text"
                value={nomStructure}
                onChange={(e) => setNomStructure(e.target.value)}
                placeholder="Les Petits Explorateurs"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="h-12 px-6 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Retour
              </button>
              <button
                onClick={() => validateStep2() && setStep(3)}
                className="flex-1 h-12 rounded-xl bg-rzpanda-primary text-white font-medium hover:bg-rzpanda-primary/90 flex items-center justify-center gap-2 transition-colors"
              >
                Suivant <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Modules */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Que souhaitez-vous gérer avec {"RZPan'Da"} ?
            </p>

            {/* Preset cards */}
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => selectPreset([...PRESETS_MODULES.haccp_essentiel])}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  isPresetSelected(PRESETS_MODULES.haccp_essentiel)
                    ? "border-rzpanda-primary bg-rzpanda-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Shield size={24} className="text-rzpanda-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">HACCP &amp; Traçabilité</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Conformité réglementaire, températures, nettoyage, biberonnerie
                    </p>
                  </div>
                  {isPresetSelected(PRESETS_MODULES.haccp_essentiel) && (
                    <Check size={20} className="text-rzpanda-primary shrink-0" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectPreset([...PRESETS_MODULES.complet])}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  isPresetSelected(PRESETS_MODULES.complet)
                    ? "border-rzpanda-primary bg-rzpanda-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Sparkles size={24} className="text-rzpanda-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Solution complète</p>
                    <p className="text-sm text-gray-500 mt-1">
                      HACCP + suivi enfants + gestion quotidienne
                    </p>
                  </div>
                  {isPresetSelected(PRESETS_MODULES.complet) && (
                    <Check size={20} className="text-rzpanda-primary shrink-0" />
                  )}
                </div>
              </button>
            </div>

            {/* Custom modules toggle */}
            <button
              type="button"
              onClick={() => setShowCustomModules(!showCustomModules)}
              className="text-sm text-rzpanda-primary hover:underline mx-auto block"
            >
              Personnaliser les modules →
            </button>

            {showCustomModules && (
              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                {Object.entries(categoriesModules).map(([cat, modules]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {cat === "haccp"
                        ? "HACCP & Traçabilité"
                        : cat === "suivi"
                        ? "Suivi Enfants"
                        : "Gestion"}
                    </p>
                    <div className="space-y-1.5">
                      {modules.map(([id, mod]) => (
                        <label
                          key={id}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={modulesActifs.includes(id as ModuleId)}
                            onChange={() => toggleModule(id as ModuleId)}
                            className="h-4 w-4 rounded border-gray-300 text-rzpanda-primary focus:ring-rzpanda-primary"
                          />
                          <span className="text-sm text-gray-700">{mod.label}</span>
                          <span className="text-xs text-gray-400 ml-auto">{mod.description}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">
              Vous pourrez modifier ce choix à tout moment dans les paramètres.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-12 px-6 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Retour
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 h-12 rounded-xl bg-rzpanda-primary text-white font-medium hover:bg-rzpanda-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                Créer mon compte
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-rzpanda-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
