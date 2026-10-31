import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";
import { getMenu } from "@/lib/shop/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The shop's pages are listed below, once it's open to search engines.
  const pages: MetadataRoute.Sitemap = nav.filter((item) => item.href !== "/shop" && !item.href.includes("#")).map((item) => ({
    url: new URL(item.href, site.url).toString(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
  pages.push({ url: new URL("/contact", site.url).toString(), changeFrequency: "monthly", priority: 0.8 });
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
