import { ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { itemsText } from "@/lib/account/rules";
import type { OrderSummary } from "@/lib/cart/types";
import { STATUS_TEXT } from "@/lib/checkout/payment";
import { rupees } from "@/lib/shop/prices";
import { cn } from "@/lib/utils";

const DATE = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

/** Statuses that wait for the buyer or the shop are highlighted. */
const WAITING = new Set(["PENDING_PAYMENT", "AWAITING_SHIPPING_QUOTE"]);

/** One order in a list: number, date, first item, total and status; the whole row opens it. */
export function OrderRow({ order }: { order: OrderSummary }) {
  return (
    <li>
      <Link
        href={`/account/orders/${order.orderNumber}`}
        className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-border transition hover:ring-jh-bright"
      >
        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-jh-light">
          {order.firstItemImageUrl ? (
            <Image src={order.firstItemImageUrl} alt="" fill unoptimized sizes="56px" className="object-cover" />
          ) : (
            <ImageOff aria-hidden className="m-auto mt-4 size-5 text-muted-foreground" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-semibold">{order.orderNumber}</span>
            <span className="font-semibold tabular-nums">{rupees(order.grandTotal)}</span>
          </span>
          <span className="block truncate text-sm text-muted-foreground">
            {DATE.format(new Date(order.placedAt))} · {itemsText(order.firstItemName, order.lineCount)}
          </span>
          <span
            className={cn(
              "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
              WAITING.has(order.status) ? "bg-amber-100 text-amber-900" : "bg-jh-light text-jh-navy",
            )}
          >
            {STATUS_TEXT[order.status]?.label ?? order.status}
          </span>
        </span>
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}
