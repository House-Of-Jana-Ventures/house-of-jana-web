import { ArrowRight, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { bulkSaving, rupees } from "@/lib/shop/prices";
import type { ProductCard } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/** "from ₹5,200" when the price varies by option, else "₹5,200". */
function priceText(range: { min: string; max: string }): string {
  return `${range.min === range.max ? "" : "from "}${rupees(range.min)}`;
}

/**
 * A product in a listing (owner's design, phase J4): a photo with badges, the
 * name, and a small price table with the single price below the product's
 * bulk minimum and the bulk price from it.
 */
export function ShopCard({ product }: { product: ProductCard }) {
  const saving = bulkSaving(product.prices.single.min, product.prices.bulk.min);
  const min = product.bulkMinQty;
  return (
    <Link
      href={`/shop/p/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-jh-light">
        {product.image ? (
          // The API already serves resized WebP copies.
          <Image
            src={product.image.medium}
            alt={product.imageAlt ?? ""}
            fill
            unoptimized
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff aria-hidden className="size-8" />
          </span>
        )}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {saving > 0 ? (
            <span className="rounded-md bg-jh-navy px-2.5 py-1 text-[0.7rem] font-bold text-white shadow-sm">
              Save {saving}% in bulk
            </span>
          ) : null}
          {!product.available ? (
            <span className="rounded-md bg-white px-2.5 py-1 text-[0.7rem] font-bold text-jh-navy shadow-sm">Sold out for now</span>
          ) : null}
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span>
          <span className="block font-sans text-lg font-bold text-jh-navy transition-colors group-hover:text-jh-deep">{product.name}</span>
          {product.shortDescription ? (
            <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{product.shortDescription}</span>
          ) : null}
        </span>
        <span className="mt-auto flex flex-col gap-1 rounded-lg bg-jh-light p-3 text-sm">
          {min > 1 ? (
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">{min > 2 ? `1–${min - 1}` : "1"} pieces:</span>
              <span className="font-semibold whitespace-nowrap text-jh-navy">{priceText(product.prices.single)}</span>
            </span>
          ) : null}
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-jh-deep">Bulk, {min}+ pieces:</span>
            <span className="text-base font-bold whitespace-nowrap text-jh-deep">{priceText(product.prices.bulk)}</span>
          </span>
          <span className="text-xs text-muted-foreground">per {product.unitLabel}, GST included</span>
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded-lg bg-jh-navy py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-jh-deep">
          Choose length &amp; order
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </span>
    </Link>
  );
}

/** The product cards: `wide` fits four across (the home page), else three beside the filters. */
export function ShopGrid({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", wide ? "mt-10 lg:grid-cols-4" : "xl:grid-cols-3")}>{children}</ul>
  );
}

/** Shown when the shop's data can't be read right now. */
export function ShopUnavailable() {
  return (
    <div role="status" className="mx-auto max-w-xl rounded-md bg-white p-8 text-center ring-1 ring-border">
      <h2 className="text-2xl font-semibold">The shop is being updated</h2>
      <p className="mt-3 text-muted-foreground">
        Please check back in a few minutes, or use the contact form and we&apos;ll send you prices directly.
      </p>
    </div>
  );
}

/** Shown before any product is on sale. */
export function ShopOpeningSoon() {
  return (
    <div role="status" className="mx-auto max-w-xl rounded-md bg-jh-light/60 p-8 text-center ring-1 ring-border">
      <h2 className="text-2xl font-semibold">Our online shop opens soon</h2>
      <p className="mt-3 text-muted-foreground">
        Prices and products are being added. In the meantime, ask us for a quote through the contact form.
      </p>
    </div>
  );
}
