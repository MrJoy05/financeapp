"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { demoFinanceStore } from "./demo-finance-data";
import {
  emptyFinanceStore,
  type FinanceLine,
  type FinanceStore,
  type SavingsGoal,
} from "./types";
import { useFinanceUserKey } from "./finance-user-context";
import { useFinanceDemoMode } from "./finance-runtime-context";

function normalizeStore(
  raw: unknown,
  initialBase: FinanceStore,
): FinanceStore {
  if (!raw || typeof raw !== "object") {
    return { ...initialBase };
  }
  const o = raw as Record<string, unknown>;
  type LedgerKey = "fixed" | "subscriptions" | "variable" | "investments";
  const rows = (k: LedgerKey): FinanceLine[] => {
    const v = o[k];
    return Array.isArray(v) ? (v as FinanceLine[]) : initialBase[k];
  };
  const goals: SavingsGoal[] = Array.isArray(o.goals)
    ? (o.goals as SavingsGoal[])
    : initialBase.goals;
  const mi = o.monthlyIncomeEstimate;
  return {
    ...initialBase,
    fixed: rows("fixed"),
    subscriptions: rows("subscriptions"),
    variable: rows("variable"),
    investments: rows("investments"),
    savingsTarget:
      typeof o.savingsTarget === "number" ? o.savingsTarget : initialBase.savingsTarget,
    savingsCurrent:
      typeof o.savingsCurrent === "number"
        ? o.savingsCurrent
        : initialBase.savingsCurrent,
    monthlyIncomeEstimate:
      typeof mi === "number" ? mi : initialBase.monthlyIncomeEstimate,
    goals,
  };
}

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useFinanceStore() {
  const userKey = useFinanceUserKey();
  const isDemo = useFinanceDemoMode();

  const storageKey = useMemo(
    () => `nimbus.finance.v2.${userKey}`,
    [userKey],
  );

  const legacyStorageKey = useMemo(
    () => `nimbus.finance.v1.${userKey}`,
    [userKey],
  );

  const initialSeed = useMemo(
    () => (isDemo ? demoFinanceStore : emptyFinanceStore),
    [isDemo],
  );

  const [store, setStore] = useState<FinanceStore>(initialSeed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw =
          window.localStorage.getItem(storageKey) ??
          window.localStorage.getItem(legacyStorageKey);
        if (!raw) {
          setStore(initialSeed);
        } else {
          const parsed = JSON.parse(raw) as unknown;
          const next = normalizeStore(parsed, initialSeed);
          setStore(next);
          if (!window.localStorage.getItem(storageKey)) {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
          }
        }
      } catch {
        setStore(initialSeed);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageKey, legacyStorageKey, initialSeed]);

  const persist = useCallback(
    (next: FinanceStore) => {
      setStore(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const addLine = useCallback(
    (section: keyof Pick<FinanceStore, "fixed" | "subscriptions" | "variable" | "investments">) =>
      (name: string, amount: number) => {
        const line: FinanceLine = { id: newId(), name, amount };
        persist({
          ...store,
          [section]: [...store[section], line],
        });
      },
    [persist, store],
  );

  const removeLine = useCallback(
    (section: keyof Pick<FinanceStore, "fixed" | "subscriptions" | "variable" | "investments">) =>
      (idRow: string) => {
        persist({
          ...store,
          [section]: store[section].filter((r) => r.id !== idRow),
        });
      },
    [persist, store],
  );

  const setSavings = useCallback(
    (patch: Partial<Pick<FinanceStore, "savingsTarget" | "savingsCurrent">>) => {
      persist({ ...store, ...patch });
    },
    [persist, store],
  );

  const setMonthlyIncome = useCallback(
    (monthlyIncomeEstimate: number) => {
      persist({ ...store, monthlyIncomeEstimate });
    },
    [persist, store],
  );

  const addGoal = useCallback(
    (g: Omit<SavingsGoal, "id"> & { id?: string }) => {
      const goal: SavingsGoal = {
        id: g.id ?? newId(),
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        emoji: g.emoji,
      };
      persist({ ...store, goals: [...store.goals, goal] });
    },
    [persist, store],
  );

  const removeGoal = useCallback(
    (idRow: string) => {
      persist({ ...store, goals: store.goals.filter((g) => g.id !== idRow) });
    },
    [persist, store],
  );

  const patchGoal = useCallback(
    (idRow: string, patch: Partial<SavingsGoal>) => {
      persist({
        ...store,
        goals: store.goals.map((g) =>
          g.id === idRow ? { ...g, ...patch } : g,
        ),
      });
    },
    [persist, store],
  );

  return {
    store,
    ready,
    isDemo,
    addLine,
    removeLine,
    setSavings,
    setMonthlyIncome,
    addGoal,
    removeGoal,
    patchGoal,
  };
}
