"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import type { Address, Order, RazorpayCheckout } from "@/lib/cart/types";
import { getSession, isSessionEnded, rememberCartCount, signInUrl } from "@/lib/session/session";
import { formValues, toFormState, type FormState } from "@/lib/shop/messages";
import { addressBody, ADDRESS_FIELDS } from "./address";
import { checkoutResult, ORDER_NUMBER, paymentOutcome, type PaymentOutcome } from "./payment";

async function token(next: string): Promise<string> {
  const session = await getSession();
  if (!session) redirect(signInUrl(next));
  return session.token;
}

/** A new delivery address; the checkout then uses it. */
export async function saveAddress(_: FormState, form: FormData): Promise<FormState> {
  const values = formValues(form, [...ADDRESS_FIELDS, "isDefault"]);
  let saved: Address;
  try {
    saved = await api<Address>("/addresses", { method: "POST", token: await token("/checkout"), body: addressBody(values) });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/checkout"));
    return toFormState(error, values);
  }
  redirect(`/checkout?address=${saved.id}`);
}

/**
 * Places the order. The key is made when the checkout page is shown, so a
 * double click (or a resend) places one order; the total shown is sent so
 * a price change is never charged unseen.
 */
export async function placeOrder(_: FormState, form: FormData): Promise<FormState> {
  const addressId = String(form.get("addressId") ?? "");
  const notes = String(form.get("notes") ?? "").trim();
  const back = `/checkout?address=${encodeURIComponent(addressId)}`;
  let order: Order;
  try {
    order = await api<Order>("/orders", {
      method: "POST",
      token: await token(back),
      headers: { "Idempotency-Key": String(form.get("key") ?? "") },
      body: {
        addressId,
        notes: notes || undefined,
        expectedGrandTotal: String(form.get("expectedGrandTotal") ?? "") || undefined,
      },
    });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(back));
    if (error instanceof ApiError && error.code === "PRICE_CHANGED") {
      // Show the page again with the new total (and a new key).
      revalidatePath("/checkout");
      redirect(`${back}&changed=1`);
    }
    return toFormState(error, { notes });
  }
  await rememberCartCount(0);
  redirect(`/account/orders/${order.orderNumber}?placed=1`);
}

export type StartResult = { ok: true; checkout: RazorpayCheckout } | { ok: false; outcome: PaymentOutcome; signIn?: string };
export type VerifyResult = { ok: true } | { ok: false; outcome: PaymentOutcome; signIn?: string };

function failure(error: unknown, orderNumber: string): { ok: false; outcome: PaymentOutcome; signIn?: string } {
  if (!(error instanceof ApiError)) throw error;
  if (isSessionEnded(error)) {
    return {
      ok: false,
      signIn: signInUrl(`/account/orders/${orderNumber}`),
      outcome: { kind: "changed", message: "Please sign in again." },
    };
  }
  return { ok: false, outcome: paymentOutcome(error.status, error.code, error.message, error.data) };
}

/** What Razorpay's window needs for this order (the same Razorpay order on every try). */
export async function startPayment(orderNumber: string): Promise<StartResult> {
  const number = String(orderNumber).toUpperCase();
  const session = await getSession();
  if (!ORDER_NUMBER.test(number) || !session) {
    return { ok: false, signIn: signInUrl(`/account/orders/${number}`), outcome: { kind: "changed", message: "Please sign in again." } };
  }
  try {
    const checkout = await api<RazorpayCheckout>(`/orders/${number}/payments/razorpay`, { method: "POST", token: session.token });
    return { ok: true, checkout };
  } catch (error) {
    return failure(error, number);
  }
}

/** Razorpay's success result, checked by the API; the order is then confirmed. */
export async function verifyPayment(orderNumber: string, raw: unknown): Promise<VerifyResult> {
  const number = String(orderNumber).toUpperCase();
  const session = await getSession();
  if (!ORDER_NUMBER.test(number) || !session) {
    return { ok: false, signIn: signInUrl(`/account/orders/${number}`), outcome: { kind: "changed", message: "Please sign in again." } };
  }
  const result = checkoutResult(raw);
  if (!result) return { ok: false, outcome: paymentOutcome(400, "PAYMENT_VERIFICATION_FAILED", "") };
  try {
    await api(`/orders/${number}/payments/razorpay/verify`, { method: "POST", token: session.token, body: result });
    return { ok: true };
  } catch (error) {
    return failure(error, number);
  }
}
