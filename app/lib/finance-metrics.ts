import type { FinanceStore } from "../finance/types";

function sum(section: { amount: number }[]) {
  return section.reduce((s, r) => s + Math.max(0, r.amount), 0);
}

export function deriveFinanceTotals(store: FinanceStore) {
  const fixed = sum(store.fixed);
  const subscriptions = sum(store.subscriptions);
  const variable = sum(store.variable);
  const investments = sum(store.investments);
  const expensesMonth = fixed + subscriptions + variable;
  const monthlyIncomeEstimate = Math.max(0, store.monthlyIncomeEstimate);
  const savingsProgressPct =
    store.savingsTarget > 0
      ? Math.round(
          Math.min(
            100,
            (store.savingsCurrent / store.savingsTarget) * 100,
          ),
        )
      : 0;
  const balanceEstimate =
    store.savingsCurrent + investments > 0
      ? store.savingsCurrent + investments
      : 0;

  return {
    fixed,
    subscriptions,
    variable,
    investments,
    expensesMonth,
    monthlyIncomeEstimate,
    savingsProgressPct,
    balanceEstimate,
  };
}
