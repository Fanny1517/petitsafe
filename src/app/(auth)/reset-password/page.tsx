"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { LogoText } from "@/components/shared/logo-text";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe.");
      return;
    }

    // Déconnexion de la session temporaire de réinitialisation pour forcer la re-connexion
    await supabase.auth.signOut();
    setSuccess(true);
    toast.success("Votre mot de passe a été réinitialisé avec succès !");

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-rzpanda-fond flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold"><LogoText /></h1>
          <p className="mt-2 text-sm text-gray-500">Nouveau mot de passe</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center text-green-600">
              <CheckCircle2 size={48} />
            </div>
            <p className="text-green-800 font-medium text-lg">Mot de passe modifié !</p>
            <p className="text-sm text-green-700">
              Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion dans un instant...
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-rzpanda-primary hover:underline mt-4">
              <ArrowLeft size={16} /> Se connecter immédiatement
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none pr-10"
                  autoComplete="new-password"
                />
                <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-rzpanda-primary focus:ring-2 focus:ring-rzpanda-primary/20 outline-none pr-10"
                  autoComplete="new-password"
                />
                <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-rzpanda-primary text-white font-medium hover:bg-rzpanda-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />} Réinitialiser le mot de passe
            </button>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-rzpanda-primary">
              <ArrowLeft size={16} /> Annuler et retourner à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
