import { Suspense } from "react";
import { AccountNav } from "@/components/account/account-nav";

/**
 * My account: the sections on the left (tabs on phones), the page on the
 * right. The menu reads the current address, so it renders per visit.
 */
export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 hidden font-heading text-2xl font-semibold lg:block">My account</p>
          <Suspense fallback={<div className="h-10" />}>
            <AccountNav />
          </Suspense>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
