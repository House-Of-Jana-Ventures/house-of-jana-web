import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { PageBanner, Section, SectionHeading } from "@/components/site/section";
import { ShopCard, ShopGrid, ShopOpeningSoon, ShopUnavailable } from "@/components/shop/shop-card";
import { getMenu, getProducts } from "@/lib/shop/api";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Buy natural human hair from Jana Human Hair: bulk hair, extensions, wefts, wigs and raw material, with lower bulk prices for larger orders.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const menu = await getMenu();
  const sections = await Promise.all(
    (menu ?? []).map(async (category) => ({ category, page: await getProducts({ category: category.slug }) })),
  );

  return (
    <>
      <PageBanner
        eyebrow="Shop"
        title="Natural human hair, straight from Midnapore"
        intro="Prices are per piece: one price for small quantities, and a lower bulk price from a set number of pieces, shown on each product (lengths and textures count together)."
        image="/images/banners/products.webp"
      />
      {menu === null ? (
        <Section className="bg-white">
          <ShopUnavailable />
        </Section>
      ) : menu.length === 0 ? (
        <Section className="bg-white">
          <ShopOpeningSoon />
        </Section>
      ) : (
        sections.map(({ category, page }, i) => (
          <Section
            key={category.id}
            labelledBy={`${category.slug}-heading`}
            className={i % 2 === 0 ? "bg-white" : undefined}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id={`${category.slug}-heading`}
                eyebrow={`${category.productCount} product${category.productCount === 1 ? "" : "s"}`}
                title={category.name}
                align="left"
              />
              <Link href={`/shop/${category.slug}`} className="font-semibold text-jh-deep hover:underline">
                See all {category.name.toLowerCase()} →
              </Link>
            </div>
            {page ? (
              <ShopGrid>
                {page.items.map((product, j) => (
                  <li key={product.id}>
                    <Reveal delay={0.05 * (j % 3)} className="h-full">
                      <ShopCard product={product} />
                    </Reveal>
                  </li>
                ))}
              </ShopGrid>
            ) : (
              <ShopUnavailable />
            )}
          </Section>
        ))
      )}
    </>
  );
}
