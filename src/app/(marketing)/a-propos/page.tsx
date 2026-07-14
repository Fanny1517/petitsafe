import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Sparkles, UserCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Qui sommes-nous ? La mission de RZPan'Da | RZPan'Da",
  description:
    "Découvrez l'histoire et les valeurs de RZPan'Da : simplifier le quotidien réglementaire des crèches et micro-crèches pour leur redonner du temps auprès des enfants.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-red-600" />,
      title: "Pensé pour le terrain",
      description:
        "Nous croyons que la technologie doit s'adapter aux équipes, pas l'inverse. RZPan'Da se prend en main en 2 minutes avec des écrans clairs et de grands boutons tactiles utilisables même avec les bras chargés.",
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: "Rigueur & Conformité",
      description:
        "Nous traduisons la complexité des réglementations (décrets, HACCP, normes ANSES) en actions simples et guidées au quotidien. Soyez tranquille, vous êtes toujours en conformité.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-600" />,
      title: "Proximité & Accompagnement",
      description:
        "Développé en France et hébergé en Europe, notre outil s'accompagne d'un support humain et réactif. Nous formons personnellement chaque structure pilote en visioconférence.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        {/* About Hero Section */}
        <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36 bg-rzpanda-bg border-b border-gray-100">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_55%)]"></div>
          <div className="mx-auto max-w-5xl px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100 mb-4">
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
              Notre mission
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              Libérer les crèches de la paperasse réglementaire
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              Nous simplifions les tâches HACCP, la traçabilité et le suivi administratif pour redonner aux professionnels de la petite enfance leur ressource la plus précieuse : le temps.
            </p>
          </div>
        </section>

        {/* History / Origin Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <div className="prose prose-lg text-gray-800">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                Pourquoi avoir créé RZPan'Da ?
              </h2>
              <p className="text-base leading-relaxed text-gray-500 mb-6">
                La gestion d'une micro-crèche, d'une crèche ou d'une MAM est un métier passionnant mais d'une complexité administrative croissante. Entre le suivi du sommeil des enfants, les repas, la gestion de la biberonnerie et les obligations strictes du protocole HACCP, les professionnels passent en moyenne plus de 12 heures par semaine à remplir des classeurs papier ou à mettre à jour des tableaux Excel déconnectés.
              </p>
              <p className="text-base leading-relaxed text-gray-500 mb-6">
                Le stress d'un contrôle inopiné de la DDPP ou de la PMI ne devrait pas gâcher le quotidien de ceux qui s'occupent de nos enfants. 
              </p>
              <p className="text-base leading-relaxed text-gray-500 mb-6">
                C'est de ce constat qu'est né **RZPan'Da**. Nous avons voulu concevoir un registre HACCP numérique et un suivi quotidien qui ne demandent aucune compétence technique. Un outil unique, 100% sécurisé et pensé spécifiquement pour le quotidien de la petite enfance en France.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-rzpanda-bg py-16 md:py-24 border-y border-gray-100">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Les valeurs qui nous guident
              </h2>
              <p className="mt-4 text-base text-gray-500">
                Chaque ligne de code de notre application est guidée par trois principes fondamentaux.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${value.color} mb-6`}>
                    {value.icon}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              Profitez d'un accès complet et gratuit pendant 30 jours, sans engagement et sans carte bancaire requise.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
              >
                Démarrer l'essai gratuit
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
