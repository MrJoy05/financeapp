import type { NhostClient } from "@nhost/nhost-js";
import type { FinanceStore } from "../finance/types";
import {
  buildNimbusFinanceQuery,
  buildNimbusFinanceUpsert,
  HASURA_FINANCE_ROOT_FIELD,
} from "./nhost-finance-gql";

function toMs(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function isQueryRootMissingField(error: unknown): boolean {
  const s = JSON.stringify(error);
  return (
    s.includes("not found in type: 'query_root'") ||
    s.includes("not found in type: \\'query_root\\'")
  );
}

function logGraphqlHint(kind: "query" | "mutation") {
  const table = HASURA_FINANCE_ROOT_FIELD;
  console.info(
    `[finance] Hasura no expone "${table}". En Nhost → Data → Hasura: ejecuta el SQL (sql/nhost-finance-profiles.sql), luego Track la tabla "${table}" en schema public y recarga la consola. ` +
      `Si el campo en GraphQL tiene otro nombre, define NEXT_PUBLIC_HASURA_FINANCE_TABLE. ` +
      `(${kind})`,
  );
}

function firstRowFromQueryData(
  data: unknown,
  rootField: string,
): { payload?: unknown; updated_at_ms?: number | string | null } | null {
  if (!data || typeof data !== "object") return null;
  const rows = (data as Record<string, unknown>)[rootField];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const row = rows[0];
  if (!row || typeof row !== "object") return null;
  return row as { payload?: unknown; updated_at_ms?: number | string | null };
}

export async function fetchNimbusFinanceFromNhost(
  nhost: NhostClient,
): Promise<{ storeRaw: unknown; updatedAtMs: number } | null> {
  const root = HASURA_FINANCE_ROOT_FIELD;
  const doc = buildNimbusFinanceQuery(root);
  const { data, error } = await nhost.graphql.request(doc);
  if (error) {
    console.warn("[finance] Nhost GraphQL query failed", error);
    if (isQueryRootMissingField(error)) {
      logGraphqlHint("query");
    }
    return null;
  }
  const row = firstRowFromQueryData(data, root);
  if (!row || row.payload === undefined || row.payload === null) {
    return null;
  }
  return {
    storeRaw: row.payload,
    updatedAtMs: toMs(row.updated_at_ms),
  };
}

export async function upsertNimbusFinanceToNhost(
  nhost: NhostClient,
  userId: string,
  store: FinanceStore,
): Promise<boolean> {
  const root = HASURA_FINANCE_ROOT_FIELD;
  const doc = buildNimbusFinanceUpsert(root);
  const updatedAtMs = Date.now();
  const { error } = await nhost.graphql.request(doc, {
    user_id: userId,
    payload: store as unknown as Record<string, unknown>,
    updated_at_ms: updatedAtMs,
  });
  if (error) {
    console.warn("[finance] Nhost GraphQL upsert failed", error);
    if (isQueryRootMissingField(error)) {
      logGraphqlHint("mutation");
    }
    return false;
  }
  return true;
}
