export type FinanceLine = {
  id: string;
  name: string;
  amount: number;
  note?: string;
};

export type SavingsGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji?: string;
};

export type FinanceStore = {
  fixed: FinanceLine[];
  subscriptions: FinanceLine[];
  variable: FinanceLine[];
  savingsTarget: number;
  savingsCurrent: number;
  /** Ingreso mensual estimado (salud financiera y KPIs). */
  monthlyIncomeEstimate: number;
  goals: SavingsGoal[];
  investments: FinanceLine[];
};

export const emptyFinanceStore: FinanceStore = {
  fixed: [],
  subscriptions: [],
  variable: [],
  savingsTarget: 0,
  savingsCurrent: 0,
  monthlyIncomeEstimate: 0,
  goals: [],
  investments: [],
};
