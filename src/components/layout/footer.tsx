import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-3 px-4 text-center text-xs text-gray-500">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link href="/mentions-legales" className="hover:text-rzpanda-primary hover:underline">
          Mentions légales
        </Link>
        <span aria-hidden="true">|</span>
        <Link href="/cgu" className="hover:text-rzpanda-primary hover:underline">
          CGU
        </Link>
        <span aria-hidden="true">|</span>
        <Link href="/confidentialite" className="hover:text-rzpanda-primary hover:underline">
          Confidentialité
        </Link>
      </nav>
    </footer>
  );
}
