import { KeyRound, MapPin, Package, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrderRow } from "@/components/account/order-row";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { api } from "@/lib/api/client";
import type { OrderSummary } from "@/lib/cart/types";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <Overview />
    </Suspense>
  );
}

const LINKS = [
  { href: "/account/orders", label: "Orders", note: "Pay, follow and order again", icon: Package },
  { href: "/account/addresses", label: "Addresses", note: "Delivery addresses in India and abroad", icon: MapPin },
  { href: "/account/profile", label: "Your details", note: "Name, phone, company and GSTIN", icon: UserRound },
  { href: "/account/password", label: "Password", note: "Change it, or sign out everywhere", icon: KeyRound },
];

async function Overview() {
  const session = await requireSession("/account");
  let waiting: OrderSummary[];
  let recent: OrderSummary[];
  try {
    [waiting, recent] = await Promise.all([
      api<OrderSummary[]>("/orders?status=AWAITING_SHIPPING_QUOTE,PENDING_PAYMENT&limit=10", { token: session.token }),
      api<OrderSummary[]>("/orders?limit=3", { token: session.token }),
    ]);
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/account"));
    return <ShopUnavailable />;
  }
  const toPay = waiting.filter((o) => o.status === "PENDING_PAYMENT");
  const quoting = waiting.filter((o) => o.status === "AWAITING_SHIPPING_QUOTE");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-semibold">Hello{session.firstName ? `, ${session.firstName}` : ""}</h1>

      {toPay.length > 0 || quoting.length > 0 ? (
        <section aria-labelledby="waiting-title" className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200 sm:p-6">
          <h2 id="waiting-title" className="text-xl font-semibold">
            Waiting for something
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {toPay.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.orderNumber}`} className="font-semibold text-jh-deep hover:underline">
                  {o.orderNumber}
                </Link>{" "}
                is waiting for your payment.
              </li>
            ))}
            {quoting.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.orderNumber}`} className="font-semibold text-jh-deep hover:underline">
                  {o.orderNumber}
                </Link>{" "}
                is waiting for our shipping quote; we&apos;ll email you.
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="recent-title">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="recent-title" className="text-2xl font-semibold">
            Recent orders
          </h2>
          {recent.length > 0 ? (
            <Link href="/account/orders" className="text-sm text-jh-deep hover:underline">
              All orders
            </Link>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <p className="mt-3 text-muted-foreground">
            No orders yet.{" "}
            <Link href="/shop" className="text-jh-deep hover:underline">
              Browse the shop
            </Link>
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {recent.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </ul>
        )}
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex h-full gap-3 rounded-2xl bg-white p-4 ring-1 ring-border transition hover:ring-jh-bright">
              <l.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-jh-deep" />
              <span>
                <span className="block font-semibold">{l.label}</span>
                <span className="text-sm text-muted-foreground">{l.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
