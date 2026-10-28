import { CheckCircle2, Globe2, PackageCheck, Truck, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { CancelOrderForm } from "@/components/account/cancel-order-form";
import { PaymentPanel } from "@/components/checkout/payment-panel";
import { orderAgain } from "@/lib/account/actions";
import { askToChange, canCancelOnline, TIMELINE_LABEL } from "@/lib/account/rules";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { api, ApiError } from "@/lib/api/client";
import type { Order } from "@/lib/cart/types";
import { addressLines, countryName } from "@/lib/checkout/address";
import { ORDER_NUMBER, panelState, razorpayScriptUrl, STATUS_TEXT } from "@/lib/checkout/payment";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";
import { getShopRules } from "@/lib/shop/api";
import { rupees } from "@/lib/shop/prices";

export async function generateMetadata({ params }: PageProps<"/account/orders/[number]">): Promise<Metadata> {
  return { title: `Order ${(await params).number.toUpperCase()}` };
}

export default function OrderPage(props: PageProps<"/account/orders/[number]">) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading your order…</p>}>
      <OrderContent {...props} />
    </Suspense>
  );
}

const IST = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" });

async function OrderContent({ params, searchParams }: PageProps<"/account/orders/[number]">) {
  const number = (await params).number.toUpperCase();
  if (!ORDER_NUMBER.test(number)) notFound();
  const here = `/account/orders/${number}`;
  const session = await requireSession(here);
  const query = await searchParams;
  const placed = query.placed === "1";
  const note = typeof query.note === "string" ? query.note : null;

  let order: Order;
  try {
    order = await api<Order>(`/orders/${number}`, { token: session.token });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(here));
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ShopUnavailable />;
  }
  const rules = await getShopRules();
  const state = panelState(order);
  const status = STATUS_TEXT[order.status] ?? { label: order.status, note: "" };
  const abroad = order.shippingAddress.country !== "IN";
  const StatusIcon =
    order.status === "CANCELLED"
      ? XCircle
      : order.status === "AWAITING_SHIPPING_QUOTE"
        ? Globe2
        : order.status === "SHIPPED"
          ? Truck
          : order.status === "DELIVERED"
            ? PackageCheck
            : CheckCircle2;

  return (
    <div className="flex flex-col gap-8">
      <div>
        {placed ? (
          <p role="status" className="mb-4 rounded-2xl bg-jh-bright/15 px-4 py-3 text-jh-navy">
            Thank you, your order is placed. We&apos;ve emailed you the details.
          </p>
        ) : null}
        {query.cancelled === "1" && order.status === "CANCELLED" ? (
          <p role="status" className="mb-4 rounded-2xl bg-jh-bright/15 px-4 py-3 text-jh-navy">
            Your order is cancelled. Nothing was charged.
          </p>
        ) : null}
        {note ? (
          <p role="alert" className="mb-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {note}
          </p>
        ) : null}
        <Link href="/account/orders" className="mb-3 inline-block text-sm text-jh-deep hover:underline">
          ← All orders
        </Link>
        <p className="text-sm text-muted-foreground">Placed {IST.format(new Date(order.placedAt))}</p>
        <h1 className="mt-1 text-4xl font-semibold">Order {order.orderNumber}</h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-border">
          <StatusIcon aria-hidden className="size-4 text-jh-deep" />
          {status.label}
        </p>
        <p className="mt-3 text-muted-foreground">
          {order.status === "CANCELLED" && order.cancellationReason
            ? `This order was cancelled: ${order.cancellationReason}.`
            : status.note}
        </p>
        {order.tracking ? (
          <p className="mt-2 text-sm">
            Sent with {order.tracking.carrier}, tracking number <strong>{order.tracking.trackingNumber}</strong>
            {order.tracking.trackingUrl ? (
              <>
                {" · "}
                <a href={order.tracking.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-jh-deep underline">
                  Track the parcel
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <PaymentPanel
        orderNumber={order.orderNumber}
        amount={order.grandTotal}
        state={state}
        expiresAt={order.expiresAt}
        lastFailureMessage={order.payment.lastFailureMessage}
        online={rules?.payments.online ?? false}
        bankDetails={rules?.payments.bankTransfer.enabled ? rules.payments.bankTransfer.details : []}
        autoStart={placed}
        scriptUrl={razorpayScriptUrl(process.env)}
      />

      <section aria-labelledby="items-title" className="rounded-3xl bg-white p-6 ring-1 ring-border">
        <h2 id="items-title" className="text-2xl font-semibold">
          Items
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-4 first:pt-0">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-jh-light">
                {item.imageUrl ? <Image src={item.imageUrl} alt="" fill unoptimized sizes="64px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <Link href={`/shop/p/${item.productSlug}`} className="font-medium hover:text-jh-deep hover:underline">
                    {item.productName}
                  </Link>
                  <span className="font-semibold tabular-nums">{rupees(item.lineTotal)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.variantLabel} · {item.quantity} × {rupees(item.unitPrice)} per {item.unitLabel}
                  {item.priceTier === "bulk" ? " (bulk price)" : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Items</dt>
            <dd className="tabular-nums">{rupees(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="tabular-nums">
              {order.status === "AWAITING_SHIPPING_QUOTE"
                ? "To be quoted"
                : order.shippingTotal === "0.00"
                  ? "Free"
                  : rupees(order.shippingTotal)}
            </dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>{order.status === "AWAITING_SHIPPING_QUOTE" ? "Total before shipping" : "Total"}</dt>
            <dd className="tabular-nums">{rupees(order.grandTotal)}</dd>
          </div>
        </dl>
        <p className="mt-1 text-xs text-muted-foreground">Includes GST of {rupees(order.taxIncluded)}.</p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="address-title" className="rounded-3xl bg-white p-6 text-sm ring-1 ring-border">
          <h2 id="address-title" className="text-lg font-semibold">
            Delivery {abroad ? "abroad" : "address"}
          </h2>
          <address className="mt-2 flex flex-col not-italic text-muted-foreground">
            {addressLines({ ...order.shippingAddress, countryName: countryName(order.shippingAddress.country) }).map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </address>
        </section>
        {order.notes ? (
          <section aria-labelledby="notes-title" className="rounded-3xl bg-white p-6 text-sm ring-1 ring-border">
            <h2 id="notes-title" className="text-lg font-semibold">
              Your note
            </h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{order.notes}</p>
          </section>
        ) : null}
      </div>

      <section aria-labelledby="timeline-title" className="rounded-3xl bg-white p-6 text-sm ring-1 ring-border">
        <h2 id="timeline-title" className="text-lg font-semibold">
          Timeline
        </h2>
        <ol className="mt-3 flex flex-col gap-3 border-l-2 border-jh-light pl-4">
          {order.timeline.map((step, i) => (
            <li key={i} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full bg-jh-bright" />
              <span className="font-medium">{TIMELINE_LABEL[step.status] ?? step.status}</span>
              <span className="block text-xs text-muted-foreground">
                {IST.format(new Date(step.at))}
                {step.note ? ` · ${step.note}` : ""}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-4">
        {canCancelOnline(order.status) ? <CancelOrderForm orderNumber={order.orderNumber} /> : null}
        {askToChange(order.status) ? (
          <p className="rounded-2xl bg-jh-light px-4 py-3 text-sm">
            Need to change or cancel this order? It&apos;s paid and may already be in the making, so please contact us
            with the contact button and mention {order.orderNumber}.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <form action={orderAgain.bind(null, order.orderNumber)}>
            <button
              type="submit"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-border hover:ring-jh-bright"
            >
              Order again
            </button>
          </form>
          <Link href="/shop" className="text-sm text-jh-deep hover:underline">
            Continue shopping
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Questions about this order? Use the contact button and mention {order.orderNumber}.
        </p>
      </div>
    </div>
  );
}
