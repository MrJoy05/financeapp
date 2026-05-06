"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { computeFinancialHealth } from "../../lib/finance-health";
import { deriveFinanceTotals } from "../../lib/finance-metrics";
import { useFinanceStore } from "../../finance/use-finance-store";
import { useLanguage } from "../../i18n/language-context";

function buildCoachReply(
  text: string,
  locale: "en" | "es",
  storeHighlights: string,
): string {
  const lower = text.toLowerCase();

  const lines: Record<"en" | "es", string[]> = {
    en: [],
    es: [],
  };

  const add = (en: string, es: string) => {
    lines.en.push(en);
    lines.es.push(es);
  };

  if (
    lower.includes("casa") ||
    lower.includes("house") ||
    lower.includes("hogar")
  ) {
    add(
      "For a house down payment: set a dated goal above, automate a fixed weekly transfer to a segregated bucket, and cap lifestyle inflation when income rises.",
      "Para enganche de vivienda: define meta con fecha arriba, automatiza transferencias fijas a una cuenta separada y evita que el estilo de vida crezca al ritmo del salario.",
    );
  }
  if (lower.includes("subscri") || lower.includes("suscrip") || lower.includes("netflix")) {
    add(
      "Subscription audit: list every recurring charge, cancel duplicates, and move infrequent tools to annual billing if it saves >15%.",
      "Auditoría de suscripciones: lista cada cargo recurrente, elimina duplicados y pasa a anual si ahorras >15%.",
    );
  }
  if (
    lower.includes("ahorr") ||
    lower.includes("save") ||
    lower.includes("fondo")
  ) {
    add(
      "Build cash first: target 3–6 months of core expenses in liquid savings before increasing market risk.",
      "Prioriza liquidez: busca 3–6 meses de gastos básicos en efectivo antes de subir riesgo en mercados.",
    );
  }
  if (lower.includes("invert") || lower.includes("bolsa") || lower.includes("stock")) {
    add(
      "Investing discipline: keep contributions automatic, diversify across regions, and avoid timing the market with large lump sums when stressed.",
      "Disciplina de inversión: aportes automáticos, diversificación regional y evita concentrar compras por estrés o euforia.",
    );
  }
  if (
    lower.includes("tarjeta") ||
    lower.includes("credit card") ||
    lower.includes("minimum")
  ) {
    add(
      "Credit cards: automate payment ≥ statement balance, track annual fees in your cards ledger, and refinance high-APR balances if a lower-cost line is available.",
      "Tarjetas: automatiza pago del saldo estado de cuenta cuando puedas, lleva anualidades en el tablero de tarjetas y reestructura líneas con TAC altísima si encuentras alternativa más barata.",
    );
  }

  if (!lines[locale].length) {
    add(
      "Here is a snapshot from your workspace — plug your question into the monthly income and category ledgers for sharper answers next time.",
      "Aquí tienes un resumen de tu tablero — completa ingreso mensual y categorías para que el copiloto sea más preciso.",
    );
  }

  const header =
    locale === "es"
      ? "Resumen automático (no es asesoría regulada):\n"
      : "Automated snapshot (not regulated advice):\n";

  return `${header}${storeHighlights}\n\n${lines[locale].join("\n\n")}`;
}

export function FinanceAgentPanel() {
  const { locale, t } = useLanguage();
  const { store, ready } = useFinanceStore();
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const snapshot = useMemo(() => {
    const totals = deriveFinanceTotals(store);
    const health = computeFinancialHealth(store);
    if (locale === "es") {
      return `Puntuación salud: ${health.level === "unknown" ? "—" : health.score}/100 · Gastos mensuales ${totals.expensesMonth} · Ingreso estimado ${totals.monthlyIncomeEstimate || "pendiente"}.`;
    }
    return `Health score: ${health.level === "unknown" ? "—" : health.score}/100 · Monthly spend ${totals.expensesMonth} · Income estimate ${totals.monthlyIncomeEstimate || "missing"}.`;
  }, [locale, store]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!q.trim()) return;
      setReply(buildCoachReply(q, locale, snapshot));
    },
    [locale, q, snapshot],
  );

  if (!ready) return null;

  return (
    <section className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 dark:border-violet-900/50 dark:from-violet-950/50 dark:via-zinc-950 dark:to-fuchsia-950/30">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("agentTitle")}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("agentLead")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={4}
          placeholder={t("agentPlaceholder")}
          className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm shadow-inner dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
        >
          {t("agentAnalyze")}
        </button>
      </form>
      {reply ? (
        <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/70 bg-white/70 p-4 text-sm leading-relaxed text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-100">
          {reply}
        </pre>
      ) : (
        <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-dashed border-violet-200 bg-white/50 p-4 text-xs text-zinc-500 dark:border-violet-800 dark:bg-zinc-900/50">
          {snapshot}
        </pre>
      )}
    </section>
  );
}
