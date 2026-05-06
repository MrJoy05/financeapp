"use client";

import { useFinanceDemoMode } from "../finance/finance-runtime-context";
import { useLanguage } from "../i18n/language-context";

/** Bandera cuando no hay cuenta o sesión: datos ficticios locales. */
export function DemoRibbon() {
  const { t } = useLanguage();
  const isDemo = useFinanceDemoMode();

  if (!isDemo) return null;

  return (
    <div className="nimbus-demo-ribbon nimbus-reveal-pending border-b border-amber-200/80 bg-amber-50/95 px-4 py-2 text-center text-xs font-medium text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
      {t("demoRibbon")}
    </div>
  );
}
