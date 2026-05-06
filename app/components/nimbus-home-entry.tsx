"use client";

import { useLenis } from "lenis/react";
import { useEffect, useLayoutEffect, useState } from "react";
import type { SVGProps } from "react";

type Phase = "splash" | "curtain-out" | "idle";

/** Una vez por pestaña/sesión: no repetir al volver de /investments u otras rutas. */
const SESSION_KEY = "nimbus.homeEntry.v1";

/** Debe cubrir bloom + margen antes del fade del telón (~2–3 s de animación CSS + respiro). */
const SPLASH_MS = 3200;
const CURTAIN_FADE_MS = 780;

function IconRobot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M14 18h20a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V21a3 3 0 0 1 3-3Z" />
      <circle cx="19" cy="27" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="29" cy="27" r="2.5" fill="currentColor" stroke="none" />
      <path d="M24 10v4M20 8h8" />
      <path d="M18 38h12" opacity="0.55" />
    </svg>
  );
}

function IconCoin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <circle cx="24" cy="24" r="14" />
      <path d="M24 16v16M20 20h5a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h7" />
    </svg>
  );
}

function IconBill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="10" y="14" width="28" height="22" rx="3" />
      <path d="M16 18h16M16 24h10M16 30h14" opacity="0.45" />
      <circle cx="30" cy="25" r="4" />
    </svg>
  );
}

type EntryMode = "deciding" | "intro" | "done";

/**
 * Intro solo la primera vez que abres el inicio en esta sesión (misma pestaña).
 * Navegar a otras rutas y volver no vuelve a mostrar la animación.
 */
export function NimbusHomeEntry({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const [mode, setMode] = useState<EntryMode>("deciding");
  const [phase, setPhase] = useState<Phase>("idle");
  const [showCurtain, setShowCurtain] = useState(false);

  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let alreadySeen = false;
      try {
        alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        alreadySeen = false;
      }
      if (reduced || alreadySeen) {
        setMode("done");
        return;
      }
      setPhase("splash");
      setShowCurtain(true);
      setMode("intro");
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const inIntro = mode === "intro";

  useEffect(() => {
    if (!inIntro || !lenis) return;
    const freezeScroll = phase === "splash" || phase === "curtain-out";
    if (freezeScroll) lenis.stop();
    else lenis.start();
  }, [inIntro, phase, lenis]);

  useEffect(() => {
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    if (!inIntro) return;
    const t1 = window.setTimeout(() => {
      setPhase("curtain-out");
    }, SPLASH_MS);
    return () => window.clearTimeout(t1);
  }, [inIntro]);

  useEffect(() => {
    if (!inIntro || phase !== "curtain-out") return;
    const t2 = window.setTimeout(() => {
      setPhase("idle");
      setShowCurtain(false);
    }, CURTAIN_FADE_MS + 80);
    return () => window.clearTimeout(t2);
  }, [inIntro, phase]);

  useEffect(() => {
    if (!inIntro || phase !== "idle" || showCurtain) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [inIntro, phase, showCurtain]);

  const entryState =
    inIntro && phase === "splash"
      ? "splash"
      : "ready";

  return (
    <>
      {showCurtain ? (
        <div
          className={`pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-zinc-50 transition-[opacity] dark:bg-zinc-950 ${
            phase === "curtain-out"
              ? "opacity-0 duration-[780ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "opacity-100 duration-300 ease-out"
          }`}
          aria-hidden
        >
          <div className="relative flex h-48 w-48 items-center justify-center sm:h-52 sm:w-52">
            <div
              className="nimbus-home-bloom pointer-events-none absolute inset-0 m-auto h-[5.5rem] w-[5.5rem] rounded-3xl border border-zinc-300/70 bg-white/50 dark:border-zinc-600 dark:bg-zinc-900/50"
              aria-hidden
            />
            <div className="relative z-10 flex items-center gap-4 text-zinc-900 dark:text-zinc-100">
              <IconRobot className="nimbus-home-icon nimbus-home-icon-a h-11 w-11" />
              <IconCoin className="nimbus-home-icon nimbus-home-icon-b h-11 w-11" />
              <IconBill className="nimbus-home-icon nimbus-home-icon-c h-11 w-11" />
            </div>
          </div>
        </div>
      ) : null}
      <div data-nimbus-entry={entryState}>{children}</div>
    </>
  );
}
