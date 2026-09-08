import { Metadata } from "next";
import { getEnquetePublicData } from "@/app/actions/enquetes";
import { EnqueteParentForm } from "@/components/qualite/enquete-parent-form";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    token: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getEnquetePublicData(params.token);
  if (data.error || !data.enquete) {
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
