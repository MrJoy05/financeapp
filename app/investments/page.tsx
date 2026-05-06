"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardHeader } from "../components/dashboard-header";
import { DemoRibbon } from "../components/demo-ribbon";
import { useLanguage } from "../i18n/language-context";

type Quote = {
  symbol: string;
  price: number | null;
  currency: string | null;
  shortName?: string | null;
  exchange?: string | null;
  error?: string;
};

const US_SYMBOLS = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"] as const;
const MX_SYMBOLS = [
  "AMXL.MX",
  "WALMEX.MX",
  "FEMSAUBD.MX",
  "GMEXICOB.MX",
  "BIMBOA.MX",
] as const;

export default function InvestmentsPage() {
  const { t, locale } = useLanguage();
  const [rows, setRows] = useState<Quote[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = [...US_SYMBOLS, ...MX_SYMBOLS].join(",");
      const res = await fetch(`/api/market-quotes?symbols=${qs}`, {
        cache: "no-store",
      });
      const payload = (await res.json()) as {
        quotes?: Quote[];
        fetchedAt?: string;
      };
      if (!res.ok) {
        throw new Error("bad_response");
      }
      setRows(payload.quotes ?? []);
      setUpdated(payload.fetchedAt ?? null);
    } catch {
      setError(t("investmentsError"));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const nfPrice = useCallback(
    (q: Quote) => {
      if (q.price == null) return "—";
      return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency:
          q.currency === "USD" ? "USD" : q.currency === "MXN" ? "MXN" : "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(q.price);
    },
    [locale],
  );

  const block = (title: string, symbols: string[]) => (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {symbols.map((sym) => {
              const q = rows.find((r) => r.symbol === sym);
              return (
                <tr key={sym} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">
                    {sym}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {q?.shortName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    {q ? nfPrice(q) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {q?.error ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        {q.error}
                      </span>
                    ) : (
                      q?.exchange ?? ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <DashboardHeader />
      <DemoRibbon />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {t("investmentsTitle")}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("investmentsLead")}
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            {t("investmentsDisclosure")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "…" : t("investmentsRefresh")}
            </button>
            {updated ? (
              <span className="text-xs tabular-nums text-zinc-500">
                {updated}
              </span>
            ) : null}
            {error ? (
              <span className="text-xs text-rose-600">{error}</span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {block(t("investmentsMx"), [...MX_SYMBOLS])}
          {block(t("investmentsUs"), [...US_SYMBOLS])}
        </div>
      </main>
    </div>
  );
}
