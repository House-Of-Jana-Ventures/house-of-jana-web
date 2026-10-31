"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { MenuCategory } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/**
 * The header's "Products" item: a panel with every category and its
 * products on sale, plus "Shop all". Opens on click (and hover with a
 * mouse), closes on Escape, outside clicks and navigation. The panel is
 * centred under the button but kept inside the screen.
 */
export function ProductsMenu({ menu, current }: { menu: MenuCategory[]; current: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [offset, setOffset] = useState(0);

  // Centre the panel under the button, but never past either edge of the screen.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = box.current?.getBoundingClientRect();
      if (!rect) return;
      const screen = document.documentElement.clientWidth;
      const width = Math.min(736, screen - 32);
      const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 16), screen - 16 - width);
      setOffset(left - rect.left);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={box}
      className="relative"
      onMouseEnter={(e) => e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === "mouse" && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex items-center gap-1 px-3 py-2 text-sm text-jh-navy/75 transition-colors hover:text-jh-navy focus-visible:outline-2 focus-visible:outline-jh-bright",
          "after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-jh-navy after:transition-transform after:duration-300 hover:after:scale-x-100",
          current && "text-jh-navy after:scale-x-100",
        )}
      >
        Products
        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full z-40 pt-3"
        style={{ left: offset }}
      >
        <div className="w-[min(46rem,calc(100vw-2rem))] rounded-3xl bg-white p-6 shadow-2xl shadow-jh-navy/15 ring-1 ring-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2">
          {menu.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menu.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/shop/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold tracking-[0.2em] text-jh-deep uppercase hover:underline"
                  >
                    {category.name}
                  </Link>
                  <ul className="mt-2 flex flex-col">
                    {[...category.products, ...category.children.flatMap((c) => c.products)].map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/shop/p/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-2 py-1.5 text-sm text-jh-navy hover:bg-jh-light"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Our online shop is being updated. Please check back soon.</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4 text-sm font-medium">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-sm bg-jh-bright px-4 py-2 text-jh-navy hover:bg-jh-bright/85"
            >
              Shop all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
