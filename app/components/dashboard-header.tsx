"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthenticated } from "@nhost/react";
import { useNhostConfigured } from "../auth/nhost-availability";
import { useLanguage } from "../i18n/language-context";
import { useAccountUi } from "./account/account-ui-context";
import { AccountMenu } from "./auth/auth-modals";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

function AccountPortalButtonGate() {
  const configured = useNhostConfigured();
  if (!configured) return null;
  return <AccountPortalButton />;
}

function AccountPortalButton() {
  const { t } = useLanguage();
  const { openAccountPanel } = useAccountUi();
  const authenticated = useAuthenticated();

  if (!authenticated) return null;

  return (
    <button
      type="button"
      onClick={openAccountPanel}
      className="text-xs font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {t("navAccount")}
    </button>
  );
}

export function DashboardHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const link =
    "text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";
  const linkActive =
    "text-xs font-semibold text-zinc-950 dark:text-zinc-100";

  return (
    <header className="nimbus-reveal-pending sticky top-0 z-20 border-b border-zinc-200/70 bg-white/90 backdrop-blur dark:border-zinc-800/90 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
        >
          <span className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <Image
              src="/nimbus-mascot.png"
              alt={t("brand")}
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("brand")}
          </span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-x-5 gap-y-2 md:flex"
          aria-label="Primary"
        >
          <Link
            href="/"
            className={pathname === "/" ? linkActive : link}
          >
            {t("navOverview")}
          </Link>
          <Link href="/#finanzas" className={link}>
            {t("navFinance")}
          </Link>
          <Link
            href="/investments"
            className={pathname === "/investments" ? linkActive : link}
          >
            {t("navInvestments")}
          </Link>
          <Link href="/#patreon" className={link}>
            {t("navPatreon")}
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <nav
            className="flex items-center gap-3 border-r border-zinc-200/80 pr-2 dark:border-zinc-800 md:hidden"
            aria-label="Primary mobile"
          >
            <Link
              href="/"
              className={pathname === "/" ? linkActive : link}
            >
              {t("navOverview")}
            </Link>
            <Link
              href="/investments"
              className={pathname === "/investments" ? linkActive : link}
            >
              {t("navInvestments")}
            </Link>
          </nav>
          <AccountPortalButtonGate />
          <ThemeToggle />
          <LanguageToggle compact />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
