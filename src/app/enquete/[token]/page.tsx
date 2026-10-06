import { Metadata } from "next";
import { getEnquetePublicData } from "@/app/actions/enquetes";
import { EnqueteParentForm } from "@/components/qualite/enquete-parent-form";
import { AlertCircle, ArrowLeft, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    token: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getEnquetePublicData(params.token);
  if (!data.enquete) {
    return {
      title: "Enquête de satisfaction - RZPan'Da",
    };
  }

  return {
    title: `${data.enquete.titre} - ${data.enquete.structure.nom}`,
    description: data.enquete.description || "Donnez votre avis sur l'accueil et la qualité de la crèche",
  };
}

export default async function EnquetePublicPage({ params }: PageProps) {
  const result = await getEnquetePublicData(params.token);

  // Cas où l'objectif de réponses fixé pour l'enquête a été atteint
  if (result.quotaAtteint && result.enquete) {
    const { enquete } = result;
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/40 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-emerald-100 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Objectif de réponses atteint</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Merci pour votre mobilisation !
          </h1>

          <div className="bg-emerald-50/70 rounded-2xl p-4 my-4 border border-emerald-100/90 text-left">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold mb-1">
              <span>{enquete.structure.nom}</span>
              {enquete.cible_reponses && (
                <span>
                  {enquete._count.reponses} / {enquete.cible_reponses} réponses
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-700/90 font-medium leading-relaxed">
              Le nombre maximal de retours attendus pour cette enquête a été complété. Le formulaire n&apos;accepte plus de nouvelles soumissions.
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Nous remercions chaleureusement toutes les familles pour leur participation et leur confiance. Vos avis permettent d&apos;améliorer continuellement l&apos;accueil et la qualité au quotidien.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (result.error || !result.enquete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Enquête non accessible</h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {result.error || "Ce lien d'enquête n'est plus valide ou l'enquête est clôturée."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const { enquete } = result;

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <EnqueteParentForm
          token={enquete.token}
          titre={enquete.titre}
          description={enquete.description}
          structureNom={enquete.structure.nom}
          structureVille={enquete.structure.ville}
          questions={enquete.questions.map((q) => ({
            id: q.id,
            libelle: q.libelle,
            type_question: q.type_question as any,
            obligatoire: q.obligatoire,
            ordre: q.ordre,
          }))}
        />
      </div>
    </div>
  );
}
