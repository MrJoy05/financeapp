"use client";

import { useAccessToken, useAuthenticated } from "@nhost/react";
import { createContext, useContext } from "react";

type FinancePersistAuth = {
  accessToken: string | null;
  authenticated: boolean;
};

const FinancePersistAuthContext = createContext<FinancePersistAuth>({
  accessToken: null,
  authenticated: false,
});

/** Inside `NhostProvider`; reads token for `/api/finance` sync. */
export function FinancePersistAuthNhostBridge({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = useAuthenticated();
  const accessToken = useAccessToken();

  return (
    <FinancePersistAuthContext.Provider
      value={{ authenticated, accessToken }}
    >
      {children}
    </FinancePersistAuthContext.Provider>
  );
}

/** When Nhost env is missing — hooks above cannot run without `NhostProvider`. */
export function FinancePersistAuthGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FinancePersistAuthContext.Provider
      value={{ authenticated: false, accessToken: null }}
    >
      {children}
    </FinancePersistAuthContext.Provider>
  );
}

export function useFinancePersistAuth() {
  return useContext(FinancePersistAuthContext);
}
