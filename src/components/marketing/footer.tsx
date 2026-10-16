"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { demanderGuideDDPP } from "@/app/actions/newsletter";

export function Footer() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    try {
      const res = await demanderGuideDDPP({ email, website });
      if (res.success) {
        setIsSuccess(true);
        toast.success("Le Guide DDPP 2026 vous a été envoyé par email !");
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
    <footer className="border-t border-black/5 bg-white pb-24 pt-16 md:pb-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Column 1: Produit */}
          <nav aria-label="Produit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Produit
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/#fonctionnalites"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="/#tarifs"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Feuille de route
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 2: Ressources */}
          <nav aria-label="Ressources">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Ressources
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/guides/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/controle-ddpp-creche-preparation/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guide DDPP
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/decret-2025-304-micro-creche/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guide décret 2025-304
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3: Entreprise */}
          <nav aria-label="Entreprise">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Entreprise
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/a-propos/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Restons en contact
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:contact@rzpanda.com"
                aria-label="Nous écrire"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/company/rzpanda"
                aria-label="LinkedIn RZPan'Da"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            </div>

            {isSuccess ? (
              <div className="mt-5 rounded-lg bg-green-50 p-3 text-xs text-green-700 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                <span>Guide DDPP 2026 envoyé ! Vérifiez votre boîte mail.</span>
              </div>
            ) : (
              <form className="mt-5 flex flex-col gap-2" onSubmit={handleSubmit}>
                <label htmlFor="newsletter-email" className="text-xs text-gray-400">
                  Guide DDPP 2026 — recevez-le par email
                </label>
                <div className="flex gap-2">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="vous@creche.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none"
                    name="email"
                  />
                  {/* Honeypot field */}
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
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 inline-flex items-center justify-center min-w-[44px]"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "OK"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Logo and copyright footer bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/rzpanda-logo.png"
              alt="RZPan'Da"
              width={140}
              height={46}
              className="h-8 md:h-9 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-gray-400">
            © 2026 RZPan'Da · Conçu en France 🇫🇷 · rzpanda.com
          </p>
        </div>
      </div>
    </footer>
  );
}
