"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFinanceStore } from "../../finance/use-finance-store";
import { useLanguage } from "../../i18n/language-context";

export function MonthlyIncomeCard() {
  const { locale, t } = useLanguage();
  const { store, ready, setMonthlyIncome } = useFinanceStore();
  const [val, setVal] = useState("");

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const n = Number.parseFloat(val.replace(/,/g, ""));
      if (!Number.isFinite(n) || n < 0) return;
      setMonthlyIncome(Math.round(n * 100) / 100);
    },
    [setMonthlyIncome, val],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVal(
        store.monthlyIncomeEstimate > 0
          ? String(store.monthlyIncomeEstimate)
          : "",
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, [store.monthlyIncomeEstimate]);

  if (!ready) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {t("monthlyIncomeTitle")}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {t("monthlyIncomeDesc")}
      </p>
      <p className="mt-3 text-xs text-zinc-500">
        {t("healthExpenseRatio")}:{" "}
        <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
          {store.monthlyIncomeEstimate > 0
            ? money.format(store.monthlyIncomeEstimate)
            : "—"}
        </span>
      </p>
      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={onSubmit}
      >
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          className="min-w-[8rem] flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-zinc-700 dark:bg-zinc-900"
          aria-label={t("monthlyIncomeTitle")}
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          {t("monthlyIncomeSave")}
        </button>
      </form>
    </section>
  );
}
