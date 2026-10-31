"use client";

import { FileText, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { nav } from "@/content/site";
import type { MenuCategory } from "@/lib/shop/types";
import { cn } from "@/lib/utils";
import { ProductsMenu } from "./products-menu";

/**
 * The sticky header: logo, menu (a slide-out panel on phones), Contact us,
 * and the buyer's account and cart (`account`, rendered on the server).
 * "Products" opens the shop's menu of categories and products. Quiet, as in
 * phase J3: plain white, text links, and a thin navy line under the current
 * page.
 */
export function Header({ menu = [], account }: { menu?: MenuCategory[]; account?: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A soft shadow once the page has scrolled. (The header keeps its height,
  // so nothing below it moves.)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-sm shadow-jh-navy/5",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-jh-bright"
        >
          <Image
            src="/images/logo-strong.png"
            alt="Jana Human Hair home"
            width={317}
            height={140}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className={item.wide ? "hidden lg:block" : undefined}>
                {item.href === "/shop" ? (
                  <ProductsMenu menu={menu} current={isCurrent(item.href)} />
                ) : (
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 text-sm text-jh-navy/75 transition-colors hover:text-jh-navy focus-visible:outline-2 focus-visible:outline-jh-bright",
                    "after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-jh-navy after:transition-transform after:duration-300 hover:after:scale-x-100",
                    isCurrent(item.href) && "text-jh-navy after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/contact"
          aria-current={isCurrent("/contact") ? "page" : undefined}
          className={cn(
            "hidden px-3 py-2 text-sm text-jh-navy/75 transition-colors hover:text-jh-navy focus-visible:outline-2 focus-visible:outline-jh-bright md:inline-flex",
            isCurrent("/contact") && "font-semibold text-jh-navy",
          )}
        >
          Contact us
        </Link>
        <Link
          href="/#quick-rfq"
          className="hidden h-10 items-center gap-1.5 rounded-lg bg-jh-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-jh-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright xl:inline-flex"
        >
          <FileText aria-hidden className="size-4" />
          Request bulk quote
        </Link>
        <div className="ml-auto flex items-center md:ml-0">{account}</div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="flex size-11 items-center justify-center rounded-full text-jh-navy hover:bg-muted focus-visible:outline-2 focus-visible:outline-jh-bright md:hidden"
          >
            <Menu aria-hidden className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] bg-white p-6">
            <SheetTitle className="font-heading text-2xl">Menu</SheetTitle>
            <nav aria-label="Main">
              <ul className="mt-2 flex flex-col gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-sm px-4 py-3 text-base hover:bg-jh-light",
                        isCurrent(item.href) && "bg-jh-light text-jh-deep",
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.href === "/shop" ? (
                      <ul className="mt-1 mb-2 ml-4 flex flex-col border-l-2 border-jh-light pl-3">
                        <li>
                          <Link
                            href="/shop"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-jh-deep hover:bg-jh-light"
                          >
                            Shop all products
                          </Link>
                        </li>
                        {menu.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/shop/${category.slug}`}
                              onClick={() => setMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm hover:bg-jh-light"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-line mt-4 w-full text-center text-jh-navy">
              Contact us
            </Link>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
