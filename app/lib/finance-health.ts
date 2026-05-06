import type { FinanceStore } from "../finance/types";

export type FinancialHealthLevel =
  | "excellent"
  | "good"
  | "fair"
  | "risk"
  | "unknown";

export type FinancialHealthReport = {
  score: number;
  level: FinancialHealthLevel;
  labels: { en: string; es: string }[];
  expenseToIncome: number | null;
  savingsRate: number | null;
  monthsCovered: number | null;
};

function sumLines(store: FinanceStore) {
  const sum = (lines: { amount: number }[]) =>
    lines.reduce((s, r) => s + Math.max(0, r.amount), 0);
  return {
    fixed: sum(store.fixed),
    subs: sum(store.subscriptions),
    housing: sum(store.housing),
    insurance: sum(store.insurance),
    variable: sum(store.variable),
    cards: sum(store.creditCards),
    invest: sum(store.investments),
  };
}

/** Puntuación 0–100 + señales para UI (bilingües en el reporte). */
export function computeFinancialHealth(store: FinanceStore): FinancialHealthReport {
  const income = store.monthlyIncomeEstimate;
  const { fixed, subs, housing, insurance, variable, cards, invest } =
    sumLines(store);

  const monthlyOut =
    fixed + subs + housing + insurance + variable + cards;

  if (!(income > 0)) {
    return {
      score: 0,
      level: "unknown",
      labels: [
        {
          en: "Set your estimated monthly income to unlock the health score.",
          es: "Define tu ingreso mensual estimado para ver la puntuación.",
        },
      ],
      expenseToIncome: null,
      savingsRate: null,
      monthsCovered: null,
    };
  }

  const expenseToIncome = monthlyOut / income;
  const discretionaryBuffer = Math.max(0, income - monthlyOut);
  const savingsRate = discretionaryBuffer / income;

  const monthsCovered =
    monthlyOut > 0 ? store.savingsCurrent / monthlyOut : null;

  let score = 55;
  const labels: { en: string; es: string }[] = [];

  if (expenseToIncome <= 0.5) {
    score += 20;
    labels.push({
      en: "Committed expenses are under half of income — solid headroom.",
      es: "Los gastos comprometidos están bajo la mitad del ingreso — buen margen.",
    });
  } else if (expenseToIncome <= 0.7) {
    score += 12;
    labels.push({
      en: "Expense load is reasonable; keep trimming subscriptions where unused.",
      es: "La carga de gastos es razonable; revisa suscripciones que no uses.",
    });
  } else if (expenseToIncome <= 0.85) {
    score += 4;
    labels.push({
      en: "Expenses are tight versus income; prioritize your largest fixed items.",
      es: "Los gastos están apretados vs ingreso; prioriza tus gastos fijos grandes.",
    });
  } else {
    score -= 18;
    labels.push({
      en: "Expenses exceed ~85% of income — high stress risk if income dips.",
      es: "Los gastos superan ~85% del ingreso — alto riesgo si bajan ingresos.",
    });
  }

  if (savingsRate >= 0.2) {
    score += 15;
    labels.push({
      en: "You are saving a healthy slice after recurring bills.",
      es: "Estás ahorrando un buen porcentaje después de lo recurrente.",
    });
  } else if (savingsRate >= 0.1) {
    score += 8;
  } else if (savingsRate <= 0.03) {
    score -= 12;
    labels.push({
      en: "Little margin left after bills — try one category to cut this month.",
      es: "Queda poco margen después de pagos — reduce una categoría este mes.",
    });
  }

  if (monthsCovered != null) {
    if (monthsCovered >= 6) {
      score += 12;
      labels.push({
        en: "Liquidity covers several months of expenses — strong cushion.",
        es: "Tu liquidez cubre varios meses de gastos — buen colchón.",
      });
    } else if (monthsCovered >= 3) {
      score += 6;
    } else if (monthsCovered < 1 && monthlyOut > 0) {
      score -= 14;
      labels.push({
        en: "Emergency buffer is below one month — build cash before investing more.",
        es: "El colchón es menor a un mes — refuerza efectivo antes de invertir más.",
      });
    }
  }

  if (invest > 0 && savingsRate > 0.05) {
    score += 4;
    labels.push({
      en: "You combine investments with positive cash flow — keep dollar-cost discipline.",
      es: "Combinas inversiones con flujo positivo — mantén disciplina y horizonte.",
    });
  }

  if (store.goals.length > 0) {
    const progressing = store.goals.filter(
      (g) =>
        g.targetAmount > 0 && g.currentAmount / g.targetAmount >= 0.15,
    ).length;
    if (progressing > 0) {
      score += 3;
      labels.push({
        en: "Named goals give direction — automate transfers toward them.",
        es: "Las metas nombradas ordenan prioridades — automatiza transferencias.",
      });
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let level: FinancialHealthLevel;
  if (score >= 82) level = "excellent";
  else if (score >= 68) level = "good";
  else if (score >= 52) level = "fair";
  else level = "risk";

  if (labels.length === 0) {
    labels.push({
      en: "Keep tracking monthly; small improvements compound quickly.",
      es: "Sigue registrando mes a mes; los pequeños cambios se acumulan.",
    });
  }

  return {
    score,
    level,
    labels,
    expenseToIncome,
    savingsRate,
    monthsCovered,
  };
}
