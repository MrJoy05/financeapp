"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthModalMode = "login" | "register" | "forgot" | null;

type AuthUiContextValue = {
  mode: AuthModalMode;
  openLogin: () => void;
  openRegister: () => void;
  openForgot: () => void;
  close: () => void;
};

const AuthUiContext = createContext<AuthUiContextValue | null>(null);

export function AuthUiProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AuthModalMode>(null);

  const openLogin = useCallback(() => setMode("login"), []);
  const openRegister = useCallback(() => setMode("register"), []);
  const openForgot = useCallback(() => setMode("forgot"), []);
  const close = useCallback(() => setMode(null), []);

  const value = useMemo(
    () => ({ mode, openLogin, openRegister, openForgot, close }),
    [mode, openLogin, openRegister, openForgot, close],
  );

  return (
    <AuthUiContext.Provider value={value}>{children}</AuthUiContext.Provider>
  );
}

export function useAuthUi(): AuthUiContextValue {
  const ctx = useContext(AuthUiContext);
  if (!ctx) throw new Error("useAuthUi must be used within AuthUiProvider");
  return ctx;
}
