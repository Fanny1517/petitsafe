"use client";

import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white pb-24 pt-16 md:pb-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Column 1: Produit */}
          <nav aria-label="Produit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Produit
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/#fonctionnalites"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="/#tarifs"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Feuille de route
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 2: Ressources */}
          <nav aria-label="Ressources">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Ressources
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/controle-ddpp-creche-preparation"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guide DDPP
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/decret-2025-304-micro-creche"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Guide décret 2025-304
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3: Entreprise */}
          <nav aria-label="Entreprise">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Entreprise
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/a-propos"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-500 transition hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Restons en contact
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:contact@rzpanda.fr"
                aria-label="Nous écrire"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/company/rzpanda"
                aria-label="LinkedIn RZPan'Da"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            </div>

            <form className="mt-5 flex flex-col gap-2" action="/api/newsletter" method="post">
              <label htmlFor="newsletter-email" className="text-xs text-gray-400">
                Guide DDPP 2026 — recevez-le par email
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="vous@creche.fr"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none"
                  name="email"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Logo and copyright footer bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 100 100"
              role="img"
              aria-label="Mascotte panda RZPan'Da"
            >
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
            <span className="font-bold tracking-tight text-lg">
              <span className="text-blue-600">RZ</span>
              <span className="text-gray-900">Pan</span>
              <span className="text-blue-600">'</span>
              <span className="text-gray-900">Da</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 RZPan'Da · Conçu en France 🇫🇷 · rzpanda.fr
          </p>
        </div>
      </div>
    </footer>
  );
}
