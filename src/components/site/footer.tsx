import { Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "@/components/contact/contact-button";
import { nav, site, telHref } from "@/content/site";

/** This year, captured when the page is built and refreshed daily. */
async function thisYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Contact details (tappable), the menu, and the company line. */
export async function Footer() {
  const year = await thisYear();
  return (
    <footer className="mt-auto bg-jh-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="inline-flex rounded-2xl bg-white px-4 py-2">
            <Image src="/images/logo.png" alt="Jana Human Hair" width={317} height={140} className="h-12 w-auto" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/80">
            Natural human hair, handcrafted in Purba Midnapore, West Bengal, and exported across
            four continents. A unit of {site.legalName}
          </p>
          <ContactButton className="mt-6">Contact us</ContactButton>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-widest text-jh-bright uppercase">
            Get in touch
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2.5 text-white/90 hover:text-white hover:underline"
              >
                <Mail aria-hidden className="size-4 text-jh-bright" />
                {site.email}
              </a>
            </li>
            {site.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={telHref(phone)}
                  className="inline-flex items-center gap-2.5 text-white/90 hover:text-white hover:underline"
                >
                  <Phone aria-hidden className="size-4 text-jh-bright" />
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-col gap-4 text-sm text-white/80">
            {site.addresses.map((address) => (
              <li key={address.label} className="flex gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-bright" />
                <address className="not-italic">
                  <span className="font-medium text-white">{address.label}</span>
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-widest text-jh-bright uppercase">
            Explore
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/90 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/70 sm:px-6">
          © {year} Jana Human Hair, a unit of {site.legalName} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
