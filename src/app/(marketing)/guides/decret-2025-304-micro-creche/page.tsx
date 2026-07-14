import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Décret 2025-304 micro-crèche : ce qui change en septembre 2026 | RZPan'Da",
  description:
    "Le décret 2025-304 impose de nouvelles obligations aux micro-crèches et MAM à partir de septembre 2026. Synthèse complète, échéances, solutions.",
};

export default function DecretGuidePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <article className="pb-20 pt-28 md:pt-36 bg-white">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
                Guide réglementaire
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl leading-tight">
                Décret 2025-304 : ce qui change pour les micro-crèches en septembre 2026
              </h1>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Le décret 2025-304 durcit les obligations HACCP, traçabilité et biberonnerie des structures d'accueil 0-3 ans. Voici ce que vous devez préparer dès maintenant.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[22px] py-[14px] text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit"
                >
                  Démarrer l'essai gratuit
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-800">
              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                À qui s'applique le décret 2025-304 ?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Contenu à rédiger — stub structure uniquement.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 4 nouvelles obligations clés
              </h2>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                1. Traçabilité HACCP renforcée
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                2. Biberonnerie aux normes ANSES
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                3. Exports DDPP unifiés
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                4. Registre des contrôles internes
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Calendrier : septembre 2026, sans délai
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Comment s'organiser maintenant
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[22px] py-[14px] text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit 30 jours"
                >
                  Démarrer l'essai gratuit 30 jours
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                FAQ décret 2025-304
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>
            </div>

            {/* Aside Callout Box */}
            <aside className="mt-16 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900">
                Mettez-vous en conformité sans y passer vos soirées.
              </h2>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                RZPan'Da couvre HACCP, biberonnerie ANSES, suivi enfants et exports DDPP. Essai gratuit 30 jours, sans carte bancaire.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit 30 jours"
                >
                  Démarrer l'essai gratuit 30 jours
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
