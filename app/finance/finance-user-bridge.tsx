"use client";

import { useUserId } from "@nhost/react";
import { FinanceRuntimeProvider } from "./finance-runtime-context";
import { FinanceUserProvider } from "./finance-user-context";

export function FinanceUserBridge({ children }: { children: React.ReactNode }) {
  const userId = useUserId();
  const isDemo = !userId;
  const key = userId ?? "guest";

  return (
    <FinanceRuntimeProvider isDemo={isDemo}>
      <FinanceUserProvider userKey={key}>{children}</FinanceUserProvider>
    </FinanceRuntimeProvider>
  );
}
