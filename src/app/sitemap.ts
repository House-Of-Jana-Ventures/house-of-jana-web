import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";
import { getMenu } from "@/lib/shop/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = nav.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
  // The shop joins the sitemap at launch (SHOP_INDEXING=true).
  if (process.env.SHOP_INDEXING !== "true") return pages;
  const menu = await getMenu();
  const shop = [
    "/shop",
    ...(menu ?? []).flatMap((c) => [`/shop/${c.slug}`, ...c.products.map((p) => `/shop/p/${p.slug}`)]),
  ];
  return [
    ...pages,
    ...shop.map((path) => ({ url: new URL(path, site.url).toString(), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
