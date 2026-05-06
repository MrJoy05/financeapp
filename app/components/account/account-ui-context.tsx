"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AccountUiContextValue = {
  accountOpen: boolean;
  openAccountPanel: () => void;
  closeAccountPanel: () => void;
};

const AccountUiContext = createContext<AccountUiContextValue | null>(null);

export function AccountUiProvider({ children }: { children: React.ReactNode }) {
  const [accountOpen, setAccountOpen] = useState(false);

  const openAccountPanel = useCallback(() => setAccountOpen(true), []);
  const closeAccountPanel = useCallback(() => setAccountOpen(false), []);

  const value = useMemo(
    () => ({ accountOpen, openAccountPanel, closeAccountPanel }),
    [accountOpen, openAccountPanel, closeAccountPanel],
  );

  return (
    <AccountUiContext.Provider value={value}>{children}</AccountUiContext.Provider>
  );
}

export function useAccountUi(): AccountUiContextValue {
  const ctx = useContext(AccountUiContext);
  if (!ctx) {
    throw new Error("useAccountUi must be used within AccountUiProvider");
  }
  return ctx;
}
