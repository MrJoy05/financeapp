"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import type { FinanceLine, FinanceStore } from "../../finance/types";
import { useLanguage } from "../../i18n/language-context";

type SectionKey =
  | "fixed"
  | "subscriptions"
  | "variable"
  | "investments";

export function LedgerSection({
  section,
  title,
  description,
  rows,
  onAdd,
  onRemove,
}: {
  section: SectionKey;
  title: string;
  description: string;
  rows: FinanceLine[];
  onAdd: (name: string, amount: number) => void;
  onRemove: (id: string) => void;
}) {
  const { locale, t } = useLanguage();

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const total = useMemo(
    () => rows.reduce((s, r) => s + Math.max(0, r.amount), 0),
    [rows],
  );

  const [name, setName] = useState("");
  const [amountStr, setAmountStr] = useState("");

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const amt = Number.parseFloat(amountStr.replace(/,/g, ""));
      if (!name.trim() || !Number.isFinite(amt)) return;
      onAdd(name.trim(), Math.round(amt * 100) / 100);
      setName("");
      setAmountStr("");
    },
    [amountStr, name, onAdd],
  );

  const sectionAccent =
    section === "subscriptions"
      ? "from-violet-500/10 to-fuchsia-500/5 ring-violet-200/70 dark:ring-violet-800/60"
      : section === "variable"
        ? "from-amber-500/10 to-orange-500/5 ring-amber-200/70 dark:ring-amber-800/50"
        : section === "investments"
          ? "from-sky-500/10 to-cyan-500/5 ring-sky-200/70 dark:ring-sky-800/55"
          : "from-teal-500/10 to-emerald-500/5 ring-teal-200/70 dark:ring-teal-800/55";

  return (
    <section className={`rounded-2xl border border-zinc-200/90 bg-gradient-to-br p-6 shadow-sm ring-1 ring-inset dark:border-zinc-800 ${sectionAccent}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold tabular-nums text-zinc-800 ring-1 ring-zinc-200/80 backdrop-blur dark:bg-zinc-900/70 dark:text-zinc-100 dark:ring-zinc-700">
          {money.format(total)}
        </span>
      </div>

      <ul className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0"
          >
            <span className="flex-1 font-medium text-zinc-800 dark:text-zinc-200">
              {row.name}
            </span>
            <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
              {money.format(row.amount)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(row.id)}
              className="rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              aria-label={t("ledgerRemoveAria")}
            >
              ×
            </button>
          </li>
        ))}
        {!rows.length ? (
          <li className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
            —
          </li>
        ) : null}
      </ul>

      <LedgerQuickAddForm
        name={name}
        amountStr={amountStr}
        title={title}
        onSubmit={onSubmit}
        setName={setName}
        setAmountStr={setAmountStr}
        namePh={t("ledgerNamePh")}
        amountPh={t("ledgerAmountPh")}
        addLabel={t("ledgerAdd")}
      />
    </section>
  );
}

export function SavingsPlanSection({
  store,
  onApply,
}: {
  store: Pick<FinanceStore, "savingsTarget" | "savingsCurrent">;
  onApply: (patch: Partial<Pick<FinanceStore, "savingsTarget" | "savingsCurrent">>) => void;
}) {
  const { t } = useLanguage();

  const [targetStr, setTargetStr] = useState(String(store.savingsTarget));
  const [currentStr, setCurrentStr] = useState(String(store.savingsCurrent));

  const pct =
    store.savingsTarget > 0
      ? Math.min(
          100,
          Math.round((store.savingsCurrent / store.savingsTarget) * 100),
        )
      : 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("sectionSavingsTitle")}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {t("sectionSavingsDesc")}
      </p>

      <div className="mt-6 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs font-semibold tabular-nums text-zinc-600 dark:text-zinc-400">
        {pct}%
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {t("savingsGoalAmount")}
          <input
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {t("savingsCurrentAmount")}
          <input
            value={currentStr}
            onChange={(e) => setCurrentStr(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>
      <button
        type="button"
        className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        onClick={() => {
          const target = Number.parseFloat(targetStr.replace(/,/g, ""));
          const current = Number.parseFloat(currentStr.replace(/,/g, ""));
          if (!Number.isFinite(target) || !Number.isFinite(current)) return;
          onApply({ savingsTarget: target, savingsCurrent: current });
        }}
      >
        {t("savingsApply")}
      </button>
    </section>
  );
}

function LedgerQuickAddForm({
  name,
  amountStr,
  title,
  onSubmit,
  setName,
  setAmountStr,
  namePh,
  amountPh,
  addLabel,
}: {
  name: string;
  amountStr: string;
  title: string;
  onSubmit: (e: FormEvent) => void;
  setName: (v: string) => void;
  setAmountStr: (v: string) => void;
  namePh: string;
  amountPh: string;
  addLabel: string;
}) {
  return (
    <form
      className="mt-4 grid gap-2 rounded-xl border border-dashed border-zinc-300/90 bg-white/60 p-3 dark:border-zinc-700 dark:bg-zinc-950/40 sm:grid-cols-[1fr,minmax(0,7rem)_auto]"
      onSubmit={onSubmit}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={namePh}
        className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        aria-label={title}
      />
      <input
        value={amountStr}
        onChange={(e) => setAmountStr(e.target.value)}
        placeholder={amountPh}
        inputMode="decimal"
        className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm tabular-nums dark:border-zinc-700 dark:bg-zinc-900"
        aria-label={amountPh}
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        aria-label={addLabel}
      >
        +
      </button>
    </form>
  );
}
