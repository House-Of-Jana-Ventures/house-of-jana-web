"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import type { Cart } from "@/lib/cart/types";
import { internationalPhone } from "@/lib/checkout/address";
import { formValues, toFormState, type FormState } from "@/lib/shop/messages";
import {
  clearedCookies,
  cartCookie,
  REFRESH_COOKIE,
  safeNext,
  secureCookies,
  sessionCookies,
  type TokenPair,
} from "./cookies";
import { getSession } from "./session";
import { parsePendingAdd, withAdded } from "./pending-add";

/** The header (in the root layout) shows who is signed in: after signing in or out, everything is drawn again. */
const redrawAll = () => revalidatePath("/", "layout");

async function keep(tokens: TokenPair) {
  const jar = await cookies();
  for (const cookie of sessionCookies(tokens, secureCookies(), Date.now())) jar.set(cookie.name, cookie.value, cookie.options);
}

/**
 * After signing in or registering: the item the buyer wanted to add before
 * signing in goes into the cart, and the cart badge is brought up to date.
 * Returns whether an item was added.
 */
async function settleCart(token: string, pending: string): Promise<boolean> {
  const add = parsePendingAdd(pending);
  let cart: Cart | null = null;
  let added = false;
  if (add) {
    try {
      cart = await api<Cart>("/cart/items", { method: "POST", token, body: add });
      added = true;
    } catch {
      // Sold out or switched off meanwhile: the product page shows why.
    }
  }
  cart ??= await api<Cart>("/cart", { token }).catch(() => null);
  if (cart) {
    const cookie = cartCookie(cart.itemCount, secureCookies());
    (await cookies()).set(cookie.name, cookie.value, cookie.options);
  }
  return added;
}

const SIGN_IN_FIELDS = ["email"] as const;

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const values = formValues(form, SIGN_IN_FIELDS);
  if (!email || !password) return { ok: false, message: "Enter your email and password.", values };
  let tokens: TokenPair;
  try {
    tokens = await api<TokenPair>("/auth/login", { method: "POST", body: { email, password } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401)
      return { ok: false, message: "That email and password don't match an account.", values };
    return toFormState(error, values);
  }
  await keep(tokens);
  const added = await settleCart(tokens.accessToken, String(form.get("add") ?? ""));
  redrawAll();
  redirect(withAdded(safeNext(String(form.get("next") ?? "")), added));
}

const REGISTER_FIELDS = ["firstName", "lastName", "email", "phone", "companyName"] as const;

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const values = formValues(form, REGISTER_FIELDS);
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("confirmPassword") ?? ""))
    return { ok: false, errors: { confirmPassword: ["The two passwords don't match."] }, values };
  // The API keeps the phone optional; the shop needs it to reach buyers about orders.
  if (!values.phone.trim()) return { ok: false, errors: { phone: ["Enter a phone number."] }, values };
  const optional = (value: string) => (value.trim() ? value.trim() : undefined);
  let tokens: TokenPair;
  try {
    tokens = await api<TokenPair>("/auth/register", {
      method: "POST",
      body: {
        email: values.email.trim(),
        password,
        firstName: values.firstName.trim(),
        lastName: optional(values.lastName),
        phone: internationalPhone(values.phone),
        companyName: optional(values.companyName),
      },
    });
  } catch (error) {
    return toFormState(error, values);
  }
  await keep(tokens);
  const added = await settleCart(tokens.accessToken, String(form.get("add") ?? ""));
  redrawAll();
  redirect(withAdded(safeNext(String(form.get("next") ?? "")), added));
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  const session = await getSession();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (session && refreshToken) {
    await api("/auth/logout", { method: "POST", token: session.token, body: { refreshToken } }).catch(() => undefined);
  }
  for (const cookie of clearedCookies(secureCookies())) jar.set(cookie.name, cookie.value, cookie.options);
  redrawAll();
  redirect("/shop");
}

export async function forgotPassword(_: FormState, form: FormData): Promise<FormState> {
  const values = formValues(form, ["email"]);
  if (!values.email.trim()) return { ok: false, errors: { email: ["Enter your email."] }, values };
  try {
    await api("/auth/forgot-password", { method: "POST", body: { email: values.email.trim() } });
  } catch (error) {
    return toFormState(error, values);
  }
  return {
    ok: true,
    message: `If there's an account for ${values.email.trim()}, we've emailed a link to choose a new password. It works for 60 minutes. Check your spam folder too.`,
  };
}

export async function resetPassword(_: FormState, form: FormData): Promise<FormState> {
  const token = String(form.get("token") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  if (newPassword !== String(form.get("confirmPassword") ?? ""))
    return { ok: false, errors: { confirmPassword: ["The two passwords don't match."] } };
  try {
    await api("/auth/reset-password", { method: "POST", body: { token, newPassword } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400 && error.errors.some((e) => e.field === "token"))
      return toFormState(new ApiError(422, "INVALID_RESET_TOKEN", ""));
    return toFormState(error);
  }
  // Every session was signed out by the reset, this browser's too.
  const jar = await cookies();
  for (const cookie of clearedCookies(secureCookies())) jar.set(cookie.name, cookie.value, cookie.options);
  redrawAll();
  redirect("/sign-in?note=password-changed");
}
