"use client";

import type { TranslationKey } from "../../i18n/translations";
import { useLanguage } from "../../i18n/language-context";

export function FinancePlansStrip() {
  const { t } = useLanguage();

  const plans: {
    titleKey: TranslationKey;
    bodyKey: TranslationKey;
    ring: string;
    bg: string;
  }[] = [
    {
      titleKey: "financePlanStarterTitle",
      bodyKey: "financePlanStarterBody",
      ring: "ring-emerald-300/80 dark:ring-emerald-700/60",
      bg: "from-emerald-500/8 to-teal-500/5",
    },
    {
      titleKey: "financePlanBalancedTitle",
      bodyKey: "financePlanBalancedBody",
      ring: "ring-cyan-300/80 dark:ring-cyan-700/55",
      bg: "from-cyan-500/8 to-sky-500/5",
    },
    {
      titleKey: "financePlanGrowthTitle",
      bodyKey: "financePlanGrowthBody",
      ring: "ring-violet-300/75 dark:ring-violet-700/55",
      bg: "from-violet-500/8 to-indigo-500/5",
    },
  ];

  return (
    <section
      className="rounded-2xl border border-zinc-200/90 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40"
      aria-labelledby="plans-heading"
    >
      <div className="mb-5">
        <h3
          id="plans-heading"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {t("financePlansTitle")}
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          {t("financePlansLead")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.titleKey}
            className={`rounded-xl border border-zinc-200/80 bg-gradient-to-br ${p.bg} p-4 ring-1 ring-inset dark:border-zinc-800 ${p.ring}`}
          >
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t(p.titleKey)}
            </h4>
            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(p.bodyKey)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

type GuideItem = { titleKey: TranslationKey; bodyKey: TranslationKey };

const GUIDES: GuideItem[] = [
  {
    titleKey: "guideCompoundTitle",
    bodyKey: "guideCompoundBody",
  },
  {
    titleKey: "guidePortfoliosTitle",
    bodyKey: "guidePortfoliosBody",
  },
  { titleKey: "guideBanksTitle", bodyKey: "guideBanksBody" },
  { titleKey: "guideCardsTitle", bodyKey: "guideCardsBody" },
  {
    titleKey: "guideRentInsuranceTitle",
    bodyKey: "guideRentInsuranceBody",
  },
];

export function FinanceKnowledgeHub() {
  const { t } = useLanguage();

  return (
    <section
      className="rounded-2xl border border-zinc-200/90 bg-white/60 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50"
      aria-labelledby="guides-heading"
    >
      <div className="mb-4">
        <h3
          id="guides-heading"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {t("guidesHubTitle")}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t("guidesHubLead")}
        </p>
      </div>
      <div className="space-y-2">
        {GUIDES.map((g) => (
          <details
            key={g.titleKey}
            className="group rounded-xl border border-zinc-200/90 bg-zinc-50/80 open:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:open:bg-zinc-950/70"
          >
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-900 outline-offset-2 marker:hidden dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>{t(g.titleKey)}</span>
                <span className="text-xs text-zinc-500 transition group-open:rotate-180">
                  ▼
                </span>
              </span>
            </summary>
            <div className="border-t border-zinc-200/80 px-4 pb-4 pt-2 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              <p className="whitespace-pre-line">{t(g.bodyKey)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
