"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${isScrolled
        ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Retour en haut">
          <svg
            width="32"
            height="32"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Mascotte panda RZPan'Da"
          >
            <title>Mascotte panda RZPan'Da</title>
            <circle cx="50" cy="52" r="46" fill="rgba(37,99,235,0.15)"></circle>
            <circle cx="50" cy="52" r="38" fill="rgba(37,99,235,0.25)"></circle>
            <circle cx="29" cy="33" r="9" fill="#1A202C"></circle>
            <circle cx="71" cy="33" r="9" fill="#1A202C"></circle>
            <ellipse cx="50" cy="55" rx="26" ry="24" fill="#FAFBFC"></ellipse>
            <ellipse
              cx="40"
              cy="51"
              rx="7"
              ry="8"
              fill="#1A202C"
              transform="rotate(-12 40 51)"
            ></ellipse>
            <ellipse
              cx="60"
              cy="51"
              rx="7"
              ry="8"
              fill="#1A202C"
              transform="rotate(12 60 51)"
            ></ellipse>
            <circle cx="41" cy="51" r="2.2" fill="#FAFBFC"></circle>
            <circle cx="59" cy="51" r="2.2" fill="#FAFBFC"></circle>
            <ellipse cx="50" cy="62" rx="3.8" ry="2.6" fill="#B49090"></ellipse>
            <path
              d="M50 65 Q 47 68 44 66 M50 65 Q 53 68 56 66"
              stroke="#1A202C"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            ></path>
            <g transform="translate(50 14) rotate(-18)">
              <path
                d="M0 0 C 8 -4, 16 0, 14 10 C 6 12, -2 8, 0 0 Z"
                fill="#22C55E"
              ></path>
              <line
                x1="2"
                y1="4"
                x2="12"
                y2="-1"
                stroke="#16A34A"
                strokeWidth="0.8"
              ></line>
            </g>
          </svg>
          <span className="font-bold tracking-tight text-xl">
            <span className="text-blue-600">RZ</span>
            <span className="text-gray-900">Pan</span>
            <span className="text-blue-600">'</span>
            <span className="text-gray-900">Da</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          <Link
            href="/#fonctionnalites"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/#tarifs"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Tarifs
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            FAQ
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Guides
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {!loading && user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
              Tableau de bord
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md active:scale-95"
                aria-label="Essai gratuit"
              >
                Essai gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-gray-100 bg-white px-5 py-6 shadow-md md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-4" aria-label="Navigation mobile">
            <Link
              href="/#fonctionnalites"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-800 transition hover:text-blue-600 py-2 border-b border-gray-50"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/#tarifs"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-800 transition hover:text-blue-600 py-2 border-b border-gray-50"
            >
              Tarifs
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-800 transition hover:text-blue-600 py-2 border-b border-gray-50"
            >
              FAQ
            </Link>
            <Link
              href="/guides"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-800 transition hover:text-blue-600 py-2 border-b border-gray-50"
            >
              Guides
            </Link>
            {!loading && user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700 mt-2"
              >
                Tableau de bord
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-gray-800 transition hover:text-blue-600 py-2"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
                >
                  Essai gratuit
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
