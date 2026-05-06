"use client";

import { useLanguage } from "../i18n/language-context";

export function PatreonCallout() {
  const { t } = useLanguage();
  const href = process.env.NEXT_PUBLIC_PATREON_URL?.trim();

  if (!href) {
    return (
      <section
        id="patreon"
        className="rounded-3xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60"
      >
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("patreonTitle")}
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {t("patreonNoUrl")}
        </p>
      </section>
    );
  }

  return (
    <section
      id="patreon"
      className="relative overflow-hidden rounded-3xl border border-orange-200/90 bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)] dark:border-orange-900/60 dark:from-orange-950/60 dark:via-zinc-950 dark:to-pink-950/40"
    >
      <div className="relative max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 dark:text-orange-300">
          {t("patreonKicker")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("patreonTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t("patreonBody")}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-500"
        >
          {t("patreonCta")}
          <svg
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 18l6-6-6-6"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
