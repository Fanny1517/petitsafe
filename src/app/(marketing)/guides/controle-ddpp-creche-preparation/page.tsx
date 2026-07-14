import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Contrôle DDPP en crèche : comment s’y préparer sans stress | RZPan'Da",
  description:
    "Préparer un contrôle DDPP en micro-crèche : les 7 documents attendus, les erreurs qui coûtent cher, la méthode pour sortir un dossier complet en 3 clics.",
};

export default function GuideDDPPPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <article className="pb-20 pt-28 md:pt-36 bg-white">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
                Guide DDPP
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl leading-tight">
                Contrôle DDPP en crèche : la méthode pour être prête à tout moment
              </h1>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Un contrôle DDPP se joue sur la traçabilité. Voici les 7 documents toujours attendus, les pièges à éviter, et comment réunir tout ça en 3 clics.
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
                Ce que la DDPP vérifie en priorité
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 7 documents à avoir sous la main
              </h2>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                1. Relevés de température
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                2. Traçabilité des lots alimentaires
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                3. Plan de nettoyage et émargement
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                4. Plats témoins
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                5. PMS (Plan de Maîtrise Sanitaire)
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                6. Registre biberonnerie
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                7. Formation du personnel
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Contenu à rédiger.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 3 erreurs qui coûtent cher
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
                Sortir votre dossier en 3 clics
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
