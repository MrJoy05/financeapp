"use client";

import { createContext, useContext } from "react";

const FinanceUserContext = createContext<string>("guest");

export function FinanceUserProvider({
  userKey,
  children,
}: {
  userKey: string;
  children: React.ReactNode;
}) {
  return (
    <FinanceUserContext.Provider value={userKey}>
      {children}
    </FinanceUserContext.Provider>
  );
}

export function useFinanceUserKey() {
  return useContext(FinanceUserContext);
}
