"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { validerInscription, type ValidationResult } from "@/app/actions/valider-inscription";
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, Key, Sparkles } from "lucide-react";

function ValiderInscriptionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [countdown, setCountdown] = useState(5);
  const executedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setResult({
        success: false,
        error: "Aucun jeton de validation fourni dans le lien. Veuillez utiliser le lien reçu par email.",
      });
      setLoading(false);
      return;
    }

    if (executedRef.current) return;
    executedRef.current = true;

    async function executeValidation() {
      try {
        const res = await validerInscription(token!);
        setResult(res);
      } catch (err) {
        setResult({
          success: false,
          error: err instanceof Error ? err.message : "Erreur inattendue lors de la validation.",
        });
      } finally {
        setLoading(false);
      }
    }

    executeValidation();
  }, [token]);

  // Compte à rebours de redirection automatique en cas de succès
  useEffect(() => {
    if (!result?.success) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/login?verified=true&email=${encodeURIComponent(result.email)}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-teal-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
            🐼
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
            RZPan&apos;Da
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-teal-900/5 rounded-3xl border border-teal-100/80">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Validation de votre inscription...
              </h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Nous préparons votre structure et configurons vos modules de traçabilité.
              </p>
            </div>
          ) : result?.success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-5 animate-bounce-short">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                Inscription confirmée ! 🎉
              </h2>

              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Votre structure <strong className="text-slate-900 font-semibold">« {result.nomStructure} »</strong> est maintenant créée et active.
              </p>

              {/* Rappel PIN 0000 */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-200/70 rounded-2xl p-4 text-left mb-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                      Code PIN d&apos;accès initial : <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-teal-200 text-teal-700">0000</span>
                    </h3>
                    <p className="text-xs text-teal-800/90 mt-1 leading-relaxed">
                      Votre profil administrateur (« Directrice ») a été initialisé avec ce code PIN par défaut. Vous pourrez le modifier à tout moment dans vos Paramètres.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/login?verified=true&email=${encodeURIComponent(result.email)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Accéder à mon espace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-xs text-slate-400">
                  Redirection automatique dans <span className="font-semibold text-teal-700">{countdown}s</span>...
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-5">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Validation impossible
              </h2>

              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {result?.error || "Le lien de validation est invalide ou a expiré."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Recommencer l&apos;inscription</span>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  Aller à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ValiderInscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <ValiderInscriptionContent />
    </Suspense>
  );
}
