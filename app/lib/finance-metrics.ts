import type { FinanceStore } from "../finance/types";

export function hasMeaningfulFinanceContent(store: FinanceStore): boolean {
  const rows =
    store.fixed.length +
    store.subscriptions.length +
    store.housing.length +
    store.insurance.length +
    store.variable.length +
    store.investments.length +
    store.creditCards.length +
    store.goals.length;
  return (
    rows > 0 ||
    store.monthlyIncomeEstimate !== 0 ||
    store.savingsTarget !== 0 ||
    store.savingsCurrent !== 0
  );
}

function sum(section: { amount: number }[]) {
  return section.reduce((s, r) => s + Math.max(0, r.amount), 0);
}

export function deriveFinanceTotals(store: FinanceStore) {
  const fixed = sum(store.fixed);
  const subscriptions = sum(store.subscriptions);
  const housing = sum(store.housing);
  const insurance = sum(store.insurance);
  const variable = sum(store.variable);
  const creditCards = sum(store.creditCards);
  const investments = sum(store.investments);
  const expensesMonth =
    fixed + subscriptions + housing + insurance + variable + creditCards;
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
    housing,
    insurance,
    variable,
    creditCards,
    investments,
    expensesMonth,
    monthlyIncomeEstimate,
    savingsProgressPct,
    balanceEstimate,
  };
}
