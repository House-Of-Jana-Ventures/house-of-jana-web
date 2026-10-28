import type { Metadata } from "next";

/**
 * The shop stays out of search engines until launch (SHOP_INDEXING=true),
 * so half-filled prices never appear in search results.
 */
export const metadata: Metadata = {
  robots: process.env.SHOP_INDEXING === "true" ? undefined : { index: false, follow: true },
};

export default function ShopLayout({ children }: LayoutProps<"/shop">) {
  return children;
}
