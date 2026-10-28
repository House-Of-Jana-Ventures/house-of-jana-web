import type { Metadata } from "next";

/** Sign-in, cart, checkout and account pages are personal: never in search results. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BuyerLayout({ children }: LayoutProps<"/">) {
  return children;
}
