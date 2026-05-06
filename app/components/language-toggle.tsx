"use client";

import { useLanguage } from "../i18n/language-context";

export function LanguageToggle({ compact }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLanguage();

  const outer = compact
    ? "inline-flex rounded-lg border border-zinc-200/90 bg-zinc-100/80 p-0.5 shadow-inner dark:border-zinc-700 dark:bg-zinc-900/80"
    : "inline-flex rounded-full border border-zinc-200/90 bg-zinc-100/80 p-1 shadow-inner dark:border-zinc-700 dark:bg-zinc-900/80";

  const btn = compact
    ? "relative isolate rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide transition-[color] duration-200"
    : "relative isolate rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide transition-[color] duration-200";

  const pill = compact
    ? "animate-toggle-pop absolute inset-0 z-0 rounded-md bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-600/80"
    : "animate-toggle-pop absolute inset-0 z-0 rounded-full bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-600/80";

  return (
    <div className={outer} role="group" aria-label="Language">
      <button
        type="button"
        className={`${btn} ${
          locale === "en"
            ? "text-zinc-950 dark:text-zinc-50"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        }`}
        onClick={() => setLocale("en")}
      >
        {locale === "en" ? <span className={pill} /> : null}
        <span className="relative z-10">{t("langEn")}</span>
      </button>
      <button
        type="button"
        className={`${btn} ${
          locale === "es"
            ? "text-zinc-950 dark:text-zinc-50"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        }`}
        onClick={() => setLocale("es")}
      >
        {locale === "es" ? <span className={pill} /> : null}
        <span className="relative z-10">{t("langEs")}</span>
      </button>
    </div>
  );
}
