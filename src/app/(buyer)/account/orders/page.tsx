import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrderRow } from "@/components/account/order-row";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { ORDER_FILTERS, orderFilter } from "@/lib/account/rules";
import { apiPage } from "@/lib/api/client";
import type { OrderSummary } from "@/lib/cart/types";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My orders" };

export default function OrdersPage(props: PageProps<"/account/orders">) {
  return (
    <>
      <h1 className="text-4xl font-semibold">Orders</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading your orders…</p>}>
        <Orders {...props} />
      </Suspense>
    </>
  );
}

const PER_PAGE = 10;

async function Orders({ searchParams }: PageProps<"/account/orders">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const filter = orderFilter(one(params.show));
  const page = Math.max(1, Math.floor(Number(one(params.page))) || 1);
  const here = `/account/orders${filter.key === "all" ? "" : `?show=${filter.key}`}`;
  const session = await requireSession(here);

  const query = new URLSearchParams({ page: String(page), limit: String(PER_PAGE) });
  if (filter.statuses.length > 0) query.set("status", filter.statuses.join(","));
  let orders: OrderSummary[];
  let totalPages: number;
  try {
    ({ items: orders, totalPages } = await apiPage<OrderSummary>(`/orders?${query}`, { token: session.token }));
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl(here));
    return (
      <div className="mt-6">
        <ShopUnavailable />
      </div>
    );
  }
  const link = (changes: { show?: string; page?: number }) => {
    const q = new URLSearchParams();
    const show = changes.show ?? filter.key;
    if (show !== "all") q.set("show", show);
    if (changes.page && changes.page > 1) q.set("page", String(changes.page));
    const s = q.toString();
    return `/account/orders${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <nav aria-label="Show orders" className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {ORDER_FILTERS.map((f) => (
          <Link
            key={f.key}
            href={link({ show: f.key })}
            aria-current={f.key === filter.key ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-border hover:ring-jh-bright",
              f.key === filter.key && "bg-jh-bright font-semibold text-jh-navy ring-jh-bright",
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>
      {orders.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          {filter.key === "all" ? "No orders yet." : "No orders here."}{" "}
          <Link href="/shop" className="text-jh-deep hover:underline">
            Browse the shop
          </Link>
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </ul>
      )}
      {totalPages > 1 ? (
        <nav aria-label="Pages" className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 ? (
            <Link href={link({ page: page - 1 })} className="rounded-full bg-white px-4 py-2 ring-1 ring-border hover:ring-jh-bright">
              Newer
            </Link>
          ) : null}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={link({ page: page + 1 })} className="rounded-full bg-white px-4 py-2 ring-1 ring-border hover:ring-jh-bright">
              Older
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
