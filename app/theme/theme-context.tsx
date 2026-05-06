"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  resolved: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "nimbus.theme";

function readStoredPreference(): ThemePreference {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    /* ignore */
  }
  return "system";
}

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyClass(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>("system");
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => setSystemDark(mq.matches);
    const id0 = window.setTimeout(() => setSystemDark(mq.matches), 0);
    mq.addEventListener("change", onMq);

    const id = window.setTimeout(() => {
      setPreferenceState(readStoredPreference());
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(id0);
      window.clearTimeout(id);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  const resolved: "light" | "dark" = useMemo(() => {
    if (preference === "dark") return "dark";
    if (preference === "light") return "light";
    return systemDark ? "dark" : "light";
  }, [preference, systemDark]);

  const resolvedDark = resolved === "dark";

  useEffect(() => {
    if (!mounted) return;
    applyClass(resolvedDark);
  }, [mounted, resolvedDark]);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    const dark =
      value === "dark" ? true : value === "light" ? false : getSystemDark();
    applyClass(dark);
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference, resolved }),
    [preference, setPreference, resolved],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}
