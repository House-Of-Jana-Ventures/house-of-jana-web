"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import type { Address, Cart, Order } from "@/lib/cart/types";
import { addressBody, ADDRESS_FIELDS, internationalPhone } from "@/lib/checkout/address";
import { ORDER_NUMBER } from "@/lib/checkout/payment";
import { clearedCookies, secureCookies, sessionCookies, whoCookie, type TokenPair } from "@/lib/session/cookies";
import { getSession, isSessionEnded, rememberCartCount, signInUrl } from "@/lib/session/session";
import { formValues, toFormState, type FormState } from "@/lib/shop/messages";
import { orderAgainNote } from "./rules";

async function sessionToken(back: string): Promise<string> {
  const session = await getSession();
  if (!session) redirect(signInUrl(back));
  return session.token;
}

/** Runs an API call for a form; an ended session goes to sign in, other refusals to the form. */
async function attempt(back: string, values: Record<string, string> | undefined, run: (token: string) => Promise<unknown>) {
  try {
    await run(await sessionToken(back));
    return null;
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(back));
    return toFormState(error, values);
  }
}

/** Cancel an unpaid order (the reason is optional). */
export async function cancelOrder(orderNumber: string, _: FormState, form: FormData): Promise<FormState> {
  const number = orderNumber.toUpperCase();
  if (!ORDER_NUMBER.test(number)) return { ok: false, message: "Unknown order." };
  const back = `/account/orders/${number}`;
  const reason = String(form.get("reason") ?? "").trim() || "Cancelled by the buyer";
  const failed = await attempt(back, { reason }, (token) =>
    api(`/orders/${number}/cancel`, { method: "POST", token, body: { reason } }),
  );
  if (failed) return failed;
  revalidatePath("/account", "layout");
  // The page says so (the form itself goes away once the order is cancelled).
  redirect(`${back}?cancelled=1`);
}

/** Puts an order's items back in the cart; items no longer sold are skipped and named. */
export async function orderAgain(orderNumber: string): Promise<void> {
  const number = orderNumber.toUpperCase();
  const back = `/account/orders/${number}`;
  const token = await sessionToken(back);
  let order: Order;
  try {
    order = await api<Order>(`/orders/${number}`, { token });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(back));
    redirect(`${back}?note=${encodeURIComponent("That didn't work. Please try again.")}`);
  }
  let added = 0;
  let cart: Cart | null = null;
  const skipped: string[] = [];
  for (const item of order.items) {
    try {
      cart = await api<Cart>("/cart/items", { method: "POST", token, body: { variantId: item.variantId, quantity: item.quantity } });
      added += 1;
    } catch (error) {
      if (isSessionEnded(error)) redirect(signInUrl(back));
      skipped.push(`${item.productName} (${item.variantLabel})`);
    }
  }
  if (cart) await rememberCartCount(cart.itemCount);
  revalidatePath("/", "layout");
  redirect(`/cart?${added > 0 ? "added" : "note"}=${encodeURIComponent(orderAgainNote(added, skipped))}`);
}

/** Adds an address (`id` empty) or saves changes to one. */
export async function saveBookAddress(id: string, _: FormState, form: FormData): Promise<FormState> {
  const values = formValues(form, [...ADDRESS_FIELDS, "isDefault"]);
  const body: Record<string, string | boolean | null> = addressBody(values);
  if (id) {
    // Optional fields left empty are cleared on an edit.
    for (const name of ["company", "gstNumber", "line2", "landmark", "state"]) if (!(name in body)) body[name] = null;
  }
  const failed = await attempt("/account/addresses", values, (token) =>
    id
      ? api<Address>(`/addresses/${id}`, { method: "PATCH", token, body })
      : api<Address>("/addresses", { method: "POST", token, body }),
  );
  if (failed) return failed;
  revalidatePath("/account/addresses");
  redirect(`/account/addresses?note=${id ? "saved" : "added"}`);
}

/** Address book buttons: make default, delete. Work without JavaScript. */
export async function addressCommand(form: FormData): Promise<void> {
  const id = String(form.get("id") ?? "");
  const command = String(form.get("command") ?? "");
  let note = "";
  const failed = await attempt("/account/addresses", undefined, (token) =>
    command === "delete"
      ? api(`/addresses/${encodeURIComponent(id)}`, { method: "DELETE", token })
      : api(`/addresses/${encodeURIComponent(id)}`, { method: "PATCH", token, body: { isDefault: true } }),
  );
  note = failed ? (failed.message ?? "That didn't work.") : command === "delete" ? "deleted" : "default";
  revalidatePath("/account/addresses");
  redirect(`/account/addresses?note=${encodeURIComponent(note)}`);
}

const PROFILE_FIELDS = ["firstName", "lastName", "phone", "companyName", "gstNumber"] as const;

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const values = formValues(form, PROFILE_FIELDS);
  const orNull = (value: string) => value.trim() || null;
  const failed = await attempt("/account/profile", values, (token) =>
    api("/profile", {
      method: "PATCH",
      token,
      body: {
        firstName: values.firstName.trim(),
        lastName: orNull(values.lastName),
        phone: values.phone.trim() ? internationalPhone(values.phone) : null,
        companyName: orNull(values.companyName),
        gstNumber: orNull(values.gstNumber),
      },
    }),
  );
  if (failed) return failed;
  // The header shows the first name.
  const who = whoCookie(values.firstName, secureCookies());
  (await cookies()).set(who.name, who.value, who.options);
  revalidatePath("/", "layout");
  return { ok: true, message: "Your details are saved.", values };
}

/** Changes the password; other devices are signed out, this one stays signed in. */
export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  if (newPassword !== String(form.get("confirmPassword") ?? ""))
    return { ok: false, errors: { confirmPassword: ["The two new passwords don't match."] } };
  let tokens: TokenPair | null = null;
  const failed = await attempt("/account/password", undefined, async (token) => {
    tokens = await api<TokenPair>("/auth/change-password", { method: "POST", token, body: { currentPassword, newPassword } });
  });
  if (failed) return failed;
  const jar = await cookies();
  for (const cookie of sessionCookies(tokens!, secureCookies(), Date.now())) jar.set(cookie.name, cookie.value, cookie.options);
  return { ok: true, message: "Password changed. You're still signed in here; other devices were signed out." };
}

/** Signs out on every device, this one too. */
export async function signOutEverywhere(): Promise<void> {
  const session = await getSession();
  if (session) {
    await api("/auth/logout-all", { method: "POST", token: session.token }).catch((error) => {
      if (!(error instanceof ApiError)) throw error;
    });
  }
  const jar = await cookies();
  for (const cookie of clearedCookies(secureCookies())) jar.set(cookie.name, cookie.value, cookie.options);
  revalidatePath("/", "layout");
  redirect("/sign-in?note=signed-out-everywhere");
}
