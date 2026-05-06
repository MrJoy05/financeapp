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
  /** Renta, hipoteca u otros gastos principales del hogar (mensual). */
  housing: FinanceLine[];
  /** Primas mensuales o anualizadas (auto, médico, vida, etc.). */
  insurance: FinanceLine[];
  variable: FinanceLine[];
  savingsTarget: number;
  savingsCurrent: number;
  /** Ingreso mensual estimado (salud financiera y KPIs). */
  monthlyIncomeEstimate: number;
  goals: SavingsGoal[];
  investments: FinanceLine[];
  /** Pago mínimo, anualidad o cargo recurrente por tarjeta (mensual). */
  creditCards: FinanceLine[];
};

export const emptyFinanceStore: FinanceStore = {
  fixed: [],
  subscriptions: [],
  housing: [],
  insurance: [],
  variable: [],
  savingsTarget: 0,
  savingsCurrent: 0,
  monthlyIncomeEstimate: 0,
  goals: [],
  investments: [],
  creditCards: [],
};
