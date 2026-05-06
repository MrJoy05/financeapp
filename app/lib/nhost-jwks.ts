function normalizeRegion(raw: string | undefined) {
  if (!raw?.trim()) return "";
  const cleaned = raw.replace(/[^a-z0-9-]/gi, "");
  return cleaned || "";
}

/**
 * Build JWKS URL for verifying Nhost access tokens (RS256).
 * @see https://docs.nhost.io/reference/auth/get-well-known-jwks-json/
 */
export function resolveNhostJwksUrl(): string | null {
  const explicit = process.env.NHOST_JWKS_URL?.trim();
  if (explicit) return explicit;

  const authUrl = process.env.NEXT_PUBLIC_NHOST_AUTH_URL?.trim();
  if (authUrl) {
    const base = authUrl.replace(/\/$/, "");
    const v1Base = base.endsWith("/v1") ? base : `${base}/v1`;
    return `${v1Base}/.well-known/jwks.json`;
  }

  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN?.trim();
  const region = normalizeRegion(process.env.NEXT_PUBLIC_NHOST_REGION);
  if (!subdomain || !region) return null;
  return `https://${subdomain}.auth.${region}.nhost.run/v1/.well-known/jwks.json`;
}
