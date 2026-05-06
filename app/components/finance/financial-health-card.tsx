"use client";

import { useMemo } from "react";
import {
  computeFinancialHealth,
  type FinancialHealthLevel,
} from "../../lib/finance-health";
import { useFinanceStore } from "../../finance/use-finance-store";
import type { TranslationKey } from "../../i18n/translations";
import { useLanguage } from "../../i18n/language-context";

function levelLabel(
  t: (k: TranslationKey) => string,
  level: FinancialHealthLevel,
) {
  switch (level) {
    case "excellent":
      return t("healthExcellent");
    case "good":
      return t("healthGood");
    case "fair":
      return t("healthFair");
    case "risk":
      return t("healthRisk");
    default:
      return t("healthUnknown");
  }
}

export function FinancialHealthCard() {
  const { locale, t } = useLanguage();
  const { store, ready } = useFinanceStore();

  const report = useMemo(() => computeFinancialHealth(store), [store]);

  const pct = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "percent",
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  if (!ready) return null;

  const bullets = report.labels.slice(0, 3).map((b) =>
    locale === "es" ? b.es : b.en,
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-xl shadow-emerald-500/15 dark:border-emerald-900/50 dark:from-emerald-950/50 dark:via-zinc-950 dark:to-sky-950/30">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            {t("healthTitle")}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-white">
              {report.level === "unknown" ? "—" : report.score}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-zinc-900/80 dark:text-emerald-200 dark:ring-emerald-800">
              {levelLabel(t, report.level)}
            </span>
          </div>
          <p className="max-w-prose text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("healthScore")} · 0–100
          </p>
        </div>
        <div className="grid gap-2 text-right text-xs text-zinc-600 dark:text-zinc-400">
          {report.expenseToIncome != null ? (
            <p>
              {t("healthExpenseRatio")}:{" "}
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {pct.format(report.expenseToIncome)}
              </span>
            </p>
          ) : null}
          {report.savingsRate != null ? (
            <p>
              {t("healthSavingsRate")}:{" "}
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {pct.format(Math.max(0, report.savingsRate))}
              </span>
            </p>
          ) : null}
          {report.monthsCovered != null ? (
            <p>
              {t("healthMonthsCovered")}:{" "}
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {report.monthsCovered.toFixed(1)}
              </span>
            </p>
          ) : null}
        </div>
      </div>
      {bullets.length ? (
        <ul className="mt-6 space-y-2 border-t border-emerald-200/60 pt-6 text-sm text-zinc-700 dark:border-emerald-900/50 dark:text-zinc-300">
          {bullets.map((line) => (
            <li key={line.slice(0, 40)} className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
