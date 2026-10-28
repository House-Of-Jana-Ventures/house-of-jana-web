/**
 * The buyer's session: the API's access and refresh tokens, kept in
 * httpOnly cookies set by this site's server, so browser JavaScript can
 * never read them. Two small cookies sit beside them for the header: the
 * first name and the number of pieces in the cart. Pure (no server-only
 * imports), so the proxy, actions and tests share it.
 */
export const ACCESS_COOKIE = "jh_at";
export const REFRESH_COOKIE = "jh_rt";
export const WHO_COOKIE = "jh_who";
export const CART_COOKIE = "jh_cart";

/** What the API returns on sign-in, registration and refresh. */
export interface TokenPair {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user?: { firstName: string };
}

export interface CookieToSet {
  name: string;
  value: string;
  options: { httpOnly: true; secure: boolean; sameSite: "lax"; path: "/"; maxAge: number };
}

const options = (maxAge: number, secure: boolean): CookieToSet["options"] => ({
  httpOnly: true,
  secure,
  sameSite: "lax",
  path: "/",
  maxAge: Math.max(0, Math.floor(maxAge)),
});

/**
 * The access cookie ends a minute before the token does, so the proxy
 * refreshes in time instead of the API refusing an expired token.
 */
export function accessSeconds(expiresIn: number): number {
  return Math.max(0, expiresIn - 60);
}

export function refreshSeconds(expiresAt: string, now: number): number {
  const ms = Date.parse(expiresAt) - now;
  return Number.isFinite(ms) ? Math.max(0, ms / 1000) : 0;
}

/** The first name, safe to keep in a cookie (any language). */
export function encodeWho(firstName: string): string {
  return encodeURIComponent(firstName.trim().slice(0, 40));
}

export function decodeWho(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).slice(0, 40);
  } catch {
    return "";
  }
}

export function sessionCookies(tokens: TokenPair, secure: boolean, now: number): CookieToSet[] {
  const lasts = refreshSeconds(tokens.refreshTokenExpiresAt, now);
  return [
    { name: ACCESS_COOKIE, value: tokens.accessToken, options: options(accessSeconds(tokens.accessTokenExpiresIn), secure) },
    { name: REFRESH_COOKIE, value: tokens.refreshToken, options: options(lasts, secure) },
    ...(tokens.user ? [{ name: WHO_COOKIE, value: encodeWho(tokens.user.firstName), options: options(lasts, secure) }] : []),
  ];
}

export function clearedCookies(secure: boolean): CookieToSet[] {
  return [ACCESS_COOKIE, REFRESH_COOKIE, WHO_COOKIE, CART_COOKIE].map((name) => ({
    name,
    value: "",
    options: options(0, secure),
  }));
}

/** The first name for the header, after the buyer changes it (kept 30 days, like the session). */
export function whoCookie(firstName: string, secure: boolean): CookieToSet {
  return { name: WHO_COOKIE, value: encodeWho(firstName), options: options(30 * 86_400, secure) };
}

/** The number of pieces in the cart, for the header badge (kept 30 days). */
export function cartCookie(pieces: number, secure: boolean): CookieToSet {
  return { name: CART_COOKIE, value: String(Math.max(0, Math.floor(pieces))), options: options(30 * 86_400, secure) };
}

export function readCartCount(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/**
 * Only paths on this site are followed after signing in ("//evil.com" and
 * "/\evil.com" are not), and never back to the sign-in pages themselves.
 */
export function safeNext(next: string | null | undefined, fallback = "/shop"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/^\/(sign-in|register)(\/|\?|$)/.test(next)) return fallback;
  return next;
}

/** Secure (HTTPS-only) cookies in production, unless COOKIE_SECURE=false (a local production build over http). */
export function secureCookies(): boolean {
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

/** Pages that need a signed-in buyer. */
export function needsSession(path: string): boolean {
  return ["/cart", "/checkout", "/account"].some((p) => path === p || path.startsWith(`${p}/`));
}
