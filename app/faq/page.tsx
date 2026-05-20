"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/components/language-provider";

export default function FaqPage() {
  const t = useT();

  return (
    <main>
      <section>
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.faq.eyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.faq.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="mt-14 space-y-3">
            {t.faq.items.map((item, idx) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-white/10 bg-white/3 transition open:bg-white/5"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-6 sm:p-8">
                  <h2 className="text-base font-medium text-white sm:text-lg">
                    {item.q}
                  </h2>
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition group-open:rotate-45">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                  <p className="text-sm leading-7 text-slate-300 sm:text-base">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="rounded-[2.5rem] border border-white/10 bg-linear-to-br from-white/6 via-white/2 to-transparent p-10 sm:p-16">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {t.faq.ctaTitle}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {t.faq.ctaSubtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="outline">
                  <Link
                    href="https://m.me/FogorvosDentist"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.faq.ctaButton}
                  </Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/appointment">
                    {t.faq.bookButton}
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
