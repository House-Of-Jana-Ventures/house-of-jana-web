import { AlertTriangle, Clock, ImageOff, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { changeLine } from "@/lib/cart/actions";
import { bulkNote, groupByProduct, leadTimeNote, lineProblem } from "@/lib/cart/rules";
import type { Cart } from "@/lib/cart/types";
import { rupees } from "@/lib/shop/prices";
import { cn } from "@/lib/utils";

/**
 * The cart's lines under their product, with how far the bulk price is.
 * Each quantity is a small form (−, the box with Update, +), so the cart
 * works without JavaScript too.
 */
export function CartGroups({ cart, editable = true }: { cart: Cart; editable?: boolean }) {
  return (
    <ul className="flex flex-col gap-6">
      {groupByProduct(cart).map(({ product, lines }) => (
        <li key={product.productId} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-jh-navy">
              <Link href={`/shop/p/${lines[0].productSlug}`} className="hover:text-jh-deep hover:underline">
                {product.productName}
              </Link>
            </h2>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                product.tier === "bulk" ? "bg-jh-bright/20 text-jh-deep" : "bg-jh-light text-jh-navy",
              )}
            >
              {product.tier === "bulk" ? "Bulk price" : "Single price"}
            </span>
          </div>
          <p className="mt-1 text-sm text-jh-deep">{bulkNote(product)}</p>
          <ul className="mt-4 divide-y divide-border">
            {lines.map((line) => {
              const problem = lineProblem(line);
              const lead = leadTimeNote(line);
              return (
                <li key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-jh-light sm:h-28 sm:w-24">
                    {line.image ? (
                      <Image src={line.image.thumbnail} alt="" fill unoptimized sizes="80px" className="object-cover" />
                    ) : (
                      <ImageOff aria-hidden className="m-auto mt-7 size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-semibold text-jh-navy">{line.variantLabel}</p>
                      <p className="text-lg font-bold text-jh-navy tabular-nums">{rupees(line.lineTotal)}</p>
                    </div>
                    <dl className="mt-2 flex flex-wrap gap-2 text-sm">
                      <div className="rounded-md bg-jh-light/70 px-2.5 py-1">
                        <dt className="text-[0.7rem] tracking-wider text-muted-foreground uppercase">Price</dt>
                        <dd className="font-semibold text-jh-navy tabular-nums">
                          {rupees(line.unitPrice)} per {line.unitLabel}
                        </dd>
                      </div>
                      {line.tier !== "bulk" && line.bulkPrice ? (
                        <div className="rounded-md bg-jh-light/70 px-2.5 py-1">
                          <dt className="text-[0.7rem] tracking-wider text-muted-foreground uppercase">Bulk price</dt>
                          <dd className="font-semibold text-jh-deep tabular-nums">{rupees(line.bulkPrice)}</dd>
                        </div>
                      ) : null}
                      <div className="rounded-md bg-jh-light/70 px-2.5 py-1">
                        <dt className="text-[0.7rem] tracking-wider text-muted-foreground uppercase">Code</dt>
                        <dd className="font-mono text-xs leading-5 text-jh-navy">{line.sku}</dd>
                      </div>
                    </dl>
                    {lead ? (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock aria-hidden className="size-3.5" /> {lead}
                      </p>
                    ) : null}
                    {problem ? (
                      <p className="mt-2 flex items-start gap-1.5 text-sm text-destructive">
                        <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" /> {problem}
                      </p>
                    ) : null}
                    {editable ? <QuantityForm lineId={line.id} quantity={line.quantity} label={line.variantLabel} /> : (
                      <p className="mt-1 text-sm">Quantity: {line.quantity}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function QuantityForm({ lineId, quantity, label }: { lineId: string; quantity: number; label: string }) {
  const step = "flex size-10 items-center justify-center rounded-md hover:bg-white focus-visible:outline-2 focus-visible:outline-jh-bright";
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <form action={changeLine} className="flex items-center rounded-lg bg-jh-light/70 p-0.5">
        <input type="hidden" name="lineId" value={lineId} />
        <button type="submit" name="quantity" value={quantity - 1} aria-label={`One less ${label}`} className={step}>
          <Minus aria-hidden className="size-4" />
        </button>
        <label htmlFor={`qty-${lineId}`} className="sr-only">
          Quantity of {label}
        </label>
        <input
          id={`qty-${lineId}`}
          name="quantity"
          inputMode="numeric"
          defaultValue={quantity}
          key={quantity}
          className="h-10 w-14 bg-transparent text-center font-semibold tabular-nums outline-none"
        />
        <button type="submit" name="quantity" value={quantity + 1} aria-label={`One more ${label}`} className={step}>
          <Plus aria-hidden className="size-4" />
        </button>
        <button type="submit" className="mr-1 rounded-md px-3 py-1.5 text-xs font-semibold text-jh-deep hover:bg-white">
          Update
        </button>
      </form>
      <form action={changeLine}>
        <input type="hidden" name="lineId" value={lineId} />
        <input type="hidden" name="quantity" value="0" />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden className="size-4" /> Remove <span className="sr-only">{label}</span>
        </button>
      </form>
    </div>
  );
}
