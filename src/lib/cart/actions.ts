"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api/client";
import { pendingAdd } from "@/lib/session/pending-add";
import { getSession, isSessionEnded, rememberCartCount, signInUrl } from "@/lib/session/session";
import { friendlyMessage, isErrorLike } from "@/lib/shop/messages";
import type { Cart } from "./types";

export type CartResult =
  | { ok: true; cart: Cart }
  | { ok: false; message: string }
  /** Signed out: sign in (or register) first, then the item is added. */
  | { ok: false; signIn: string };

const VARIANT = /^[0-9a-f-]{36}$/i;

function failed(error: unknown): { ok: false; message: string } {
  if (!isErrorLike(error)) throw error;
  return { ok: false, message: friendlyMessage(error) };
}

/**
 * "Add to cart" on a product page. `back` is the product page to return to
 * after signing in (with the item then added).
 */
export async function addToCart(variantId: string, quantity: number, back: string): Promise<CartResult> {
  const session = await getSession();
  const next = back.startsWith("/shop/") ? back : "/shop";
  const signIn = `${signInUrl(next)}&add=${encodeURIComponent(pendingAdd(variantId, quantity))}`;
  if (!session) return { ok: false, signIn };
  if (!VARIANT.test(variantId) || !Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, message: "Choose a quantity of 1 or more." };
  }
  try {
    const cart = await api<Cart>("/cart/items", { method: "POST", token: session.token, body: { variantId, quantity } });
    await rememberCartCount(cart.itemCount);
    return { ok: true, cart };
  } catch (error) {
    if (isSessionEnded(error)) return { ok: false, signIn };
    return failed(error);
  }
}

/** The cart, for the drawer (null when signed out or the shop can't be reached). */
export async function loadCart(): Promise<Cart | null> {
  const session = await getSession();
  if (!session) return null;
  try {
    const cart = await api<Cart>("/cart", { token: session.token });
    await rememberCartCount(cart.itemCount);
    return cart;
  } catch {
    return null;
  }
}

/** A cart page form: change a line's quantity (0 removes it). Works without JavaScript. */
export async function changeLine(form: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect(signInUrl("/cart"));
  const lineId = String(form.get("lineId") ?? "");
  const quantity = Math.floor(Number(form.get("quantity")));
  let note = "";
  try {
    const cart =
      Number.isFinite(quantity) && quantity >= 1
        ? await api<Cart>(`/cart/items/${encodeURIComponent(lineId)}`, {
            method: "PATCH",
            token: session.token,
            body: { quantity },
          })
        : await api<Cart>(`/cart/items/${encodeURIComponent(lineId)}`, { method: "DELETE", token: session.token });
    await rememberCartCount(cart.itemCount);
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/cart"));
    note = failed(error).message;
  }
  revalidatePath("/cart");
  if (note) redirect(`/cart?note=${encodeURIComponent(note)}`);
}

/** Drawer and cart page: change a line from JavaScript and get the cart back. */
export async function setLineQuantity(lineId: string, quantity: number): Promise<CartResult> {
  const session = await getSession();
  if (!session) return { ok: false, signIn: signInUrl("/cart") };
  try {
    const cart =
      quantity >= 1
        ? await api<Cart>(`/cart/items/${encodeURIComponent(lineId)}`, {
            method: "PATCH",
            token: session.token,
            body: { quantity: Math.floor(quantity) },
          })
        : await api<Cart>(`/cart/items/${encodeURIComponent(lineId)}`, { method: "DELETE", token: session.token });
    await rememberCartCount(cart.itemCount);
    return { ok: true, cart };
  } catch (error) {
    if (isSessionEnded(error)) return { ok: false, signIn: signInUrl("/cart") };
    return failed(error);
  }
}
