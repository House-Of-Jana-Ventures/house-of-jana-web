"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Your details" },
  { href: "/account/password", label: "Password" },
] as const;

/** My account's sections: a side menu, or a row of tabs that scrolls sideways on phones. */
export function AccountNav() {
  const path = usePathname();
  const current = (href: string) => (href === "/account" ? path === href : path === href || path.startsWith(`${href}/`));
  return (
    <nav aria-label="My account">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
        {SECTIONS.map((s) => (
          <li key={s.href} className="shrink-0">
            <Link
              href={s.href}
              aria-current={current(s.href) ? "page" : undefined}
              className={cn(
                "block rounded-full px-4 py-2 text-sm whitespace-nowrap ring-1 ring-border hover:bg-white lg:rounded-xl lg:ring-0",
                current(s.href) && "bg-jh-bright font-semibold text-jh-navy ring-jh-bright hover:bg-jh-bright lg:bg-white lg:text-jh-deep lg:shadow-sm",
              )}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
