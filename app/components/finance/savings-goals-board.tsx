"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import type { SavingsGoal } from "../../finance/types";
import { useFinanceStore } from "../../finance/use-finance-store";
import { useLanguage } from "../../i18n/language-context";

export function SavingsGoalsBoard() {
  const { locale, t } = useLanguage();
  const { store, ready, addGoal, removeGoal, patchGoal } = useFinanceStore();
  const [title, setTitle] = useState("");
  const [targetStr, setTargetStr] = useState("");
  const [currentStr, setCurrentStr] = useState("");

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const onAdd = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const target = Number.parseFloat(targetStr.replace(/,/g, ""));
      const current = Number.parseFloat(currentStr.replace(/,/g, ""));
      if (!title.trim() || !Number.isFinite(target) || target <= 0) return;
      addGoal({
        title: title.trim(),
        targetAmount: target,
        currentAmount: Number.isFinite(current) ? Math.max(0, current) : 0,
        emoji: "🎯",
      });
      setTitle("");
      setTargetStr("");
      setCurrentStr("");
    },
    [addGoal, currentStr, targetStr, title],
  );

  const updateRow = useCallback(
    (g: SavingsGoal, patch: Partial<SavingsGoal>) => {
      patchGoal(g.id, patch);
    },
    [patchGoal],
  );

  if (!ready) return null;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("goalsExtendedTitle")}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("goalsExtendedLead")}
      </p>

      <ul className="mt-8 space-y-5">
        {store.goals.map((g) => {
          const pct =
            g.targetAmount > 0
              ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
              : 0;
          return (
            <li
              key={g.id}
              className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{g.emoji ?? "🎯"}</span>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {g.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {money.format(g.currentAmount)} / {money.format(g.targetAmount)} · {pct}%
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeGoal(g.id)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  ×
                </button>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-xs text-zinc-500">
                  {t("goalTarget")}
                  <input
                    type="text"
                    inputMode="decimal"
                    defaultValue={String(g.targetAmount)}
                    key={`${g.id}-t-${g.targetAmount}`}
                    onBlur={(e) => {
                      const n = Number.parseFloat(e.target.value.replace(/,/g, ""));
                      if (Number.isFinite(n) && n > 0)
                        updateRow(g, { targetAmount: n });
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </label>
                <label className="text-xs text-zinc-500">
                  {t("goalCurrent")}
                  <input
                    type="text"
                    inputMode="decimal"
                    defaultValue={String(g.currentAmount)}
                    key={`${g.id}-c-${g.currentAmount}`}
                    onBlur={(e) => {
                      const n = Number.parseFloat(e.target.value.replace(/,/g, ""));
                      if (Number.isFinite(n) && n >= 0)
                        updateRow(g, { currentAmount: n });
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={onAdd}
        className="mt-8 grid gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/40 sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("goalAddPlaceholder")}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          value={targetStr}
          onChange={(e) => setTargetStr(e.target.value)}
          placeholder={t("goalTarget")}
          inputMode="decimal"
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          value={currentStr}
          onChange={(e) => setCurrentStr(e.target.value)}
          placeholder={t("goalCurrent")}
          inputMode="decimal"
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-2 lg:col-span-4 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {t("goalAdd")}
        </button>
      </form>
    </section>
  );
}
