import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { rupees } from "@/lib/shop/prices";
import type { ProductCard } from "@/lib/shop/types";

/** A product in a listing: photo, name, both price ranges and the unit. */
export function ShopCard({ product }: { product: ProductCard }) {
  return (
    <Link
      href={`/shop/p/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-jh-navy/10 hover:ring-jh-bright/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-jh-light">
        {product.image ? (
          // The API already serves resized WebP copies.
          <Image
            src={product.image.medium}
            alt={product.imageAlt ?? ""}
            fill
            unoptimized
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff aria-hidden className="size-8" />
          </span>
        )}
        {!product.available ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-jh-navy">
            Sold out for now
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="text-xl font-semibold">{product.name}</span>
        {product.shortDescription ? (
          <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</span>
        ) : null}
        <span className="mt-auto pt-4">
          <span className="block text-sm text-muted-foreground">Bulk, {product.bulkMinQty}+ per {product.unitLabel}</span>
          <span className="block text-lg font-semibold text-jh-deep">
            {product.prices.bulk.min === product.prices.bulk.max ? "" : "from "}
            {rupees(product.prices.bulk.min)}
          </span>
          <span className="block text-sm text-muted-foreground">
            1–24: {product.prices.single.min === product.prices.single.max ? "" : "from "}
            {rupees(product.prices.single.min)}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function ShopGrid({ children }: { children: React.ReactNode }) {
  return <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}

/** Shown when the shop's data can't be read right now. */
export function ShopUnavailable() {
  return (
    <div role="status" className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-border">
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
    <div role="status" className="mx-auto max-w-xl rounded-3xl bg-jh-light/60 p-8 text-center ring-1 ring-border">
      <h2 className="text-2xl font-semibold">Our online shop opens soon</h2>
      <p className="mt-3 text-muted-foreground">
        Prices and products are being added. In the meantime, ask us for a quote through the contact form.
      </p>
    </div>
  );
}
