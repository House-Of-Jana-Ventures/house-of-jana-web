import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { rupees } from "@/lib/shop/prices";
import type { ProductCard } from "@/lib/shop/types";

/**
 * A product in a listing: a square photo on white, then the name, both price
 * ranges and the unit underneath, with no card around it (phase J3).
 */
export function ShopCard({ product }: { product: ProductCard }) {
  return (
    <Link
      href={`/shop/p/${product.slug}`}
      className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jh-bright"
    >
      <span className="relative block aspect-square overflow-hidden rounded-sm bg-white ring-1 ring-border">
        {product.image ? (
          // The API already serves resized WebP copies.
          <Image
            src={product.image.medium}
            alt={product.imageAlt ?? ""}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, 45vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff aria-hidden className="size-8" />
          </span>
        )}
        {!product.available ? (
          <span className="absolute top-3 left-3 rounded-sm bg-white px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-jh-navy uppercase ring-1 ring-border">
            Sold out for now
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col pt-4">
        <span className="font-heading text-2xl font-medium group-hover:text-jh-deep">{product.name}</span>
        {product.shortDescription ? (
          <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</span>
        ) : null}
        <span className="mt-auto pt-3">
          <span className="block text-sm text-muted-foreground">Bulk, {product.bulkMinQty}+ per {product.unitLabel}</span>
          <span className="block text-base font-semibold text-jh-navy">
            {product.prices.bulk.min === product.prices.bulk.max ? "" : "from "}
            {rupees(product.prices.bulk.min)}
          </span>
          {/* Below the product's own bulk minimum (e.g. 1–9 when bulk starts at 10). */}
          {product.bulkMinQty > 1 ? (
            <span className="block text-sm text-muted-foreground">
              {product.bulkMinQty > 2 ? `1–${product.bulkMinQty - 1}` : "1"}:{" "}
              {product.prices.single.min === product.prices.single.max ? "" : "from "}
              {rupees(product.prices.single.min)}
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}

export function ShopGrid({ children }: { children: React.ReactNode }) {
  return <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{children}</ul>;
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
