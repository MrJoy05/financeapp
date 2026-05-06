"use client";

import { useMemo } from "react";
import { ReactLenis } from "lenis/react";
import { NhostProvider } from "@nhost/react";
import { AuthUiProvider } from "./auth/auth-ui-context";
import { NhostConfiguredBoundary } from "./auth/nhost-availability";
import { AccountModal } from "./components/account/account-modal";
import { AccountUiProvider } from "./components/account/account-ui-context";
import { AuthModals } from "./components/auth/auth-modals";
import { GuestRegisterPromptModal } from "./components/auth/guest-register-prompt";
import {
  FinanceNhostClientBinder,
  FinanceNhostClientGuest,
} from "./finance/finance-nhost-client-context";
import {
  FinancePersistAuthGuest,
  FinancePersistAuthNhostBridge,
} from "./finance/finance-persist-auth-context";
import { FinanceRuntimeProvider } from "./finance/finance-runtime-context";
import { FinanceUserBridge } from "./finance/finance-user-bridge";
import { FinanceUserProvider } from "./finance/finance-user-context";
import { createNhostClientFromEnv } from "./lib/nhost-browser";
import { LanguageProvider } from "./i18n/language-context";
import { ThemeProvider } from "./theme/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const nhost = useMemo(() => createNhostClientFromEnv(), []);
  const nhostConfigured = Boolean(nhost);
  const lenisOpts = useMemo(
    () => ({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.92,
      lerp: 0.12,
    }),
    [],
  );

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ReactLenis root options={lenisOpts}>
          <NhostConfiguredBoundary configured={nhostConfigured}>
            <AuthUiProvider>
              <AccountUiProvider>
                {nhost ? (
                  <NhostProvider nhost={nhost}>
                    <FinanceNhostClientBinder>
                      <FinancePersistAuthNhostBridge>
                        <FinanceUserBridge>{children}</FinanceUserBridge>
                      </FinancePersistAuthNhostBridge>
                    </FinanceNhostClientBinder>
                    <AuthModals />
                    <GuestRegisterPromptModal />
                    <AccountModal />
                  </NhostProvider>
                ) : (
                  <FinanceNhostClientGuest>
                    <FinancePersistAuthGuest>
                      <FinanceRuntimeProvider isDemo>
                        <>
                          <FinanceUserProvider userKey="guest">
                            {children}
                          </FinanceUserProvider>
                          <AuthModals />
                          <AccountModal />
                        </>
                      </FinanceRuntimeProvider>
                    </FinancePersistAuthGuest>
                  </FinanceNhostClientGuest>
                )}
              </AccountUiProvider>
            </AuthUiProvider>
          </NhostConfiguredBoundary>
        </ReactLenis>
      </LanguageProvider>
    </ThemeProvider>
  );
}
