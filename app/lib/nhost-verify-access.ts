import * as jose from "jose";
import { resolveNhostJwksUrl } from "./nhost-jwks";

let jwks: jose.JWTVerifyGetKey | null = null;

function getJwks(): jose.JWTVerifyGetKey | null {
  if (jwks) return jwks;
  const url = resolveNhostJwksUrl();
  if (!url) return null;
  jwks = jose.createRemoteJWKSet(new URL(url));
  return jwks;
}

/**
 * Returns Nhost user id (`sub`) from `Authorization: Bearer …`, or null.
 */
export async function verifyNhostAccessToken(
  authorizationHeader: string | null,
): Promise<string | null> {
  const raw = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7).trim()
    : null;
  if (!raw) return null;

  const issuer = process.env.NHOST_JWT_ISSUER?.trim();

  const JWKS = getJwks();
  if (!JWKS) return null;

  try {
    const { payload } = await jose.jwtVerify(raw, JWKS, {
      algorithms: ["RS256"],
      ...(issuer ? { issuer } : {}),
    });
    const sub = payload.sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}
