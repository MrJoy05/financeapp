/**
 * URLs usadas en Nhost como `redirectTo` (verify email, reset password).
 * En Vercel define NEXT_PUBLIC_SITE_URL=https://tu-dominio.com (sin slash final).
 * Si no existe, en el navegador se usa window.location.origin.
 */
export function getBrowserAuthRedirectOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
