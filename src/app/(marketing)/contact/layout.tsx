import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez l'équipe RZPan'Da | RZPan'Da",
  description:
    "Une question sur le logiciel RZPan'Da ou besoin d'une démonstration personnalisée ? Contactez notre équipe dédiée aux crèches et micro-crèches.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
