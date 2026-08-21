"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Smile,
  ShieldCheck,
  Gem,
  Stethoscope,
  HeartPulse,
  Crown,
  ArrowRight,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.54-.04 1 .27 2.06.42 3.14.42 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.41-2.94 4.66a1.5 1.5 0 0 1-2.16.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.16-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
    </svg>
  );
}

const SERVICE_ICONS = [
  Crown,
  Smile,
  Sparkles,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
];
const REASON_ICONS = [Gem, Stethoscope, Sparkles];

const GALLERY = [
  { src: "/office/06.jpg", alt: "" },
  { src: "/office/07.jpg", alt: "" },
  { src: "/office/03.jpg", alt: "" },
  { src: "/office/04.jpg", alt: "" },
  { src: "/office/05.jpg", alt: "" },
  // { src: "/office/07.jpg", alt: "" },
];

type Review = { name: string; text: string };

const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Eszter K.",
    text: "I had been putting off a check-up for years. The team at RadDent made me feel completely at ease — and the result looks beautiful.",
  },
  {
    name: "András P.",
    text: "Implant treatment from start to finish in one place. Calm staff, very modern equipment, transparent pricing.",
  },
  {
    name: "Réka B.",
    text: "The cleanest, calmest dental practice I have ever been to. They explain everything before they do anything.",
  },
  {
    name: "Dávid M.",
    text: "Booked online, reminder by SMS, and the whitening result was even better than I expected. Highly recommend.",
  },
];

export default function Home() {
  const t = useT();
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) return;
        const data = (await response.json()) as {
          reviews?: Array<{ reviewerName: string; text: string }>;
        };
        if (ignore) return;
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(
            data.reviews.slice(0, 4).map((r) => ({
              name: r.reviewerName,
              text: r.text,
            })),
          );
        }
      } catch {
        // keep fallback reviews
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Sparkles className="size-3.5" />
              {t.home.heroEyebrow}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/appointment">
                  {t.home.bookAppointment}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link
                  href="https://m.me/FogorvosDentist"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessengerIcon className="mr-1 size-4" />
                  {t.home.messageUs}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="#services">{t.home.exploreTreatments}</Link>
              </Button>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {t.home.statsYears}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-white">+10</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {t.home.statsPatients}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-white">12k</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {t.home.statsLanguages}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-white">
                  HU · EN · FA
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative block order-1 lg:order-2">
            <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[2.5rem] border border-white/5 bg-white/3" />
            <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={t.home.portraitRole}
              >
                <source src="/intro.mp4" type="video/mp4" />
                {/* Fallback image when video is not supported */}
                <Image
                  src="/my-photo.jpg"
                  alt="Lead dentist at RadDent Budapest Clinic"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </video>

              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute inset-x-8 top-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 backdrop-blur">
                  {t.home.portraitRole}
                </span>
              </div>

              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur">
                <p className="mt-1 text-lg font-semibold text-white">
                  {t.home.portraitName}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {t.home.portraitSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.home.servicesEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.home.servicesTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {t.home.servicesSubtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.services.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx] ?? Sparkles;
              return (
                <div
                  key={service.title}
                  className="group rounded-3xl border border-white/10 bg-white/3 p-6 transition hover:border-white/20 hover:bg-white/5"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Icon className="size-5 text-white" />
                  </span>
                  <h3 className="mt-6 text-lg font-medium text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="studio" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.home.studioEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.home.studioTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {t.home.studioSubtitle}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
            <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/3 lg:aspect-auto">
              <Image
                src={GALLERY[0].src}
                alt={GALLERY[0].alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {GALLERY.slice(1).map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/3"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="border-t border-white/5">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t.home.whyEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t.home.whyTitle}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              {t.home.whySubtitle}
            </p>
          </div>

          <ul className="space-y-4">
            {t.home.reasons.map((reason, idx) => {
              const Icon = REASON_ICONS[idx] ?? Sparkles;
              return (
                <li
                  key={reason.title}
                  className="flex gap-5 rounded-3xl border border-white/10 bg-white/3 p-6"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Icon className="size-5 text-white" />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {reason.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {t.home.reviewsEyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t.home.reviewsTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                {t.home.reviewsSubtitle}{" "}
                <span className="text-white">@FogorvosDentist</span>.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link
                href="https://www.facebook.com/FogorvosDentist/reviews"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="mr-1 size-4" />
                {t.home.seeAllReviews}
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <HoverCard key={review.name} openDelay={120} closeDelay={80}>
                <HoverCardTrigger asChild>
                  <figure
                    tabIndex={0}
                    className="flex h-full cursor-pointer flex-col gap-5 rounded-3xl border border-white/10 bg-white/3 p-6 transition hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:border-white/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-white">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-white" />
                        ))}
                      </div>
                      <FacebookIcon className="size-4 text-slate-500" />
                    </div>
                    <blockquote className="line-clamp-5 text-sm leading-6 text-slate-200">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
                      <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white">
                        {review.name[0]}
                      </span>
                      <div className="text-sm">
                        <p className="font-medium text-white">{review.name}</p>
                        <p className="text-xs text-slate-500">
                          {t.home.reviewsViaFacebook}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </HoverCardTrigger>
                <HoverCardContent className="max-h-96 w-80 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground">
                        {review.name[0]}
                      </span>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.home.reviewsViaFacebook}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-foreground">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
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
                  {t.home.ctaTitle}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {t.home.ctaSubtitle}
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/appointment">
                  {t.home.bookAppointment}
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
