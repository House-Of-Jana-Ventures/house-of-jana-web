import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogHeader, CatalogSidebar, PricesBand, SamplesBand, WhyJana } from "@/components/shop/catalog";
import { ShopCard, ShopGrid, ShopOpeningSoon, ShopUnavailable } from "@/components/shop/shop-card";
import { getMenu, getProducts, getShopRules } from "@/lib/shop/api";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Buy natural human hair from Jana Human Hair: bulk hair, extensions, wefts, wigs and raw material, with lower bulk prices for larger orders.",
  alternates: { canonical: "/shop" },
};

/** The whole shop (owner's design, phase J4): every product on sale, with the categories beside them. */
export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopContent {...props} />
    </Suspense>
  );
}

async function ShopContent({ searchParams }: PageProps<"/shop">) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const [menu, products, rules] = await Promise.all([getMenu(), getProducts({ page }), getShopRules()]);

  return (
    <>
      <CatalogHeader
        eyebrow="The Jana Human Hair shop"
        title="Natural human hair, straight from Midnapore"
        intro="Raw hair and finished pieces for wig makers, extension brands and salons. Prices are per piece: one price for small quantities, and a lower bulk price from a set number of pieces, shown on each product."
        status={
          products && products.total > 0 ? (
            <p role="status">
              Showing <strong className="text-jh-navy">{products.total} product{products.total === 1 ? "" : "s"}</strong>{" "}
              in {menu?.length ?? 0} categor{menu?.length === 1 ? "y" : "ies"}
            </p>
          ) : null
        }
      />
      <PricesBand bulkMinQty={rules?.bulkMinQty ?? 10} />

      <section aria-labelledby="results-heading" className="w-full bg-jh-light px-4 py-12 sm:px-6">
        <h2 id="results-heading" className="sr-only">
          Products
        </h2>
        {menu === null || products === null ? (
          <div className="mx-auto max-w-6xl">
            <ShopUnavailable />
          </div>
        ) : menu.length === 0 || products.items.length === 0 ? (
          <div className="mx-auto max-w-6xl">
            <ShopOpeningSoon />
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
            <CatalogSidebar menu={menu} current={null} />
            <div className="flex flex-col gap-6 lg:col-span-9">
              <ShopGrid>
                {products.items.map((product) => (
                  <li key={product.id}>
                    <ShopCard product={product} />
                  </li>
                ))}
              </ShopGrid>
              {products.totalPages > 1 ? (
                <nav aria-label="Pages" className="flex items-center justify-between rounded-xl bg-white p-4 text-sm shadow-sm">
                  <span className="text-muted-foreground">
                    Page <strong className="text-jh-navy">{products.page}</strong> of {products.totalPages}
                  </span>
                  <span className="flex gap-2 font-semibold">
                    {products.page > 1 ? (
                      <Link href={`/shop?page=${products.page - 1}`} className="rounded-lg bg-jh-light px-3.5 py-1.5 text-jh-navy hover:bg-muted">
                        ← Previous
                      </Link>
                    ) : null}
                    {products.page < products.totalPages ? (
                      <Link href={`/shop?page=${products.page + 1}`} className="rounded-lg bg-jh-navy px-3.5 py-1.5 text-white hover:bg-jh-deep">
                        Next →
                      </Link>
                    ) : null}
                  </span>
                </nav>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <WhyJana />
      <SamplesBand />
    </>
  );
}
