import Link from "next/link";
import { PandaIcon } from "@/components/shared/panda-icon";
import { LogoText } from "@/components/shared/logo-text";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-rzpanda-fond">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <PandaIcon size={32} />
            <span className="text-lg font-bold">
              <LogoText />
            </span>
          </Link>
          <Link href="/login" className="text-sm text-rzpanda-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="legal-content rounded-2xl border border-gray-200 bg-white p-6 text-sm text-rzpanda-texte sm:p-8">
          {children}
        </article>
      </main>
    </div>
  );
}
