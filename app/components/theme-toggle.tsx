"use client";

import { useLanguage } from "../i18n/language-context";
import type { ThemePreference } from "../theme/theme-context";
import { useThemeMode } from "../theme/theme-context";

export function ThemeToggle() {
  const { preference, setPreference, resolved } = useThemeMode();
  const { t } = useLanguage();

  const cycle = () => {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const i = order.indexOf(preference as ThemePreference);
    const idx = i === -1 ? 0 : (i + 1) % order.length;
    setPreference(order[idx]!);
  };

  const preferenceLabel =
    preference === "light"
      ? t("themeLight")
      : preference === "dark"
        ? t("themeDark")
        : `${t("themeSystem")} (${resolved === "dark" ? t("themeDark") : t("themeLight")})`;

  const label = `${t("themeCycle")}: ${preferenceLabel}`;

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      title={label}
      aria-label={label}
    >
      {preference === "light" && (
        <SunIcon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {preference === "dark" && (
        <MoonIcon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {preference === "system" && (
        <SystemIcon className="h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="4" strokeWidth="2" />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      />
    </svg>
  );
}

function SystemIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M8 21h8m-4-4v4" />
    </svg>
  );
}
