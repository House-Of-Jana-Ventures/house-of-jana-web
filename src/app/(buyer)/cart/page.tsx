import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CartGroups } from "@/components/cart/cart-groups";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { api } from "@/lib/api/client";
import { pieces } from "@/lib/cart/rules";
import type { Cart } from "@/lib/cart/types";
import { redirect } from "next/navigation";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";
import { rupees } from "@/lib/shop/prices";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage(props: PageProps<"/cart">) {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold">Your cart</h1>
        <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading your cart…</p>}>
          <CartContent {...props} />
        </Suspense>
      </div>
    </section>
  );
}

async function CartContent({ searchParams }: PageProps<"/cart">) {
  const session = await requireSession("/cart");
  const params = await searchParams;
  const note = typeof params.note === "string" ? params.note : "";
  // After "Order again" on an order page.
  const added = typeof params.added === "string" ? params.added : "";
  const notes = (
    <>
      {added ? (
        <p role="status" className="mb-4 rounded-2xl bg-jh-bright/15 px-4 py-3 text-sm text-jh-navy">
          {added}
        </p>
      ) : null}
      {note ? (
        <p role="alert" className="mb-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {note}
        </p>
      ) : null}
    </>
  );
  let cart: Cart;
  try {
    cart = await api<Cart>("/cart", { token: session.token });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/cart"));
    return (
      <div className="mt-8">
        <ShopUnavailable />
      </div>
    );
  }
  if (cart.lines.length === 0) {
    return (
      <div className="mt-8">
        {notes}
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center ring-1 ring-border">
          <ShoppingBag aria-hidden className="size-10 text-jh-deep" strokeWidth={1.5} />
          <p className="text-lg">Your cart is empty.</p>
          <Link href="/shop" className="rounded-sm bg-jh-bright px-6 py-3 font-semibold text-jh-navy hover:bg-jh-bright/85">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        {notes}
        <CartGroups cart={cart} />
      </div>
      <aside aria-label="Summary" className="h-fit rounded-3xl bg-white p-6 ring-1 ring-border lg:sticky lg:top-28">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt>Items</dt>
            <dd className="tabular-nums">{pieces(cart.itemCount)}</dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{rupees(cart.subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          Prices include GST. Shipping is worked out at checkout (quoted by us for orders outside India).
        </p>
        {cart.readyForCheckout ? (
          <Link
            href="/checkout"
            className="mt-5 flex h-12 items-center justify-center rounded-sm bg-jh-bright font-semibold text-jh-navy hover:bg-jh-bright/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-navy"
          >
            Checkout
          </Link>
        ) : (
          <p role="status" className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Fix the items marked above to continue.
          </p>
        )}
        <Link href="/shop" className="mt-3 block text-center text-sm text-jh-deep hover:underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
