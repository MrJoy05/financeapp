"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  useAuthenticationStatus,
  useResetPassword,
  useSignInEmailPassword,
  useSignOut,
  useSignUpEmailPassword,
  useUserEmail,
} from "@nhost/react";
import { useAuthUi } from "../../auth/auth-ui-context";
import { useNhostConfigured } from "../../auth/nhost-availability";
import { formatAuthError } from "../../lib/auth-errors";
import { useLanguage } from "../../i18n/language-context";
import { Modal } from "../ui/modal";

export function AuthModals() {
  const { mode, close, openLogin, openRegister, openForgot } = useAuthUi();
  const nhostOk = useNhostConfigured();
  const { t } = useLanguage();

  if (!nhostOk) {
    return (
      <Modal
        open={mode !== null}
        title={t("authNhostTitle")}
        onClose={close}
        closeAriaLabel={t("modalClose")}
        footer={
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t("authClose")}
          </button>
        }
      >
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("authNhostBody")}
        </p>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={mode === "login"}
        title={t("authLoginTitle")}
        onClose={close}
        closeAriaLabel={t("modalClose")}
      >
        <LoginForm onSwitchRegister={openRegister} onSwitchForgot={openForgot} />
      </Modal>
      <Modal
        open={mode === "register"}
        title={t("authRegisterTitle")}
        onClose={close}
        closeAriaLabel={t("modalClose")}
      >
        <RegisterForm onSwitchLogin={openLogin} />
      </Modal>
      <Modal
        open={mode === "forgot"}
        title={t("authForgotTitle")}
        onClose={close}
        closeAriaLabel={t("modalClose")}
        size="sm"
      >
        <ForgotForm onSwitchLogin={openLogin} />
      </Modal>
    </>
  );
}

function LoginForm({
  onSwitchRegister,
  onSwitchForgot,
}: {
  onSwitchRegister: () => void;
  onSwitchForgot: () => void;
}) {
  const { t } = useLanguage();
  const { close } = useAuthUi();
  const {
    signInEmailPassword,
    isLoading,
    isError,
    error,
    isSuccess,
    needsEmailVerification,
  } = useSignInEmailPassword();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess, close]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await signInEmailPassword(email.trim(), password);
    },
    [email, password, signInEmailPassword],
  );

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldGroup label={t("authEmail")} id="login-email">
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </FieldGroup>
      <FieldGroup label={t("authPassword")} id="login-password">
        <div className="relative">
          <input
            id="login-password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-24 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            onClick={() => setShowPw((s) => !s)}
          >
            {showPw ? t("authHidePassword") : t("authShowPassword")}
          </button>
        </div>
      </FieldGroup>
      {isError && error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {formatAuthError(error)}
        </p>
      ) : null}
      {needsEmailVerification ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t("authVerifyEmail")}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {isLoading ? t("authLoading") : t("authSignIn")}
        </button>
        <button
          type="button"
          onClick={onSwitchForgot}
          className="rounded-xl px-3 py-2 text-sm text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
        >
          {t("authForgotLink")}
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t("authNoAccount")}{" "}
        <button
          type="button"
          className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          onClick={onSwitchRegister}
        >
          {t("authRegisterAction")}
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitchLogin }: { onSwitchLogin: () => void }) {
  const { t } = useLanguage();
  const {
    signUpEmailPassword,
    isLoading,
    isError,
    error,
    needsEmailVerification,
  } = useSignUpEmailPassword();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const redirectOrigin =
    typeof window !== "undefined" ? window.location.origin : "";

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await signUpEmailPassword(email.trim(), password, {
        redirectTo: `${redirectOrigin}/`,
      });
    },
    [email, password, redirectOrigin, signUpEmailPassword],
  );

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldGroup label={t("authEmail")} id="reg-email">
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </FieldGroup>
      <FieldGroup label={t("authPasswordCreate")} id="reg-password">
        <div className="relative">
          <input
            id="reg-password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-24 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            onClick={() => setShowPw((s) => !s)}
          >
            {showPw ? t("authHidePassword") : t("authShowPassword")}
          </button>
        </div>
      </FieldGroup>
      {isError && error ? (
        <p className="text-sm whitespace-pre-wrap break-words text-rose-600 dark:text-rose-400">
          {formatAuthError(error)}
        </p>
      ) : null}
      {needsEmailVerification ? (
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          {t("authVerifyEmail")}
        </p>
      ) : null}
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        {t("authRedirectHint")}
      </p>
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {isLoading ? t("authLoading") : t("authCreateAccount")}
      </button>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t("authHaveAccount")}{" "}
        <button
          type="button"
          className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          onClick={onSwitchLogin}
        >
          {t("authSignInAction")}
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onSwitchLogin }: { onSwitchLogin: () => void }) {
  const { t } = useLanguage();
  const { resetPassword, isLoading, isSent, isError, error } = useResetPassword();
  const [email, setEmail] = useState("");

  const redirectOrigin =
    typeof window !== "undefined" ? window.location.origin : "";

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await resetPassword(email.trim(), {
        redirectTo: `${redirectOrigin}/auth/set-password`,
      });
    },
    [email, redirectOrigin, resetPassword],
  );

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t("authForgotLead")}
      </p>
      <FieldGroup label={t("authEmail")} id="forgot-email">
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </FieldGroup>
      {isSent ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {t("authResetSent")}
        </p>
      ) : null}
      {isError && error ? (
        <p className="text-sm whitespace-pre-wrap break-words text-rose-600 dark:text-rose-400">
          {formatAuthError(error)}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {isLoading ? t("authLoading") : t("authSendLink")}
        </button>
        <button
          type="button"
          onClick={onSwitchLogin}
          className="rounded-xl px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {t("authBackToLogin")}
        </button>
      </div>
    </form>
  );
}

function FieldGroup({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AccountMenu() {
  const configured = useNhostConfigured();
  if (!configured) return <AccountMenuDisabled />;
  return <AccountMenuConnected />;
}

function AccountMenuDisabled() {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      disabled
      className="rounded-xl px-3 py-2 text-sm text-zinc-400"
      title={t("authNhostBody")}
    >
      {t("authDisabled")}
    </button>
  );
}

function AccountMenuConnected() {
  const [authUiReady, setAuthUiReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setAuthUiReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const { t } = useLanguage();
  const { mode, openLogin, openRegister, close } = useAuthUi();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const email = useUserEmail();
  const { signOut } = useSignOut();

  if (!authUiReady) {
    return (
      <span
        className="rounded-xl px-3 py-2 text-sm text-zinc-500"
        aria-busy="true"
      >
        …
      </span>
    );
  }

  if (isLoading && mode === null && !email) {
    return (
      <span className="rounded-xl px-3 py-2 text-sm text-zinc-500">…</span>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-[10rem] truncate text-sm text-zinc-600 sm:inline dark:text-zinc-300">
          {email}
        </span>
        <button
          type="button"
          onClick={() => {
            close();
            void signOut();
          }}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {t("authSignOut")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={openLogin}
        className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {t("authSignIn")}
      </button>
      <button
        type="button"
        onClick={openRegister}
        className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        {t("authRegisterAction")}
      </button>
    </div>
  );
}
