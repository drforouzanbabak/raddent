"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { useT } from "@/components/language-provider";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608C4.519 2.567 5.786 2.293 7.152 2.231 8.418 2.173 8.798 2.163 12 2.163zm0 1.838c-3.142 0-3.515.011-4.755.068-1.04.047-1.612.218-1.99.362-.5.194-.857.426-1.232.801-.375.375-.607.732-.801 1.232-.144.378-.315.95-.362 1.99-.057 1.24-.068 1.613-.068 4.755s.011 3.515.068 4.755c.047 1.04.218 1.612.362 1.99.194.5.426.857.801 1.232.375.375.732.607 1.232.801.378.144.95.315 1.99.362 1.24.057 1.613.068 4.755.068s3.515-.011 4.755-.068c1.04-.047 1.612-.218 1.99-.362.5-.194.857-.426 1.232-.801.375-.375.607-.732.801-1.232.144-.378.315-.95.362-1.99.057-1.24.068-1.613.068-4.755s-.011-3.515-.068-4.755c-.047-1.04-.218-1.612-.362-1.99-.194-.5-.426-.857-.801-1.232-.375-.375-.732-.607-1.232-.801-.378-.144-.95-.315-1.99-.362-1.24-.057-1.613-.068-4.755-.068zm0 3.131a4.868 4.868 0 1 1 0 9.736 4.868 4.868 0 0 1 0-9.736zm0 8.027a3.159 3.159 0 1 0 0-6.318 3.159 3.159 0 0 0 0 6.318zm6.183-8.215a1.137 1.137 0 1 1-2.274 0 1.137 1.137 0 0 1 2.274 0z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/FogorvosDentist",
    Icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/drforouzanbabak",
    Icon: InstagramIcon,
  },
];

export function Footer({ categories }: { categories: string[] }) {
  const t = useT();

  return (
    <footer
      id="contact"
      className="border-t border-white/5 bg-slate-950/80 text-slate-300"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/icon.png"
                alt="RadDent"
                width={32}
                height={32}
                className="size-8 rounded-md"
              />
              <span className="text-lg font-semibold tracking-[0.18em] text-white">
                RadDent
              </span>
            </Link>
            <p className="text-sm leading-7 text-slate-400">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t.footer.services}
            </p>
            {categories.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href="/prices"
                      className="transition hover:text-white"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                href="/prices"
                className="inline-block text-sm transition hover:text-white"
              >
                {t.footer.viewPriceList}
              </Link>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t.footer.contact}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>1214 Budapest, Kossuth Lajos utca 142.</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{t.footer.hours}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-slate-400" />
                <a
                  href="tel:+36707460776"
                  className="transition hover:text-white"
                >
                  +36 70 746 0776
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-slate-400" />
                <a
                  href="mailto:drforouzanbabak@gmail.com"
                  className="transition hover:text-white"
                >
                  drforouzanbabak@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
