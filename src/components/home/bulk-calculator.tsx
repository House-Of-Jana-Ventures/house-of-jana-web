"use client";

import { Calculator } from "lucide-react";
import { useId, useState } from "react";
import { bulkSaving, quote, rupees } from "@/lib/shop/prices";
import type { ProductCard } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/**
 * "Live volume estimator" (owner's design, phase J4), with the shop's real
 * rule: the single price below a product's bulk minimum, the bulk price from
 * it. Uses each product's lowest prices ("from"); the exact price depends on
 * the length and texture chosen in the shop.
 */
export function BulkCalculator({ products }: { products: ProductCard[] }) {
  const id = useId();
  const [productId, setProductId] = useState(products[0].id);
  const product = products.find((p) => p.id === productId) ?? products[0];
  const min = product.bulkMinQty;
  const max = Math.max(min * 10, 50);
  const [quantity, setQuantity] = useState(min);
  const prices = { singlePrice: product.prices.single.min, bulkPrice: product.prices.bulk.min };
  const result = quote(quantity, prices, min);
  const saving = bulkSaving(prices.singlePrice, prices.bulkPrice);
  const unit = product.unitLabel;

  const tiers = [
    {
      key: "single",
      range: min > 2 ? `1 – ${min - 1} pieces` : "1 piece",
      note: "Single price",
      show: min > 1,
    },
    {
      key: "bulk",
      range: `${min}+ pieces`,
      note: saving > 0 ? `Bulk price · save ${saving}%` : "Bulk price",
      show: true,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-border md:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-jh-deep uppercase">
            <Calculator aria-hidden className="size-4" />
            Bulk price estimator
          </p>
          <h3 className="text-2xl font-semibold text-jh-navy sm:text-3xl">See your price for any quantity</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Choose a product and slide the quantity. The bulk price starts on its own at the product&apos;s bulk
            minimum, whether you&apos;re a single atelier or a salon chain.
          </p>
          <ul className="flex flex-col gap-2 pt-1">
            {tiers
              .filter((t) => t.show)
              .map((tier) => (
                <li
                  key={tier.key}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-2.5 text-sm transition-colors",
                    result.tier === tier.key ? "bg-jh-bright/20 ring-1 ring-jh-bright/50" : "bg-jh-light",
                  )}
                >
                  <span className="font-semibold text-jh-navy">{tier.range}</span>
                  <span className={cn("text-xs font-bold", tier.key === "bulk" ? "text-jh-deep" : "text-muted-foreground")}>
                    {tier.note}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-xl bg-jh-light p-4 md:p-6 lg:col-span-7">
          <label htmlFor={`${id}-product`} className="mb-1 block text-xs font-bold text-muted-foreground uppercase">
            Product
          </label>
          <select
            id={`${id}-product`}
            value={product.id}
            onChange={(e) => {
              const next = products.find((p) => p.id === e.target.value) ?? products[0];
              setProductId(next.id);
              setQuantity(next.bulkMinQty);
            }}
            className="mb-5 h-11 w-full rounded-lg bg-white px-3 text-sm text-jh-navy ring-1 ring-border focus:ring-2 focus:ring-jh-bright focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}: from {rupees(p.prices.bulk.min)} bulk / {rupees(p.prices.single.min)} single, per {p.unitLabel}
              </option>
            ))}
          </select>

          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor={`${id}-qty`} className="text-sm font-semibold text-jh-navy">
              Quantity
            </label>
            <output htmlFor={`${id}-qty`} className="text-lg font-bold text-jh-deep">
              {quantity} {quantity === 1 ? "piece" : "pieces"}
            </output>
          </div>
          <input
            id={`${id}-qty`}
            type="range"
            min={1}
            max={max}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-jh-deep"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>{min} (bulk)</span>
            <span>{max}</span>
          </div>

          <div aria-live="polite" className="mt-5 rounded-xl bg-white p-4 shadow-sm">
            <div className="grid items-center gap-3 text-center sm:grid-cols-3 sm:text-left">
              <div>
                <span className="block text-xs text-muted-foreground uppercase">Price per piece</span>
                <span className="block font-heading text-xl font-bold text-jh-navy">from {rupees(result.unitPrice)}</span>
                <span className="block text-xs font-semibold text-jh-deep">
                  {result.tier === "bulk" ? "Bulk price" : `Single price · ${result.toBulk} more for bulk`}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground uppercase">Estimated total</span>
                <span className="block font-heading text-2xl font-bold text-jh-deep">from {rupees(result.total)}</span>
                <span className="block text-xs text-muted-foreground">
                  {quantity} × {unit}, GST included
                </span>
              </div>
              <div className="flex justify-center sm:justify-end">
                <a
                  href="#quick-rfq"
                  className="w-full rounded-lg bg-jh-navy px-4 py-3 text-center text-sm font-bold text-white shadow transition-all hover:bg-jh-deep hover:shadow-md sm:w-auto"
                >
                  Get an exact quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
