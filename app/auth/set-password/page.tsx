"use client";

import Link from "next/link";
import { FormEvent, useCallback, useState } from "react";
import { useChangePassword } from "@nhost/react";
import { formatAuthError } from "../../lib/auth-errors";
import { useLanguage } from "../../i18n/language-context";

export default function SetPasswordPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("setPwTitle")}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("setPwLead")}
      </p>
      <div className="mt-8">
        <SetPasswordForm />
      </div>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
      >
        {t("setPwHome")}
      </Link>
    </main>
  );
}

function SetPasswordForm() {
  const { t } = useLanguage();
  const {
    changePassword,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useChangePassword();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await changePassword(password);
    },
    [changePassword, password],
  );

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {t("setPwLabel")}
        <div className="relative mt-1">
          <input
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-28 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            onClick={() => setShowPw((x) => !x)}
          >
            {showPw ? t("authHidePassword") : t("authShowPassword")}
          </button>
        </div>
      </label>
      {isError && error ? (
        <p className="text-sm whitespace-pre-wrap break-words text-rose-600 dark:text-rose-400">
          {formatAuthError(error)}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {t("setPwSuccess")}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {isLoading ? t("authLoading") : t("setPwSubmit")}
      </button>
    </form>
  );
}
