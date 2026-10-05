import type { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Démo RZPan'Da : logiciel HACCP pour crèches",
  absoluteTitle: true,
  description:
    "Demandez une démo de RZPan'Da pour centraliser HACCP, traçabilité, biberonnerie et plan de nettoyage dans votre crèche ou micro-crèche.",
  path: "/contact/",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
