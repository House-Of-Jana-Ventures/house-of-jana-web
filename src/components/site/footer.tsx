import { Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactTrigger } from "@/components/contact/contact-button";
import { nav, site, telHref } from "@/content/site";
import { getMenu } from "@/lib/shop/api";

/** This year, captured when the page is built and refreshed daily. */
async function thisYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const LINK = "text-white/80 transition-colors hover:text-white hover:underline";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3 text-sm">{children}</ul>
    </div>
  );
}

/**
 * Navy, four simple columns: Shop (the shop's own categories), Company, Help
 * and Get in touch (phase J3).
 */
export async function Footer() {
  const [year, menu] = await Promise.all([thisYear(), getMenu()]);
  return (
    <footer className="mt-auto bg-jh-navy text-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex self-start rounded-sm bg-white px-4 py-2">
            <Image src="/images/logo-strong.png" alt="Jana Human Hair" width={317} height={140} className="h-12 w-auto" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/75">
            Natural human hair, handcrafted in Purba Midnapore, West Bengal, and exported across four
            continents. A unit of {site.legalName}
          </p>
        </div>

        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
          <Column title="Shop">
            <li>
              <Link href="/shop" className={LINK}>
                Shop all
              </Link>
            </li>
            {(menu ?? []).map((category) => (
              <li key={category.id}>
                <Link href={`/shop/${category.slug}`} className={LINK}>
                  {category.name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Company">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Help">
            <li>
              <ContactTrigger className={`${LINK} text-left`}>Contact us</ContactTrigger>
            </li>
            <li>
              <ContactTrigger topic="bulk orders" className={`${LINK} text-left`}>
                Bulk enquiries
              </ContactTrigger>
            </li>
            <li>
              <Link href="/account" className={LINK}>
                My account
              </Link>
            </li>
            <li>
              <Link href="/cart" className={LINK}>
                Your cart
              </Link>
            </li>
          </Column>

          <Column title="Get in touch">
            <li>
              <a href={`mailto:${site.email}`} className={`${LINK} inline-flex items-center gap-2.5`}>
                <Mail aria-hidden className="size-4 text-jh-bright" strokeWidth={1.5} />
                {site.email}
              </a>
            </li>
            {site.phones.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)} className={`${LINK} inline-flex items-center gap-2.5`}>
                  <Phone aria-hidden className="size-4 text-jh-bright" strokeWidth={1.5} />
                  {phone}
                </a>
              </li>
            ))}
            {site.addresses.map((address) => (
              <li key={address.label} className="mt-2 flex gap-2.5 text-white/75">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-bright" strokeWidth={1.5} />
                <address className="not-italic">
                  <span className="text-white">{address.label}</span>
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            ))}
          </Column>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60 sm:px-6">
          © {year} Jana Human Hair, a unit of {site.legalName} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
