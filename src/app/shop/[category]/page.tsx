import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogHeader, CatalogSidebar, PricesBand, SamplesBand, WhyJana } from "@/components/shop/catalog";
import { Section } from "@/components/site/section";
import { ShopCard, ShopGrid, ShopUnavailable } from "@/components/shop/shop-card";
import { findCategory, getFilters, getMenu, getProducts, getShopRules } from "@/lib/shop/api";
import { formatSelected, listingHref, parseSelected, toggle } from "@/lib/shop/filters";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(await getMenu(), slug);
  if (!category) return { title: "Shop" };
  return {
    title: `${category.name} | Shop`,
    description:
      category.description ??
      `${category.name} from Jana Human Hair: natural human hair with lower bulk prices for larger orders.`,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default function CategoryPage(props: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CategoryContent {...props} />
    </Suspense>
  );
}

const CHIP = "rounded-lg bg-jh-light px-3 py-1.5 text-sm transition-colors hover:bg-muted";
const CHIP_ON = "bg-jh-navy font-semibold text-white hover:bg-jh-deep";
const TAG = "rounded-full bg-white px-2.5 py-1 font-semibold text-jh-navy shadow-sm hover:bg-muted";

/**
 * One category (owner's design, phase J4): the categories and this
 * category's filters on the left, the chosen filters as removable tags, and
 * the products.
 */
async function CategoryContent({ params, searchParams }: PageProps<"/shop/[category]">) {
  const [{ category: slug }, query] = await Promise.all([params, searchParams]);
  const menu = await getMenu();
  const category = findCategory(menu, slug);
  if (!category) {
    if (menu === null) {
      return (
        <Section>
          <ShopUnavailable />
        </Section>
      );
    }
    notFound();
  }

  const selected = parseSelected(query.options);
  const available = query.available === "1";
  const page = Math.max(1, Number(query.page) || 1);
  const [filters, products, rules] = await Promise.all([
    getFilters(category.slug),
    getProducts({ category: category.slug, options: formatSelected(selected) || undefined, available, page }),
    getShopRules(),
  ]);
  const path = `/shop/${category.slug}`;
  const anyFilter = Object.keys(selected).length > 0 || available;
  const chosen = Object.entries(selected).flatMap(([name, values]) => values.map((value) => ({ name, value })));
  const pageHref = (n: number) => `${listingHref(path, selected, available)}${anyFilter ? "&" : "?"}page=${n}`;

  return (
    <>
      <CatalogHeader
        eyebrow="The Jana Human Hair shop"
        title={category.name}
        intro={
          category.description ??
          "Prices are per piece: one price for small quantities, and a lower bulk price from a set number of pieces, shown on each product."
        }
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-jh-deep hover:underline">
              Shop
            </Link>{" "}
            / <span aria-current="page">{category.name}</span>
          </nav>
        }
      />
      <PricesBand bulkMinQty={rules?.bulkMinQty ?? 10} />

      <section aria-labelledby="results-heading" className="w-full bg-jh-light px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
          <CatalogSidebar menu={menu ?? []} current={category.slug}>
            {filters && filters.options.length > 0 ? (
              <div className="flex flex-col gap-4 border-t border-border pt-4">
                {filters.options.map((option) => (
                  <div key={option.name} role="group" aria-label={option.name}>
                    <p className="mb-1.5 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">{option.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {option.values.map((value) => {
                        const on = selected[option.name]?.includes(value) ?? false;
                        return (
                          <Link
                            key={value}
                            href={listingHref(path, toggle(selected, option.name, value), available)}
                            aria-current={on ? "true" : undefined}
                            scroll={false}
                            className={cn(CHIP, on && CHIP_ON)}
                          >
                            {value}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <Link
                  href={listingHref(path, selected, !available)}
                  aria-current={available ? "true" : undefined}
                  scroll={false}
                  className={cn(CHIP, "self-start", available && CHIP_ON)}
                >
                  Can be ordered now
                </Link>
                {anyFilter ? (
                  <Link href={path} scroll={false} className="text-sm font-semibold text-jh-deep hover:underline">
                    Clear filters
                  </Link>
                ) : null}
              </div>
            ) : null}
          </CatalogSidebar>

          <div className="flex flex-col gap-5 lg:col-span-9">
            <h2 id="results-heading" className="sr-only">
              Products
            </h2>
            {products === null ? (
              <ShopUnavailable />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {chosen.length > 0 || available ? <span className="text-muted-foreground">Chosen:</span> : null}
                    {chosen.map(({ name, value }) => (
                      <Link
                        key={`${name}:${value}`}
                        href={listingHref(path, toggle(selected, name, value), available)}
                        scroll={false}
                        aria-label={`Remove ${name}: ${value}`}
                        className={TAG}
                      >
                        {value} ×
                      </Link>
                    ))}
                    {available ? (
                      <Link
                        href={listingHref(path, selected, false)}
                        scroll={false}
                        aria-label="Remove: can be ordered now"
                        className={TAG}
                      >
                        Can be ordered now ×
                      </Link>
                    ) : null}
                  </div>
                  <p role="status" className="text-sm font-bold text-jh-deep">
                    {products.total} product{products.total === 1 ? "" : "s"}
                  </p>
                </div>
                {products.items.length === 0 ? (
                  <p className="rounded-xl bg-white p-8 text-center text-muted-foreground shadow-sm">
                    Nothing matches these choices.{" "}
                    <Link href={path} className="font-semibold text-jh-deep underline">
                      Clear filters
                    </Link>
                  </p>
                ) : (
                  <ShopGrid>
                    {products.items.map((product) => (
                      <li key={product.id}>
                        <ShopCard product={product} />
                      </li>
                    ))}
                  </ShopGrid>
                )}
                {products.totalPages > 1 ? (
                  <nav aria-label="Pages" className="flex items-center justify-between rounded-xl bg-white p-4 text-sm shadow-sm">
                    <span className="text-muted-foreground">
                      Page <strong className="text-jh-navy">{products.page}</strong> of {products.totalPages}
                    </span>
                    <span className="flex gap-2 font-semibold">
                      {products.page > 1 ? (
                        <Link href={pageHref(products.page - 1)} className="rounded-lg bg-jh-light px-3.5 py-1.5 text-jh-navy hover:bg-muted">
                          ← Previous
                        </Link>
                      ) : null}
                      {products.page < products.totalPages ? (
                        <Link href={pageHref(products.page + 1)} className="rounded-lg bg-jh-navy px-3.5 py-1.5 text-white hover:bg-jh-deep">
                          Next →
                        </Link>
                      ) : null}
                    </span>
                  </nav>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <WhyJana />
      <SamplesBand />
    </>
  );
}
