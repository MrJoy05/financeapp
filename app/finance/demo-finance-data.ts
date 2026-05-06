import type { FinanceStore } from "./types";

/** Datos ficticios para visitantes o sesión sin cuenta (solo en este dispositivo). */
export const demoFinanceStore: FinanceStore = {
  fixed: [
    { id: "d1", name: "Rent / Renta", amount: 8500 },
    { id: "d2", name: "Utilities / Servicios", amount: 1200 },
    { id: "d3", name: "Car insurance / Seguro auto", amount: 950 },
  ],
  subscriptions: [
    { id: "ds1", name: "Streaming", amount: 199 },
    { id: "ds2", name: "Cloud / IDE", amount: 249 },
  ],
  variable: [
    { id: "dv1", name: "Groceries / Super", amount: 3200 },
    { id: "dv2", name: "Transport", amount: 800 },
    { id: "dv3", name: "Dining / Restaurantes", amount: 1200 },
  ],
  savingsTarget: 120_000,
  savingsCurrent: 38_500,
  monthlyIncomeEstimate: 42_000,
  goals: [
    {
      id: "dg1",
      title: "Initial payment — home / Enganche — casa",
      targetAmount: 350_000,
      currentAmount: 95_000,
      emoji: "🏠",
    },
    {
      id: "dg2",
      title: "Emergency fund / Fondo emergencia",
      targetAmount: 60_000,
      currentAmount: 38_500,
      emoji: "🛟",
    },
  ],
  investments: [
    { id: "di1", name: "Broad index fund", amount: 18_500 },
    { id: "di2", name: "Short-term CETES / efectivo", amount: 9200 },
  ],
};
