"use client";

import { useTranslations } from "@/hooks/use-translations";

export const SiteFooter = () => {
  const t = useTranslations();

  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
      <p className="max-w-3xl leading-relaxed">{t.disclaimer}</p>
      <a
        href="https://tiqdev.vercel.app"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 font-display text-sm font-bold tracking-wider text-primary drop-shadow-red"
      >
        🔴 tiqdev
      </a>
    </footer>
  );
};
