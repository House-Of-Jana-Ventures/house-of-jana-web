import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal } from "@/components/site/reveal";
import { PageBanner, Section } from "@/components/site/section";
import { ShopCard, ShopGrid, ShopUnavailable } from "@/components/shop/shop-card";
import { findCategory, getFilters, getMenu, getProducts } from "@/lib/shop/api";
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
  const [filters, products] = await Promise.all([
    getFilters(category.slug),
    getProducts({ category: category.slug, options: formatSelected(selected) || undefined, available, page }),
  ]);
  const path = `/shop/${category.slug}`;
  const anyFilter = Object.keys(selected).length > 0 || available;

  return (
    <>
      <PageBanner
        eyebrow="Shop"
        title={category.name}
        intro={
          category.description ??
          "Prices are per piece: one price for small quantities, and a lower bulk price from a set number of pieces, shown on each product."
        }
        image="/images/banners/products.webp"
      />
      <Section className="bg-white" labelledBy="results-heading">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-jh-deep hover:underline">
            Shop
          </Link>{" "}
          / <span aria-current="page">{category.name}</span>
        </nav>

        {filters && filters.options.length > 0 ? (
          <div className="flex flex-col gap-4 rounded-3xl bg-jh-light/60 p-5 ring-1 ring-border">
            {filters.options.map((option) => (
              <div key={option.name} role="group" aria-label={option.name} className="flex flex-wrap items-center gap-2">
                <span className="mr-1 w-20 text-sm font-semibold">{option.name}</span>
                {option.values.map((value) => {
                  const on = selected[option.name]?.includes(value) ?? false;
                  return (
                    <Link
                      key={value}
                      href={listingHref(path, toggle(selected, option.name, value), available)}
                      aria-current={on ? "true" : undefined}
                      scroll={false}
                      className={cn(
                        "rounded-sm bg-white px-3.5 py-1.5 text-sm ring-1 ring-border transition-colors hover:ring-jh-bright",
                        on && "bg-jh-bright font-semibold text-jh-navy ring-jh-bright",
                      )}
                    >
                      {value}
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
              <Link
                href={listingHref(path, selected, !available)}
                aria-current={available ? "true" : undefined}
                scroll={false}
                className={cn(
                  "rounded-sm bg-white px-3.5 py-1.5 ring-1 ring-border hover:ring-jh-bright",
                  available && "bg-jh-bright font-semibold ring-jh-bright",
                )}
              >
                Can be ordered now
              </Link>
              {anyFilter ? (
                <Link href={path} scroll={false} className="font-semibold text-jh-deep hover:underline">
                  Clear filters
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        <h2 id="results-heading" className="sr-only">
          Products
        </h2>
        {products === null ? (
          <div className="mt-8">
            <ShopUnavailable />
          </div>
        ) : products.items.length === 0 ? (
          <p role="status" className="mt-10 text-center text-muted-foreground">
            Nothing matches these choices.{" "}
            <Link href={path} className="font-semibold text-jh-deep underline">
              Clear filters
            </Link>
          </p>
        ) : (
          <>
            <p role="status" className="mt-6 text-sm text-muted-foreground">
              {products.total} product{products.total === 1 ? "" : "s"}
            </p>
            <ShopGrid>
              {products.items.map((product, i) => (
                <li key={product.id}>
                  <Reveal delay={0.05 * (i % 3)} className="h-full">
                    <ShopCard product={product} />
                  </Reveal>
                </li>
              ))}
            </ShopGrid>
            {products.totalPages > 1 ? (
              <nav aria-label="Pages" className="mt-8 flex justify-center gap-4 text-sm font-semibold text-jh-deep">
                {products.page > 1 ? (
                  <Link href={`${listingHref(path, selected, available)}${anyFilter ? "&" : "?"}page=${products.page - 1}`}>
                    ← Previous
                  </Link>
                ) : null}
                <span className="text-muted-foreground">
                  Page {products.page} of {products.totalPages}
                </span>
                {products.page < products.totalPages ? (
                  <Link href={`${listingHref(path, selected, available)}${anyFilter ? "&" : "?"}page=${products.page + 1}`}>
                    Next →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        )}
      </Section>
    </>
  );
}
