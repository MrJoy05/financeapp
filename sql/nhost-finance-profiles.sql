-- =============================================================================
-- Nimbus — tabla de perfil financiero para Nhost (PostgreSQL + Hasura)
-- =============================================================================
-- Cómo aplicarlo:
-- 1. Dashboard Nhost → tu proyecto → SQL → pega este script → Run.
-- 2. OBLIGATORIO: Hasura debe exponer la tabla como campo GraphQL. En Nhost:
--    proyecto → pestaña donde abres Hasura / Data → "Untracked tables" (o lista
--    de schemas) → localiza public.finance_profiles → **Track**.
--    Si ves en el navegador errores tipo:
--       field 'finance_profiles' not found in type 'query_root'
--    significa que este paso aún no se ha hecho (o falta Reload metadata).
-- 3. Permisos rol `user`: select / insert / update / delete donde
--    user_id = X-Hasura-User-Id (ver bloque HASURA más abajo).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.finance_profiles (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at_ms bigint NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS finance_profiles_updated_at_ms_idx
  ON public.finance_profiles (updated_at_ms DESC);

COMMENT ON TABLE public.finance_profiles IS
  'Nimbus: estado del dashboard por usuario (JSON compatible con FinanceStore).';
COMMENT ON COLUMN public.finance_profiles.payload IS
  'JSON: fixed, subscriptions, variable, investments, savingsTarget, savingsCurrent, monthlyIncomeEstimate, goals.';

-- -----------------------------------------------------------------------------
-- HASURA (configuración manual en la consola)
-- -----------------------------------------------------------------------------
-- Rol: user (o el default de sesión Nhost)
--
-- SELECT:  fila sin fila explícita si usas "Custom check":
--   { "user_id": { "_eq": "X-Hasura-User-Id" } }
-- INSERT:  mismo check en "Check":
--   { "user_id": { "_eq": "X-Hasura-User-Id" } }
--   Columnas permitidas: user_id, payload, updated_at_ms
-- UPDATE:  "Using" y "Check" con la misma condición; columnas: payload, updated_at_ms
-- DELETE:  condición user_id = X-Hasura-User-Id
--
-- Alternativa INSERT: preset de columna user_id = X-Hasura-User-Id y no enviar user_id
-- desde el cliente (la app actual sí envía user_id explícito).
-- -----------------------------------------------------------------------------
