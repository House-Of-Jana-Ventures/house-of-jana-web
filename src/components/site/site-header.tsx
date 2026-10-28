import Image from "next/image";
import { Suspense } from "react";
import { getMenu } from "@/lib/shop/api";
import { Header } from "./header";
import { HeaderAccount } from "./header-account";

/**
 * The header with the shop's menu (read from the API, cached for about a
 * minute) and the buyer's account and cart (personal, filled in per visit).
 */
export async function SiteHeader() {
  const menu = await getMenu();
  return (
    <Header
      menu={menu ?? []}
      account={
        <Suspense fallback={<span className="size-11" />}>
          <HeaderAccount />
        </Suspense>
      }
    />
  );
}

/** Shown for a moment while the header loads: the same bar with the logo. */
export function HeaderFallback() {
  return (
    <div className="sticky top-0 z-30 h-18 border-b border-transparent bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center px-4 sm:px-6">
        <Image src="/images/logo.png" alt="Jana Human Hair" width={317} height={140} className="h-12 w-auto" />
      </div>
    </div>
  );
}
