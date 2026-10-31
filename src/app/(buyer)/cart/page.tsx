import { ArrowRight, Layers, Lock, MessageCircle, Palette, Percent, Phone, ShoppingBag, Sparkles, Truck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { CartGroups } from "@/components/cart/cart-groups";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { site, telHref } from "@/content/site";
import { api } from "@/lib/api/client";
import { groupByProduct, pieces } from "@/lib/cart/rules";
import type { Cart } from "@/lib/cart/types";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";
import { rupees } from "@/lib/shop/prices";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your cart" };

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/** The real order steps (in place of the design's KYC, proforma and SWIFT steps). */
const STEPS = [
  { title: "Your cart", note: "Check items and prices" },
  { title: "Delivery address", note: "Where we send it" },
  { title: "Place the order", note: "Confirm the total" },
  { title: "Pay", note: "Online or bank transfer" },
];

/**
 * The cart (owner's design, phase J4): the order steps, how close each
 * product is to its bulk price, the items, and the summary. The design's
 * kg weights, dollar tiers, rebates, letters of credit, tax-ID box, proforma
 * PDF, free swatch ring and lab claims are left out.
 */
export default function CartPage(props: PageProps<"/cart">) {
  return (
    <>
      <section className="w-full bg-white px-4 py-8 shadow-[0_4px_20px_rgba(11,37,69,0.04)] sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className={`${EYEBROW} text-jh-deep`}>
            <Link href="/shop" className="hover:underline">
              Shop
            </Link>{" "}
            <span className="text-muted-foreground">/ Your cart</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-jh-navy sm:text-4xl">Your cart</h1>
          <p className="mt-1 text-muted-foreground">Check your items, quantities and prices, then go to checkout.</p>
        </div>
      </section>
      <div className="w-full bg-jh-light px-4 py-5 sm:px-6">
        <ol aria-label="Order steps" className="mx-auto grid max-w-6xl grid-cols-2 gap-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              aria-current={i === 0 ? "step" : undefined}
              className={cn("flex items-center gap-3 rounded-xl p-3", i === 0 ? "bg-white shadow-sm" : "bg-white/50")}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  i === 0 ? "bg-jh-navy text-white" : "bg-jh-light text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className={cn("block truncate text-sm font-semibold", i === 0 ? "text-jh-navy" : "text-muted-foreground")}>
                  {step.title}
                </span>
                <span className={cn("block truncate text-xs", i === 0 ? "text-jh-deep" : "text-muted-foreground")}>{step.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <section className="w-full px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<p className="text-muted-foreground">Loading your cart…</p>}>
            <CartContent {...props} />
          </Suspense>
        </div>
      </section>
    </>
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
        <p role="status" className="mb-4 rounded-xl bg-jh-bright/15 px-4 py-3 text-sm text-jh-navy">
          {added}
        </p>
      ) : null}
      {note ? (
        <p role="alert" className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
    return <ShopUnavailable />;
  }
  if (cart.lines.length === 0) {
    return (
      <>
        {notes}
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-border">
          <ShoppingBag aria-hidden className="size-10 text-jh-deep" strokeWidth={1.5} />
          <p className="text-lg">Your cart is empty.</p>
          <Link href="/shop" className="rounded-lg bg-jh-navy px-6 py-3 font-semibold text-white hover:bg-jh-deep">
            Browse the shop
          </Link>
        </div>
      </>
    );
  }

  const groups = groupByProduct(cart);
  return (
    <div className="flex flex-col gap-8">
      <BulkMeter groups={groups} />
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-8">
          {notes}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-jh-navy">Your items</h2>
            <span className="rounded-full bg-jh-light px-2.5 py-0.5 text-xs font-semibold text-jh-navy">
              {cart.lines.length} {cart.lines.length === 1 ? "line" : "lines"}
            </span>
          </div>
          <CartGroups cart={cart} />
          <ul className="grid gap-4 rounded-xl bg-jh-light p-5 sm:grid-cols-3">
            <Assurance icon={<Sparkles aria-hidden className="size-6 shrink-0 text-jh-deep" />} title="Temple-sourced hair">
              Single-donor temple hair, alongside Non-Remy hair for affordable volume.
            </Assurance>
            <Assurance icon={<Layers aria-hidden className="size-6 shrink-0 text-jh-deep" />} title="Sorted by hand">
              Our artisans in Purba Midnapore sort and draw every bundle.
            </Assurance>
            <Assurance icon={<Palette aria-hidden className="size-6 shrink-0 text-jh-deep" />} title="Colour and labels">
              Custom bleaching and private labelling on request.
            </Assurance>
          </ul>
        </div>

        <aside aria-label="Summary" className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4">
          <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-lg ring-1 ring-border">
            <div>
              <p className={`${EYEBROW} text-jh-deep`}>Before checkout</p>
              <h2 className="text-2xl font-semibold text-jh-navy">Order summary</h2>
            </div>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Items</dt>
                <dd className="font-semibold text-jh-navy tabular-nums">{pieces(cart.itemCount)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <dt className="text-lg font-bold text-jh-navy">Subtotal</dt>
                <dd className="font-heading text-2xl font-bold text-jh-navy tabular-nums">{rupees(cart.subtotal)}</dd>
              </div>
            </dl>
            <p className="-mt-2 text-xs text-muted-foreground">
              Prices include GST. Shipping is worked out at checkout (quoted by us for orders outside India).
            </p>
            {cart.readyForCheckout ? (
              <Link
                href="/checkout"
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-jh-navy font-semibold text-white shadow-md transition-colors hover:bg-jh-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
              >
                <Lock aria-hidden className="size-4" />
                Checkout
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            ) : (
              <p role="status" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Fix the items marked above to continue.
              </p>
            )}
            <Link href="/shop" className="-mt-2 text-center text-sm text-jh-deep hover:underline">
              Continue shopping
            </Link>
            <ul className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Wallet aria-hidden className="size-4 shrink-0 text-jh-deep" />
                Pay online with UPI, cards or net banking, or by bank transfer for bulk orders
              </li>
              <li className="flex items-center gap-2">
                <Truck aria-hidden className="size-4 shrink-0 text-jh-deep" />
                Shipped across India and to 4 continents
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-jh-light p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-jh-deep shadow-sm">
                <MessageCircle aria-hidden className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-jh-navy">Need a colour or your own label?</p>
                <p className="text-xs text-muted-foreground">Call or WhatsApp us first.</p>
              </div>
            </div>
            <a
              href={telHref(site.phones[0])}
              aria-label={`Call ${site.phones[0]}`}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-jh-navy shadow-sm hover:bg-muted"
            >
              <Phone aria-hidden className="size-4" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** How close each product is to its bulk price (the design's tier meter, with the shop's real rule). */
function BulkMeter({ groups }: { groups: ReturnType<typeof groupByProduct> }) {
  return (
    <section aria-labelledby="bulk-heading" className="flex flex-col gap-4 rounded-xl bg-jh-navy p-6 text-white shadow-md">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className={`${EYEBROW} flex items-center gap-1.5 text-white`}>
            <Percent aria-hidden className="size-4 text-jh-bright" /> Automatic bulk prices
          </p>
          <h2 id="bulk-heading" className="mt-1 text-xl font-semibold">
            Your bulk prices
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-jh-bright px-4 py-2 text-sm font-bold text-jh-navy hover:bg-white sm:self-auto"
        >
          Browse the shop
        </Link>
      </div>
      <ul className="flex flex-col gap-4">
        {groups.map(({ product }) => {
          const done = product.tier === "bulk";
          const pct = done ? 100 : Math.min(100, Math.round((product.quantity / Math.max(1, product.bulkMinQty)) * 100));
          return (
            <li key={product.productId} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold">{product.productName}</span>
                <span className="text-white/80 tabular-nums">
                  {done ? `Bulk price on ${product.quantity} pieces` : `${product.quantity} of ${product.bulkMinQty} pieces · ${product.toBulk} to go`}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${product.productName}: towards the bulk price`}
                aria-valuemin={0}
                aria-valuemax={product.bulkMinQty}
                aria-valuenow={Math.min(product.quantity, product.bulkMinQty)}
                className="h-2.5 overflow-hidden rounded-full bg-white/15"
              >
                <div className={cn("h-full rounded-full", done ? "bg-jh-bright" : "bg-white/80")} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Assurance({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {icon}
      <div>
        <p className="font-semibold text-jh-navy">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
