"use client";

import { useEffect, useState } from "react";
import { useAuthenticationStatus } from "@nhost/react";
import { useAuthUi } from "../../auth/auth-ui-context";
import { useLanguage } from "../../i18n/language-context";
import { Modal } from "../ui/modal";

const SESSION_DISMISS_KEY = "nimbus.registerPrompt.dismiss";

export function GuestRegisterPromptModal() {
  const { t } = useLanguage();
  const { openRegister, openLogin, mode } = useAuthUi();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      setOpen(false);
      return;
    }

    try {
      if (
        typeof window !== "undefined" &&
        sessionStorage.getItem(SESSION_DISMISS_KEY) === "1"
      ) {
        return;
      }
    } catch {
      /* private mode etc. */
    }

    const id = window.setTimeout(() => {
      if (!isAuthenticated && !isLoading) {
        try {
          if (sessionStorage.getItem(SESSION_DISMISS_KEY) === "1") return;
        } catch {
          /* ignore */
        }
        setOpen(true);
      }
    }, 2800);

    return () => window.clearTimeout(id);
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (mode !== null) setOpen(false);
  }, [mode]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const goRegister = () => {
    dismiss();
    openRegister();
  };

  const goLogin = () => {
    dismiss();
    openLogin();
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      title={t("registerPromptTitle")}
      onClose={dismiss}
      closeAriaLabel={t("modalClose")}
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={dismiss}
            className="order-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:order-1"
          >
            {t("registerPromptLater")}
          </button>
          <button
            type="button"
            onClick={goLogin}
            className="order-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {t("registerPromptLogin")}
          </button>
          <button
            type="button"
            onClick={goRegister}
            className="order-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:order-3"
          >
            {t("registerPromptCta")}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t("registerPromptBody")}
      </p>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
        {t("registerPromptNote")}
      </p>
    </Modal>
  );
}
