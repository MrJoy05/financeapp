"use client";

import { useAuthenticated, useSignOut, useUserEmail, useUserId } from "@nhost/react";
import { useNhostConfigured } from "../../auth/nhost-availability";
import { useAuthUi } from "../../auth/auth-ui-context";
import { useLanguage } from "../../i18n/language-context";
import { Modal } from "../ui/modal";
import { useAccountUi } from "./account-ui-context";

export function AccountModal() {
  const ui = useAccountUi();
  const configured = useNhostConfigured();

  if (!configured) return null;

  return (
    <AccountModalInner
      accountOpen={ui.accountOpen}
      closeAccountPanel={ui.closeAccountPanel}
    />
  );
}

function AccountModalInner({
  accountOpen,
  closeAccountPanel,
}: {
  accountOpen: boolean;
  closeAccountPanel: () => void;
}) {
  const { t } = useLanguage();
  const { close: closeAuthUi } = useAuthUi();
  const isAuth = useAuthenticated();
  const email = useUserEmail();
  const userId = useUserId();
  const { signOut } = useSignOut();

  const maskId = userId
    ? `${userId.slice(0, 4)}···${userId.slice(-4)}`
    : "—";

  return (
    <Modal
      open={accountOpen}
      title={t("accountModalTitle")}
      onClose={closeAccountPanel}
      closeAriaLabel={t("modalClose")}
      size="md"
    >
      {!isAuth ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("accountModalGuestLead")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t("accountModalEmail")}
            </p>
            <p className="mt-1 break-all font-medium text-zinc-900 dark:text-zinc-100">
              {email ?? "—"}
            </p>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              {t("accountModalUserId")}
              :{" "}
              <span className="font-mono tabular-nums">{maskId}</span>
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("accountModalSecurityTitle")}
            </h3>
            <ul className="list-disc space-y-2 pl-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              <li>{t("accountModalSecurityTls")}</li>
              <li>{t("accountModalSecurityJwt")}</li>
              <li>{t("accountModalSecurityLocal")}</li>
              <li>{t("accountModalSecurityProd")}</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200 dark:hover:bg-rose-950"
              onClick={() => {
                closeAccountPanel();
                closeAuthUi();
                void signOut();
              }}
            >
              {t("authSignOut")}
            </button>
            <button
              type="button"
              onClick={closeAccountPanel}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {t("modalClose")}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
