"use client";

import { useFinanceDemoMode } from "../../finance/finance-runtime-context";
import { useFinanceStore } from "../../finance/use-finance-store";
import { useLanguage } from "../../i18n/language-context";
import { FinanceAgentPanel } from "./finance-agent-panel";
import { FinancialHealthCard } from "./financial-health-card";
import { LedgerSection, SavingsPlanSection } from "./ledger-section";
import { MonthlyIncomeCard } from "./monthly-income-card";
import { SavingsGoalsBoard } from "./savings-goals-board";

export function FinanceWorkspace() {
  const { t } = useLanguage();
  const { store, ready, addLine, removeLine, setSavings } = useFinanceStore();
  const isDemo = useFinanceDemoMode();

  if (!ready) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/60">
        …
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h2
          id="finanzas"
          className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {t("financeSectionsTitle")}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t(isDemo ? "financeSectionsLeadDemo" : "financeSectionsLeadUser")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MonthlyIncomeCard />
        </div>
        <div className="lg:col-span-2">
          <FinancialHealthCard />
        </div>
      </div>

      <FinanceAgentPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <LedgerSection
          section="fixed"
          title={t("sectionFixedTitle")}
          description={t("sectionFixedDesc")}
          rows={store.fixed}
          onAdd={addLine("fixed")}
          onRemove={removeLine("fixed")}
        />
        <LedgerSection
          section="subscriptions"
          title={t("sectionSubsTitle")}
          description={t("sectionSubsDesc")}
          rows={store.subscriptions}
          onAdd={addLine("subscriptions")}
          onRemove={removeLine("subscriptions")}
        />
        <LedgerSection
          section="variable"
          title={t("sectionVariableTitle")}
          description={t("sectionVariableDesc")}
          rows={store.variable}
          onAdd={addLine("variable")}
          onRemove={removeLine("variable")}
        />
        <LedgerSection
          section="investments"
          title={t("sectionInvestTitle")}
          description={t("sectionInvestDesc")}
          rows={store.investments}
          onAdd={addLine("investments")}
          onRemove={removeLine("investments")}
        />
      </div>

      <SavingsPlanSection
        key={`${store.savingsTarget}-${store.savingsCurrent}`}
        store={{
          savingsTarget: store.savingsTarget,
          savingsCurrent: store.savingsCurrent,
        }}
        onApply={setSavings}
      />

      <SavingsGoalsBoard />

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        {t("financeLocalNotice")}
      </p>
    </div>
  );
}
