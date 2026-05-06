"use client";

import { type NhostClient } from "@nhost/nhost-js";
import { useNhostClient } from "@nhost/react";
import { createContext, useContext } from "react";

const FinanceNhostClientContext = createContext<NhostClient | null>(null);

export function FinanceNhostClientBinder({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useNhostClient();
  return (
    <FinanceNhostClientContext.Provider value={client}>
      {children}
    </FinanceNhostClientContext.Provider>
  );
}

export function FinanceNhostClientGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FinanceNhostClientContext.Provider value={null}>
      {children}
    </FinanceNhostClientContext.Provider>
  );
}

export function useFinanceNhostClient() {
  return useContext(FinanceNhostClientContext);
}
