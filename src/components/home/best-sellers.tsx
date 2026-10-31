import Link from "next/link";
import { ShopCard, ShopGrid } from "@/components/shop/shop-card";
import { getProducts } from "@/lib/shop/api";

/**
 * Up to four products from the shop, as simple cards. Hidden until the shop
 * has products on sale (or while its data can't be read).
 */
export async function BestSellers() {
  const page = await getProducts({ available: true });
  const items = page?.items.slice(0, 4) ?? [];
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="sellers-heading" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">In the shop</p>
            <h2 id="sellers-heading" className="mt-3 text-4xl font-medium sm:text-5xl">
              Shop our hair
            </h2>
          </div>
          <Link href="/shop" className="link-line text-jh-navy">
            Shop all
          </Link>
        </div>
        <ShopGrid>
          {items.map((product) => (
            <li key={product.id}>
              <ShopCard product={product} />
            </li>
          ))}
        </ShopGrid>
      </div>
    </section>
  );
}
