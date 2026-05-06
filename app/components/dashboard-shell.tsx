"use client";

import { DashboardHeader } from "./dashboard-header";
import { DemoRibbon } from "./demo-ribbon";
import { DollarRateCard } from "./dollar-rate-card";
import { FinanceStatStrip } from "./finance/finance-stat-strip";
import { FinanceWorkspace } from "./finance/finance-workspace";
import { NimbusHomeEntry } from "./nimbus-home-entry";
import { PatreonCallout } from "./patreon-callout";

export function DashboardShell() {
  return (
    <NimbusHomeEntry>
      <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
        <DashboardHeader />
        <DemoRibbon />
        <main className="nimbus-main-stagger mx-auto max-w-6xl space-y-16 px-6 py-10">
          <DollarRateCard />
          <FinanceStatStrip />
          <FinanceWorkspace />
          <PatreonCallout />
        </main>
    </div>
    </NimbusHomeEntry>
  );
}
