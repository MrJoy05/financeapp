/** GraphQL contra Hasura en Nhost — tabla por defecto `public.finance_profiles`. */

const DEFAULT_TABLE = "finance_profiles";

function resolveHasuraFinanceRootField(): string {
  const raw = process.env.NEXT_PUBLIC_HASURA_FINANCE_TABLE?.trim();
  const name = raw || DEFAULT_TABLE;
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    if (typeof console !== "undefined") {
      console.warn(
        "[finance] NEXT_PUBLIC_HASURA_FINANCE_TABLE inválido; usando finance_profiles",
      );
    }
    return DEFAULT_TABLE;
  }
  return name;
}

/** Nombre del campo en query_root / mutaciones (por defecto igual al nombre de tabla en Hasura). */
export const HASURA_FINANCE_ROOT_FIELD = resolveHasuraFinanceRootField();

/**
 * Nombre de la restricción PK en Postgres (ver sql/nhost-finance-profiles.sql).
 * Si renombraste la tabla en SQL, ajusta NEXT_PUBLIC_HASURA_FINANCE_PKEY (ej. nueva_tabla_pkey).
 */
function resolveFinanceProfilesPkey(): string {
  const raw = process.env.NEXT_PUBLIC_HASURA_FINANCE_PKEY?.trim();
  const name = raw || "finance_profiles_pkey";
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    return "finance_profiles_pkey";
  }
  return name;
}

export const HASURA_FINANCE_PKEY = resolveFinanceProfilesPkey();

export function buildNimbusFinanceQuery(rootField: string = HASURA_FINANCE_ROOT_FIELD) {
  return `
query NimbusFinanceProfile {
  ${rootField}(limit: 1) {
    payload
    updated_at_ms
  }
}
`;
}

export function buildNimbusFinanceUpsert(rootField: string = HASURA_FINANCE_ROOT_FIELD) {
  const insertOne = `insert_${rootField}_one`;
  const pkey = HASURA_FINANCE_PKEY;
  return `
mutation NimbusFinanceUpsert(
  $user_id: uuid!
  $payload: jsonb!
  $updated_at_ms: bigint!
) {
  ${insertOne}(
    object: {
      user_id: $user_id
      payload: $payload
      updated_at_ms: $updated_at_ms
    }
    on_conflict: {
      constraint: ${pkey}
      update_columns: [payload, updated_at_ms]
    }
  ) {
    user_id
    updated_at_ms
  }
}
`;
}
