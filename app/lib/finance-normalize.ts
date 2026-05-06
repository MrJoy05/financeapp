import {
  emptyFinanceStore,
  type FinanceLine,
  type FinanceStore,
  type SavingsGoal,
} from "../finance/types";

export function normalizeStore(
  raw: unknown,
  initialBase: FinanceStore = emptyFinanceStore,
): FinanceStore {
  if (!raw || typeof raw !== "object") {
    return { ...initialBase };
  }
  const o = raw as Record<string, unknown>;
  type LedgerKey =
    | "fixed"
    | "subscriptions"
    | "housing"
    | "insurance"
    | "variable"
    | "investments"
    | "creditCards";
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
    housing: rows("housing"),
    insurance: rows("insurance"),
    variable: rows("variable"),
    investments: rows("investments"),
    creditCards: rows("creditCards"),
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
