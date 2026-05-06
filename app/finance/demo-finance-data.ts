import type { FinanceStore } from "./types";

/** Datos ficticios para visitantes o sesión sin cuenta (solo en este dispositivo). */
export const demoFinanceStore: FinanceStore = {
  fixed: [
    { id: "d1", name: "Utilities / Servicios", amount: 1200 },
    { id: "d2", name: "Internet / teléfono", amount: 599 },
  ],
  housing: [
    { id: "dh1", name: "Rent / Renta", amount: 8500 },
    { id: "dh2", name: "Mantenimiento / HOA", amount: 450 },
  ],
  insurance: [
    { id: "di0", name: "Auto / Seguro auto", amount: 950 },
    { id: "di1", name: "Gastos médicos mayores", amount: 2100 },
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
  creditCards: [
    {
      id: "dcc1",
      name: "Visa — pago mínimo",
      amount: 1200,
      note: "Saldo: busca pagar > mínimo",
    },
    {
      id: "dcc2",
      name: "Cashback — sin anualidad",
      amount: 0,
      note: "Uso principal",
    },
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
