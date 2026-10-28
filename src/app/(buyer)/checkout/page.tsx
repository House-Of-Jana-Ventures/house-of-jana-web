import { randomUUID } from "node:crypto";
import { AlertTriangle, Check, MapPin, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { CartGroups } from "@/components/cart/cart-groups";
import { AddressForm } from "@/components/checkout/address-form";
import { PlaceOrderForm } from "@/components/checkout/place-order-form";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { api } from "@/lib/api/client";
import type { Address, CheckoutPreview } from "@/lib/cart/types";
import { addressLines, countries } from "@/lib/checkout/address";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";
import { getShopRules } from "@/lib/shop/api";
import { rupees } from "@/lib/shop/prices";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage(props: PageProps<"/checkout">) {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold">Checkout</h1>
        <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading…</p>}>
          <Checkout {...props} />
        </Suspense>
      </div>
    </section>
  );
}

interface Profile {
  firstName: string;
  lastName: string | null;
  phone: string | null;
  companyName: string | null;
}

async function Checkout({ searchParams }: PageProps<"/checkout">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const back = `/checkout${one(params.address) ? `?address=${encodeURIComponent(one(params.address))}` : ""}`;
  const session = await requireSession(back);

  let addresses: Address[];
  let preview: CheckoutPreview;
  let profile: Profile | null;
  try {
    [addresses, profile] = await Promise.all([
      api<Address[]>("/addresses", { token: session.token }),
      api<Profile>("/profile", { token: session.token }).catch(() => null),
    ]);
    const wanted = addresses.find((a) => a.id === one(params.address));
    const chosen = wanted ?? addresses.find((a) => a.isDefault) ?? addresses[0];
    preview = await api<CheckoutPreview>("/checkout/preview", {
      method: "POST",
      token: session.token,
      body: chosen ? { addressId: chosen.id } : {},
    });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(back));
    return (
      <div className="mt-8">
        <ShopUnavailable />
      </div>
    );
  }
  if (preview.lines.length === 0) redirect("/cart");
  const rules = await getShopRules();
  const address = preview.address;
  const adding = one(params.new) === "1" || addresses.length === 0;
  const abroad = address !== null && address.country !== "IN";
  const blocking = preview.problems.filter((p) => p.code !== "ADDRESS_REQUIRED");

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-8">
        {one(params.changed) === "1" ? (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            The total changed since you opened the checkout (a price or the stock changed). Please check the order
            below and place it again.
          </p>
        ) : null}

        <Step number={1} title="Delivery address">
          {addresses.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {addresses.map((a) => {
                const chosen = a.id === address?.id;
                return (
                  <li key={a.id}>
                    <Link
                      href={`/checkout?address=${a.id}`}
                      aria-current={chosen ? "true" : undefined}
                      scroll={false}
                      className={cn(
                        "flex h-full gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-border transition hover:ring-jh-bright",
                        chosen && "ring-2 ring-jh-bright",
                      )}
                    >
                      {chosen ? (
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-deep" />
                      ) : (
                        <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="flex flex-col">
                        {addressLines(a).map((line, i) => (
                          <span key={i} className={i === 0 ? "font-semibold" : "text-muted-foreground"}>
                            {line}
                          </span>
                        ))}
                        {chosen ? <span className="sr-only">(chosen)</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {adding ? (
            <div className={cn(addresses.length > 0 && "mt-5 rounded-3xl bg-white p-5 ring-1 ring-border sm:p-6")}>
              {addresses.length > 0 ? <h3 className="mb-4 text-lg font-semibold">A new address</h3> : null}
              <AddressForm
                countries={countries()}
                defaults={{
                  fullName: profile ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") : "",
                  phone: profile?.phone ?? "",
                  company: profile?.companyName ?? "",
                }}
              />
            </div>
          ) : addresses.length < 10 ? (
            <Link
              href={`/checkout?${address ? `address=${address.id}&` : ""}new=1`}
              scroll={false}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-jh-deep hover:underline"
            >
              <Plus aria-hidden className="size-4" /> Add another address
            </Link>
          ) : null}
        </Step>

        <Step number={2} title="Your order">
          <CartGroups cart={{ ...preview, itemCount: 0, subtotal: preview.totals.subtotal, currency: "INR", bulkMinQty: rules?.bulkMinQty ?? 25, readyForCheckout: preview.canPlaceOrder }} editable={false} />
          <Link href="/cart" className="mt-3 inline-block text-sm text-jh-deep hover:underline">
            Change quantities in the cart
          </Link>
        </Step>
      </div>

      <aside aria-label="Total" className="h-fit rounded-3xl bg-white p-6 ring-1 ring-border lg:sticky lg:top-28">
        <h2 className="text-xl font-semibold">Total</h2>
        <dl className="mt-4 flex flex-col gap-2 text-sm">
          <Row label="Items" value={rupees(preview.totals.subtotal)} />
          <Row
            label="Shipping"
            value={
              !address
                ? "After choosing an address"
                : preview.shippingQuoteNeeded
                  ? "Quoted by us"
                  : preview.totals.shipping === "0.00"
                    ? "Free"
                    : rupees(preview.totals.shipping)
            }
          />
          <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-semibold">
            <dt>{preview.shippingQuoteNeeded ? "Total before shipping" : "Total"}</dt>
            <dd className="tabular-nums">{rupees(preview.totals.grandTotal)}</dd>
          </div>
        </dl>
        <p className="mt-1 text-xs text-muted-foreground">Includes GST of {rupees(preview.totals.gstIncluded)}.</p>
        {preview.amountToFreeShipping && preview.amountToFreeShipping !== "0.00" && !abroad ? (
          <p className="mt-3 rounded-2xl bg-jh-light px-3 py-2 text-sm">
            Add {rupees(preview.amountToFreeShipping)} more for free shipping in India.
          </p>
        ) : null}

        {blocking.length > 0 ? (
          <ul role="alert" className="mt-4 flex flex-col gap-2">
            {blocking.map((p, i) => (
              <li key={i} className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" /> {p.message}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5">
          {address && preview.canPlaceOrder ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {abroad
                  ? `As this ships outside India, we'll email you the shipping cost (usually within one working day). You pay after that, within ${rules?.abroad.paymentWindowHours ?? 72} hours.`
                  : `Next, you pay ${payWays(rules?.payments)}, within ${rules?.india.paymentWindowHours ?? 24} hours.`}
              </p>
              <PlaceOrderForm
                addressId={address.id}
                expectedGrandTotal={preview.totals.grandTotal}
                orderKey={`checkout-${randomUUID()}`}
                label={abroad ? "Place order, get a shipping quote" : "Place order"}
              />
            </>
          ) : !address ? (
            <p className="text-sm text-muted-foreground">Add a delivery address to continue.</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function payWays(payments: { online: boolean; bankTransfer: { enabled: boolean } } | undefined): string {
  if (!payments) return "on the next page";
  const ways = [
    ...(payments.online ? ["online (UPI, cards, net banking)"] : []),
    ...(payments.bankTransfer.enabled ? ["by bank transfer"] : []),
  ];
  return ways.length > 0 ? ways.join(" or ") : "as we'll tell you by email";
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${number}`}>
      <h2 id={`step-${number}`} className="mb-4 flex items-center gap-3 text-2xl font-semibold">
        <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-jh-bright font-sans text-sm font-bold text-jh-navy">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}
