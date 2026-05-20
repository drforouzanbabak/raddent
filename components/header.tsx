"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { useT } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useT();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/#services", label: t.nav.services },
    { href: "/prices", label: t.nav.prices },
    { href: "/faq", label: t.nav.faq },
    { href: "/#reviews", label: t.nav.reviews },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="RadDent"
            width={32}
            height={32}
            className="size-8 rounded-md"
            priority
          />
          <span className="text-lg font-semibold tracking-[0.18em] text-white">
            RadDent
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden"
          >
            <span className="relative inline-flex size-4 items-center justify-center">
              <Menu
                className={cn(
                  "absolute size-4 transition-all duration-200",
                  open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100",
                )}
              />
              <X
                className={cn(
                  "absolute size-4 transition-all duration-200",
                  open ? "rotate-0 opacity-100" : "rotate-90 opacity-0",
                )}
              />
            </span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav
          aria-hidden={!open}
          className={cn(
            "min-h-0 overflow-hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 lg:px-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
