"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../i18n/language-context";

type RateResponse =
  | { rate: number; date: string; base: string }
  | { error: string };

type Trend = "up" | "down" | "flat";

function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onFrame: (n: number) => void,
) {
  const t0 = performance.now();
  const diff = to - from;
  const ease = (t: number) => 1 - (1 - t) ** 3;

  function frame(now: number) {
    const t = Math.min(1, (now - t0) / durationMs);
    onFrame(from + diff * ease(t));
    if (t < 1) requestAnimationFrame(frame);
    else onFrame(to);
  }
  requestAnimationFrame(frame);
}

const EPS = 0.0005;

export function DollarRateCard() {
  const { locale, t } = useLanguage();

  const nf = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  const df = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [locale],
  );

  const displayRateRef = useRef(0);
  const previousPollRef = useRef<number | null>(null);

  const [displayRate, setDisplayRate] = useState(0);
  const [committedRate, setCommittedRate] = useState<number | null>(null);
  const [trend, setTrend] = useState<Trend>("flat");
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [officialDate, setOfficialDate] = useState<string | null>(null);
  const [clientUpdated, setClientUpdated] = useState<Date | null>(null);
  const [lastDelta, setLastDelta] = useState<number | null>(null);

  const applyRate = useCallback((raw: number) => {
    const prevPoll = previousPollRef.current;

    let nextTrend: Trend = "flat";
    if (prevPoll != null && raw > prevPoll + EPS) nextTrend = "up";
    else if (prevPoll != null && raw < prevPoll - EPS) nextTrend = "down";
    setTrend(nextTrend);

    if (prevPoll != null) {
      const d = raw - prevPoll;
      setLastDelta(Math.abs(d) > EPS ? d : null);
      if (Math.abs(d) > EPS) {
        setPulse(true);
        window.setTimeout(() => setPulse(false), 900);
      }
    } else {
      setLastDelta(null);
    }

    previousPollRef.current = raw;

    animateValue(displayRateRef.current, raw, 650, (n) => {
      displayRateRef.current = n;
      setDisplayRate(n);
    });
    setCommittedRate(raw);
  }, []);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/rate", { cache: "no-store" });
      const body = (await res.json()) as RateResponse;
      if (!res.ok || "error" in body) {
        setError(true);
        return;
      }
      setOfficialDate(body.date);
      setClientUpdated(new Date());
      applyRate(body.rate);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [applyRate]);

  useEffect(() => {
    const id = window.setTimeout(() => void fetchRate(), 0);
    return () => window.clearTimeout(id);
  }, [fetchRate]);

  useEffect(() => {
    const id = window.setInterval(() => void fetchRate(), 45_000);
    return () => window.clearInterval(id);
  }, [fetchRate]);

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-emerald-50/50 p-6 shadow-[0_24px_80px_-32px_rgba(16,185,129,0.35)] dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/20 transition-[box-shadow,transform] duration-500 motion-reduce:transition-none ${
        pulse ? "dollar-card-pulse" : ""
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl transition-colors duration-700 motion-reduce:transition-none ${
          trend === "up"
            ? "animate-drift-slow bg-emerald-400/35"
            : trend === "down"
              ? "animate-drift-slow-reverse bg-rose-400/25"
              : "bg-emerald-300/15"
        }`}
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-700/90 dark:text-emerald-400/90">
            {t("dollarTitle")}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("dollarSubtitle")}
          </h2>
        </div>
        {clientUpdated ? (
          <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
            {t("updated")}: {df.format(clientUpdated)}
            {officialDate ? ` · ${officialDate}` : ""}
          </p>
        ) : loading ? (
          <p className="text-xs text-zinc-500">{t("syncing")}</p>
        ) : null}
      </div>

      <div className="relative mt-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("dollarBase")}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            MXN
          </span>
          <span
            className={`dollar-display text-5xl font-semibold tracking-tight tabular-nums transition-[color,text-shadow] duration-500 motion-reduce:transition-none sm:text-6xl ${
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400 dollar-tick-up"
                : trend === "down"
                  ? "text-rose-600 dark:text-rose-400 dollar-tick-down"
                  : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            {nf.format(displayRate)}
          </span>
          {lastDelta != null && committedRate != null ? (
            <span
              className={`animate-delta-pop inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
                lastDelta > 0
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
              }`}
            >
              {lastDelta > 0 ? "+" : ""}
              {nf.format(lastDelta)} {t("vsLastPoll")}
            </span>
          ) : null}
        </div>
        {error && (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
            {t("rateError")}
          </p>
        )}
      </div>
    </section>
  );
}
