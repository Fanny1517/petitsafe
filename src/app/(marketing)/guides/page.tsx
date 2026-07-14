import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Guides réglementaires et HACCP pour crèches & micro-crèches | RZPan'Da",
  description:
    "Tous nos guides pratiques et réglementaires pour micro-crèches, crèches et MAM : préparation aux contrôles DDPP/PMI, décryptages de décrets, biberonnerie et traçabilité.",
};

export default function GuidesListPage() {
  const guides = [
    {
      title: "Contrôle DDPP en crèche : la méthode pour être prête à tout moment",
      description:
        "Un contrôle DDPP se joue sur la traçabilité. Découvrez les 7 documents toujours attendus par les inspecteurs, les pièges classiques à éviter, et comment préparer vos dossiers en 3 clics.",
      category: "Guide DDPP",
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      href: "/guides/controle-ddpp-creche-preparation",
      readTime: "Lecture : 5 min",
    },
    {
      title: "Décret 2025-304 : ce qui change pour les micro-crèches en septembre 2026",
      description:
        "Le décret 2025-304 durcit les obligations HACCP, traçabilité et biberonnerie des structures d'accueil 0-3 ans. Voici une synthèse complète des échéances et des solutions pour vous mettre en conformité.",
      category: "Guide Réglementaire",
      icon: <Calendar className="h-6 w-6 text-indigo-600" />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      href: "/guides/decret-2025-304-micro-creche",
      readTime: "Lecture : 6 min",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Hero Header list */}
        <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36 bg-rzpanda-bg border-b border-gray-100">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_55%)]"></div>
          <div className="mx-auto max-w-5xl px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100 mb-4">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Ressources gratuites
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              Nos guides pour crèches & micro-crèches
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              Retrouvez toutes nos ressources réglementaires, nos conseils de traçabilité HACCP et nos décryptages de décrets pour simplifier la gestion de votre structure.
            </p>
          </div>
        </section>

        {/* Guides Cards List */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guides.map((guide, index) => (
                <article
                  key={index}
                  className="flex flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-200/50 transition duration-300 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${guide.color}`}>
                      {guide.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {guide.readTime}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex gap-4 items-start mb-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        {guide.icon}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition">
                        <Link href={guide.href}>{guide.title}</Link>
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500 mb-6">
                      {guide.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-50 pt-5">
                    <Link
                      href={guide.href}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition"
                    >
                      Lire le guide pratique
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter Callout */}
            <div className="mt-20 rounded-3xl border border-blue-100 bg-blue-50/20 p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Vous souhaitez recevoir les prochains guides par email ?
              </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
                Rejoignez notre lettre d'information réglementaire. Nous envoyons un récapitulatif clair et actionnable chaque fois qu'un décret ou une consigne DDPP évolue.
              </p>
              <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/api/newsletter" method="post">
                <input
                  type="email"
                  required
                  placeholder="votre-email@creche.fr"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none"
                  name="email"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-95 shrink-0"
                >
                  S'abonner gratuitement
                </button>
              </form>
              <p className="mt-3 text-[10px] text-gray-400 font-medium">
                Aucun spam · Désinscription en un clic
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
