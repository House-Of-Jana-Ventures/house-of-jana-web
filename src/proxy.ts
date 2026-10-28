import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  clearedCookies,
  needsSession,
  REFRESH_COOKIE,
  safeNext,
  secureCookies,
  sessionCookies,
  type CookieToSet,
  type TokenPair,
} from "@/lib/session/cookies";

const API = () => (process.env.API_URL ?? "http://localhost:4100/api/v1").replace(/\/+$/, "");

/**
 * Before every page and action:
 *
 * 1. when the access cookie has run out but the refresh token is there,
 *    refresh once and hand the new cookies to this request and the browser
 * 2. cart, checkout and account pages need a signed-in buyer (to sign in,
 *    then back); the sign-in pages send a signed-in buyer on
 *
 * Everything else (the site, the shop) is the same for everyone.
 */
export async function proxy(request: NextRequest) {
  const secure = secureCookies();
  const toBrowser: CookieToSet[] = [];
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!request.cookies.get(ACCESS_COOKIE)?.value && refreshToken) {
    try {
      const res = await fetch(`${API()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });
      if (res.ok) {
        const tokens = ((await res.json()) as { data: TokenPair }).data;
        const fresh = sessionCookies(tokens, secure, Date.now());
        for (const cookie of fresh) request.cookies.set(cookie.name, cookie.value);
        toBrowser.push(...fresh);
      } else if (res.status === 401) {
        const cleared = clearedCookies(secure);
        for (const cookie of cleared) request.cookies.delete(cookie.name);
        toBrowser.push(...cleared);
      }
    } catch {
      // API down: carry on; the page says the shop can't be reached.
    }
  }

  const path = request.nextUrl.pathname;
  const signedIn = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  let response: NextResponse;
  if (!signedIn && needsSession(path)) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", `${path}${request.nextUrl.search}`);
    response = NextResponse.redirect(signIn);
  } else if (signedIn && (path === "/sign-in" || path === "/register")) {
    response = NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get("next")), request.url));
  } else {
    response = NextResponse.next({ request: { headers: request.headers } });
  }
  for (const cookie of toBrowser) response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon|icon|apple-icon|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|woff2?)$).*)"],
};
