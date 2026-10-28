import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Section } from "@/components/site/section";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { ProductView } from "@/components/shop/product-view";
import { site } from "@/content/site";
import { getProduct } from "@/lib/shop/api";
import type { ShopProduct } from "@/lib/shop/types";

export async function generateMetadata({ params }: PageProps<"/shop/p/[product]">): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProduct(slug);
  if (typeof product === "string") return { title: "Shop" };
  const image = product.images[0]?.urls.large;
  return {
    title: `${product.name} | Shop`,
    description:
      product.shortDescription ??
      `${product.name} from Jana Human Hair, per ${product.unitLabel}: bulk prices from ${product.bulkMinQty} pieces.`,
    alternates: { canonical: `/shop/p/${product.slug}` },
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export default function ProductPage(props: PageProps<"/shop/p/[product]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ProductContent {...props} />
    </Suspense>
  );
}

/** Product facts for search engines: the price range and whether it can be ordered. */
function productJsonLd(product: ShopProduct) {
  const all = product.variants.flatMap((v) => [Number(v.singlePrice), Number(v.bulkPrice)]);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    image: product.images.map((i) => i.urls.large),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...all).toFixed(2),
      highPrice: Math.max(...all).toFixed(2),
      offerCount: product.variants.length,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

async function ProductContent({ params }: PageProps<"/shop/p/[product]">) {
  const { product: slug } = await params;
  const product = await getProduct(slug);
  if (product === "missing") notFound();
  if (product === "unavailable") {
    return (
      <Section>
        <ShopUnavailable />
      </Section>
    );
  }
  const category = product.categories[0];

  return (
    <Section className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)).replace(/</g, String.fromCharCode(92) + "u003c"),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-jh-deep hover:underline">
          Shop
        </Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/shop/${category.slug}`} className="hover:text-jh-deep hover:underline">
              {category.name}
            </Link>
          </>
        ) : null}
        {" / "}
        <span aria-current="page">{product.name}</span>
      </nav>
      <Suspense>
        <ProductView product={product} />
      </Suspense>
    </Section>
  );
}
