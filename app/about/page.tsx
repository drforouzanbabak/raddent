"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  GraduationCap,
  Globe,
  Quote,
  Sparkles,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/components/language-provider";

const VALUE_ICONS = [HeartPulse, ShieldCheck, GraduationCap, Globe];

export default function AboutPage() {
  const t = useT();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              {t.about.eyebrow}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.about.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.about.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/appointment">
                  {t.about.bookConsultation}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/prices">{t.about.seePricing}</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src="/my-photo.jpg"
                  alt="Dr Babak Forouzan, Lead Dentist at RadDent"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/3 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {t.about.cardRole}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {t.about.cardName}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-slate-300">
                    {t.about.cardBadge}
                  </span>
                </div>

                <ul className="mt-5 space-y-3 border-t border-white/5 pt-5 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <GraduationCap className="size-4 text-slate-400" />
                    <span>{t.about.cardEducation}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Sparkles className="size-4 text-slate-400" />
                    <span>{t.about.cardSpecialty}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="size-4 text-slate-400" />
                    <span>{t.about.cardLanguages}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 text-slate-400" />
                    <span>{t.about.cardLocation}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My story */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.about.storyEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.about.storyTitle}
            </h2>
          </div>

          <div className="mt-10 space-y-6 text-base leading-8 text-slate-300 sm:text-lg">
            <p>{t.about.storyP1}</p>
            <p>{t.about.storyP2}</p>
            <p>{t.about.storyP3}</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="rounded-[2.5rem] border border-white/10 bg-linear-to-br from-white/6 via-white/2 to-transparent p-10 sm:p-14">
            <Quote className="size-8 text-white/70" />
            <blockquote className="mt-6 text-2xl font-medium leading-relaxed text-white sm:text-3xl">
              &ldquo;{t.about.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-slate-300">
              <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white">
                B
              </span>
              <div>
                <p className="font-medium text-white">
                  {t.about.attributionName}
                </p>
                <p className="text-xs text-slate-500">
                  {t.about.attributionRole}
                </p>
              </div>
            </figcaption>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.about.valuesEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.about.valuesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {t.about.valuesSubtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {t.about.values.map((value, idx) => {
              const Icon = VALUE_ICONS[idx] ?? Sparkles;
              return (
                <div
                  key={value.title}
                  className="rounded-3xl border border-white/10 bg-white/3 p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Icon className="size-5 text-white" />
                  </span>
                  <h3 className="mt-6 text-lg font-medium text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="rounded-[2.5rem] border border-white/10 bg-linear-to-br from-white/6 via-white/2 to-transparent p-10 sm:p-16">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {t.about.meetCtaTitle}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {t.about.meetCtaSubtitle}
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/appointment">
                  {t.about.bookConsultation}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
