"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchNimbusFinanceFromNhost,
  upsertNimbusFinanceToNhost,
} from "../lib/nhost-finance-remote";
import { hasMeaningfulFinanceContent } from "../lib/finance-metrics";
import { normalizeStore } from "../lib/finance-normalize";
import { demoFinanceStore } from "./demo-finance-data";
import {
  emptyFinanceStore,
  type FinanceLine,
  type FinanceStore,
  type SavingsGoal,
} from "./types";
import { useFinanceNhostClient } from "./finance-nhost-client-context";
import { useFinancePersistAuth } from "./finance-persist-auth-context";
import { useFinanceUserKey } from "./finance-user-context";
import { useFinanceDemoMode } from "./finance-runtime-context";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const remoteRestOnly =
  process.env.NEXT_PUBLIC_FINANCE_REMOTE === "rest";

export function useFinanceStore() {
  const userKey = useFinanceUserKey();
  const isDemo = useFinanceDemoMode();
  const { authenticated, accessToken } = useFinancePersistAuth();
  const nhostClient = useFinanceNhostClient();

  const preferNhostGraphql = useMemo(() => {
    if (remoteRestOnly) return false;
    return nhostClient != null;
  }, [nhostClient]);

  const storageKey = useMemo(
    () => `nimbus.finance.v2.${userKey}`,
    [userKey],
  );

  const legacyStorageKey = useMemo(
    () => `nimbus.finance.v1.${userKey}`,
    [userKey],
  );

  const initialSeed = useMemo(
    () => (isDemo ? demoFinanceStore : emptyFinanceStore),
    [isDemo],
  );

  const cloudSync = authenticated && Boolean(accessToken);

  const remoteDebounceRef = useRef<number | undefined>(undefined);
  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken;
  const authenticatedRef = useRef(authenticated);
  authenticatedRef.current = authenticated;
  const nhostRef = useRef(nhostClient);
  nhostRef.current = nhostClient;
  const userKeyRef = useRef(userKey);
  userKeyRef.current = userKey;

  const [store, setStore] = useState<FinanceStore>(initialSeed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return () => {
      if (remoteDebounceRef.current) {
        window.clearTimeout(remoteDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(async () => {
      let nextStore = initialSeed;
      try {
        const raw =
          window.localStorage.getItem(storageKey) ??
          window.localStorage.getItem(legacyStorageKey);
        if (!raw) {
          nextStore = initialSeed;
        } else {
          const parsed = JSON.parse(raw) as unknown;
          nextStore = normalizeStore(parsed, initialSeed);
          if (!window.localStorage.getItem(storageKey)) {
            window.localStorage.setItem(storageKey, JSON.stringify(nextStore));
          }
        }
      } catch {
        nextStore = initialSeed;
      }

      if (!cancelled) {
        setStore(nextStore);
      }

      if (cloudSync && accessToken) {
        try {
          const nh = preferNhostGraphql ? nhostClient : null;

          if (nh) {
            const row = await fetchNimbusFinanceFromNhost(nh);
            if (!cancelled && row) {
              const remote = normalizeStore(row.storeRaw, initialSeed);
              const hasRemote =
                row.updatedAtMs > 0 || hasMeaningfulFinanceContent(remote);

              if (hasRemote) {
                setStore(remote);
                try {
                  window.localStorage.setItem(
                    storageKey,
                    JSON.stringify(remote),
                  );
                } catch {
                  /* ignore */
                }
              }
            }
          } else {
            const res = await fetch("/api/finance", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!cancelled && res.ok) {
              const data = (await res.json()) as {
                store?: unknown;
                updatedAtMs?: number;
              };
              if (data?.store !== undefined) {
                const remote = normalizeStore(data.store, initialSeed);
                const hasRemote =
                  (data.updatedAtMs ?? 0) > 0 ||
                  hasMeaningfulFinanceContent(remote);

                if (hasRemote) {
                  setStore(remote);
                  try {
                    window.localStorage.setItem(
                      storageKey,
                      JSON.stringify(remote),
                    );
                  } catch {
                    /* ignore */
                  }
                }
              }
            }
          }
        } catch {
          /* keep local snapshot */
        }
      }

      if (!cancelled) {
        setReady(true);
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [
    storageKey,
    legacyStorageKey,
    initialSeed,
    cloudSync,
    accessToken,
    preferNhostGraphql,
    nhostClient,
  ]);

  const queueRemotePersist = useCallback((snapshot: FinanceStore) => {
    if (!authenticatedRef.current || !accessTokenRef.current) return;

    if (remoteDebounceRef.current) {
      window.clearTimeout(remoteDebounceRef.current);
    }
    remoteDebounceRef.current = window.setTimeout(() => {
      const t = accessTokenRef.current;
      if (!t || !authenticatedRef.current) return;

      const nh = nhostRef.current;
      const uk = userKeyRef.current;
      const useGql = !remoteRestOnly && nh != null && uk !== "guest";

      if (useGql) {
        void upsertNimbusFinanceToNhost(nh, uk, snapshot);
        return;
      }

      void fetch("/api/finance", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ store: snapshot }),
      }).catch(() => {
        /* offline: localStorage still has latest */
      });
    }, 450);
  }, []);

  const persist = useCallback(
    (next: FinanceStore) => {
      setStore(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      queueRemotePersist(next);
    },
    [storageKey, queueRemotePersist],
  );

  const addLine = useCallback(
    (
      section: keyof Pick<
        FinanceStore,
        | "fixed"
        | "subscriptions"
        | "housing"
        | "insurance"
        | "variable"
        | "investments"
        | "creditCards"
      >,
    ) =>
      (name: string, amount: number) => {
        const line: FinanceLine = { id: newId(), name, amount };
        persist({
          ...store,
          [section]: [...store[section], line],
        });
      },
    [persist, store],
  );

  const removeLine = useCallback(
    (
      section: keyof Pick<
        FinanceStore,
        | "fixed"
        | "subscriptions"
        | "housing"
        | "insurance"
        | "variable"
        | "investments"
        | "creditCards"
      >,
    ) =>
      (idRow: string) => {
        persist({
          ...store,
          [section]: store[section].filter((r) => r.id !== idRow),
        });
      },
    [persist, store],
  );

  const setSavings = useCallback(
    (patch: Partial<Pick<FinanceStore, "savingsTarget" | "savingsCurrent">>) => {
      persist({ ...store, ...patch });
    },
    [persist, store],
  );

  const setMonthlyIncome = useCallback(
    (monthlyIncomeEstimate: number) => {
      persist({ ...store, monthlyIncomeEstimate });
    },
    [persist, store],
  );

  const addGoal = useCallback(
    (g: Omit<SavingsGoal, "id"> & { id?: string }) => {
      const goal: SavingsGoal = {
        id: g.id ?? newId(),
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        emoji: g.emoji,
      };
      persist({ ...store, goals: [...store.goals, goal] });
    },
    [persist, store],
  );

  const removeGoal = useCallback(
    (idRow: string) => {
      persist({ ...store, goals: store.goals.filter((g) => g.id !== idRow) });
    },
    [persist, store],
  );

  const patchGoal = useCallback(
    (idRow: string, patch: Partial<SavingsGoal>) => {
      persist({
        ...store,
        goals: store.goals.map((g) =>
          g.id === idRow ? { ...g, ...patch } : g,
        ),
      });
    },
    [persist, store],
  );

  return {
    store,
    ready,
    isDemo,
    addLine,
    removeLine,
    setSavings,
    setMonthlyIncome,
    addGoal,
    removeGoal,
    patchGoal,
  };
}
