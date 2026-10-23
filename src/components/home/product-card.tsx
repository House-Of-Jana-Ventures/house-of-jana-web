import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";

/**
 * A product on the home page. The photos are circles on square artwork, so
 * they're shown in a circle; the card lifts gently on hover.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products#${product.slug}`}
      className="group flex h-full flex-col items-center rounded-[1.75rem] bg-white p-6 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-jh-navy/10 hover:ring-jh-bright/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
    >
      <span className="relative block size-40 overflow-hidden rounded-full bg-jh-light ring-4 ring-jh-light transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 group-hover:ring-jh-bright/40">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="160px"
          className="scale-[1.42] object-cover"
        />
      </span>
      <h3 className="mt-6 text-xl font-semibold">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.short}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-jh-deep">
        Learn more
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
