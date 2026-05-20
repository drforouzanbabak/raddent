"use client";

import { useT } from "@/components/language-provider";

export default function PrivacyPage() {
  const t = useT();

  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {t.privacy.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.privacy.title}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
            {t.privacy.lastUpdated}
          </p>
          <p className="mt-6 text-base leading-7 text-slate-300">
            {t.privacy.intro}
          </p>
        </div>

        <div className="mt-14 space-y-10">
          {t.privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
