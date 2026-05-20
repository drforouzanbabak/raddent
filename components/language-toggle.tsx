"use client";

import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      aria-label={`Current language ${lang.toUpperCase()}, click to switch`}
      className="min-w-22 justify-center"
    >
      <Globe className="mr-1 size-4" />
      {lang === "en" ? "HU" : "EN"}
    </Button>
  );
}
