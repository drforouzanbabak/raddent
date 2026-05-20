"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/language-provider";
import type { ServicePrice } from "@/actions/google_sheet";

type Group = {
  category: string;
  services: ServicePrice[];
};

const normalize = (value: string) => value.toLowerCase().trim();

export function PricesList({
  groups,
  loadError,
}: {
  groups: Group[];
  loadError: boolean;
}) {
  const t = useT();
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = normalize(query);
    if (!q) return groups;

    return groups
      .map((group) => {
        const services = group.services.filter((service) => {
          return (
            normalize(service.name).includes(q) ||
            normalize(service.description ?? "").includes(q) ||
            normalize(group.category).includes(q)
          );
        });
        return { ...group, services };
      })
      .filter((group) => group.services.length > 0);
  }, [groups, query]);

  const totalMatches = filteredGroups.reduce(
    (sum, group) => sum + group.services.length,
    0,
  );

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {t.prices.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.prices.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {t.prices.description}
          </p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {t.prices.disclaimer}
          </p>
        </div>

        {loadError ? (
          <div className="mt-14 rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-sm text-rose-100">
            {t.prices.loadError}
          </div>
        ) : groups.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-sm text-slate-400">
            {t.prices.noServices}
          </div>
        ) : (
          <>
            <div className="mt-10 max-w-xl">
              <label className="space-y-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {t.prices.searchEyebrow}
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t.prices.searchPlaceholder}
                    className="pl-9"
                  />
                </div>
              </label>
              {query ? (
                <p className="mt-2 text-xs text-slate-500">
                  {totalMatches}{" "}
                  {totalMatches === 1
                    ? t.prices.matchSingular
                    : t.prices.matchPlural}{" "}
                  {t.prices.matchesFor} &ldquo;{query}&rdquo;
                </p>
              ) : null}
            </div>

            {filteredGroups.length === 0 ? (
              <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/3 p-8 text-sm text-slate-400">
                {t.prices.noMatches}
              </div>
            ) : (
              <div className="mt-10 space-y-6">
                {filteredGroups.map(({ category, services }) => (
                  <section
                    key={category}
                    className="rounded-[2rem] border border-white/10 bg-white/3 p-6 sm:p-8"
                  >
                    <header className="mb-6 flex items-baseline justify-between gap-4">
                      <h2 className="text-xl font-semibold text-white sm:text-2xl">
                        {category}
                      </h2>
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        {services.length}{" "}
                        {services.length === 1
                          ? t.prices.serviceSingular
                          : t.prices.servicePlural}
                      </span>
                    </header>

                    <ul className="divide-y divide-white/5">
                      {services.map((service) => (
                        <li
                          key={`${service.category}-${service.name}`}
                          className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white sm:text-base">
                              {service.name}
                            </p>
                            {service.description ? (
                              <p className="mt-1 text-sm leading-6 text-slate-400">
                                {service.description}
                              </p>
                            ) : null}
                          </div>
                          <p className="shrink-0 text-sm font-semibold text-white sm:text-base">
                            {service.price || "—"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-16 rounded-[2.5rem] border border-white/10 bg-linear-to-br from-white/6 via-white/2 to-transparent p-10 sm:p-14">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t.prices.ctaTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                {t.prices.ctaSubtitle}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/appointment">
                {t.prices.bookConsultation}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
