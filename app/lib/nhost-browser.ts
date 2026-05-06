import { NhostClient } from "@nhost/react";

function normalizeRegion(raw: string | undefined) {
  if (!raw?.trim()) return undefined;
  const cleaned = raw.replace(/[^a-z0-9-]/gi, "");
  return cleaned || undefined;
}

function trimUrl(raw: string | undefined) {
  const u = raw?.trim();
  return u || undefined;
}

/**
 * Prefer subdomain + region from the Nhost dashboard.
 * If URLs fail to resolve, set explicit service URLs (Auth → Settings in console):
 * NEXT_PUBLIC_NHOST_AUTH_URL, NEXT_PUBLIC_NHOST_GRAPHQL_URL
 */
export function createNhostClientFromEnv(): NhostClient | null {
  const authUrl = trimUrl(process.env.NEXT_PUBLIC_NHOST_AUTH_URL);
  const graphqlUrl = trimUrl(process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL);
  const storageUrl = trimUrl(process.env.NEXT_PUBLIC_NHOST_STORAGE_URL);
  const functionsUrl = trimUrl(process.env.NEXT_PUBLIC_NHOST_FUNCTIONS_URL);

  if (authUrl && graphqlUrl) {
    return new NhostClient({
      authUrl,
      graphqlUrl,
      ...(storageUrl ? { storageUrl } : {}),
      ...(functionsUrl ? { functionsUrl } : {}),
    });
  }

  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN?.trim() ?? "";
  if (!subdomain) return null;

  const region = normalizeRegion(process.env.NEXT_PUBLIC_NHOST_REGION);

  return new NhostClient({
    subdomain,
    ...(region ? { region } : {}),
  });
}
