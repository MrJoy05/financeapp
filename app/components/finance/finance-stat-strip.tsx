"use client";

import { useMemo } from "react";
import { deriveFinanceTotals } from "../../lib/finance-metrics";
import { useFinanceStore } from "../../finance/use-finance-store";
import { useLanguage } from "../../i18n/language-context";
import { StatCard } from "../stat-card";

export function FinanceStatStrip() {
  const { locale, t } = useLanguage();
  const { store, ready } = useFinanceStore();

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const totals = deriveFinanceTotals(store);

  if (!ready) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={t("balance")}
        value={money.format(totals.balanceEstimate)}
      />
      <StatCard
        label={t("income")}
        value={
          totals.monthlyIncomeEstimate > 0
            ? money.format(totals.monthlyIncomeEstimate)
            : "—"
        }
      />
      <StatCard
        label={t("expenses")}
        value={
          totals.expensesMonth > 0 ? money.format(totals.expensesMonth) : "—"
        }
      />
      <StatCard
        label={t("savingsGoal")}
        value={
          store.savingsTarget > 0
            ? `${totals.savingsProgressPct}%`
            : "—"
        }
        hint={store.savingsTarget > 0 ? t("viewDetails") : undefined}
      />
    </div>
  );
}
