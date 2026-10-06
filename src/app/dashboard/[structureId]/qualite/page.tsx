import { redirect } from "next/navigation";

export default function QualitePage({
  params,
}: {
  params: { structureId: string };
}) {
  redirect(`/dashboard/${params.structureId}/qualite/auto-evaluation`);
}
