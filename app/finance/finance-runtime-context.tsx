"use client";

import { createContext, useContext } from "react";

export type FinanceRuntimeContextValue = {
  /** Guest / no cuenta: muestra datos de demostración en local */
  isDemo: boolean;
};

const Ctx = createContext<FinanceRuntimeContextValue>({ isDemo: true });

export function FinanceRuntimeProvider({
  isDemo,
  children,
}: {
  isDemo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ isDemo }}>{children}</Ctx.Provider>
  );
}

export function useFinanceDemoMode() {
  return useContext(Ctx).isDemo;
}
