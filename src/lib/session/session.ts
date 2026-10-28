import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import {
  ACCESS_COOKIE,
  CART_COOKIE,
  cartCookie,
  decodeWho,
  readCartCount,
  secureCookies,
  WHO_COOKIE,
} from "./cookies";

export interface Session {
  firstName: string;
  /** For API calls on the buyer's behalf (server only). */
  token: string;
  cartCount: number;
}

/**
 * The signed-in buyer, from the cookies (`proxy.ts` has already refreshed
 * them if needed), or null. Reading cookies makes the caller personal, so
 * it must sit inside a <Suspense> boundary.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return { token, firstName: decodeWho(jar.get(WHO_COOKIE)?.value), cartCount: readCartCount(jar.get(CART_COOKIE)?.value) };
}

/** Sign-in page that comes back to `next`. */
export const signInUrl = (next: string) => `/sign-in?next=${encodeURIComponent(next)}`;

/** The buyer's session, or off to sign in (and back to `next` afterwards). */
export async function requireSession(next: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(signInUrl(next));
  return session;
}

/** The API said the session has ended (signed out elsewhere, suspended…): sign in again. */
export function isSessionEnded(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.code === "ACCOUNT_SUSPENDED");
}

/** Keeps the header's cart badge in step (server actions only). */
export async function rememberCartCount(pieces: number): Promise<void> {
  const cookie = cartCookie(pieces, secureCookies());
  (await cookies()).set(cookie.name, cookie.value, cookie.options);
}
