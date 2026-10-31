import { ArrowRight, Factory, FileText, Layers, Package, Palette, Percent, Sparkles, SlidersHorizontal, Tag } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { MenuCategory } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/**
 * The shop's listing pages in the owner's design (phase J4), with the real
 * shop: real categories, products, ₹ prices and the bulk-price rule. The
 * design's stock levels, lot numbers, dollar tiers, grades and lab figures
 * are left out.
 */

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/** The page's title, a line of text, the number of products and a way to ask for a quote. */
export function CatalogHeader({
  eyebrow,
  title,
  intro,
  status,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  status?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <section className="w-full bg-white px-4 py-10 shadow-[0_4px_20px_rgba(11,37,69,0.04)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {breadcrumb}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className={`${EYEBROW} inline-flex items-center gap-2 rounded-full bg-jh-light px-3 py-1 text-jh-deep`}>
              <Factory aria-hidden className="size-3.5" />
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-jh-navy sm:text-4xl">{title}</h1>
            <p className="mt-2 text-muted-foreground">{intro}</p>
          </div>
          <Link
            href="/#quick-rfq"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-jh-deep px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-jh-navy lg:self-auto"
          >
            <FileText aria-hidden className="size-4" />
            Request a bulk quote
          </Link>
        </div>
        {status ? <div className="rounded-xl bg-jh-light px-4 py-3 text-sm text-muted-foreground">{status}</div> : null}
      </div>
    </section>
  );
}

/** "How our prices work": the shop's one rule, shown plainly (in place of the design's made-up kg tiers). */
export function PricesBand({ bulkMinQty }: { bulkMinQty: number }) {
  const tiers = [
    { label: "Small orders", range: bulkMinQty > 2 ? `1 – ${bulkMinQty - 1} pieces` : "1 piece", note: "Single price", tone: "bg-white/5" },
    { label: "Bulk", range: `${bulkMinQty}+ pieces`, note: "Lower bulk price", tone: "bg-jh-deep" },
    { label: "Mix & match", range: "All options count", note: "Lengths & textures together", tone: "bg-white/10" },
  ];
  return (
    <section aria-labelledby="prices-heading" className="w-full bg-jh-navy px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 lg:flex-row">
        <div className="text-center lg:text-left">
          <p className={`${EYEBROW} flex items-center justify-center gap-1.5 text-jh-bright lg:justify-start`}>
            <Percent aria-hidden className="size-4" /> Automatic bulk prices
          </p>
          <h2 id="prices-heading" className="mt-1 text-2xl font-semibold">
            How our prices work
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/75">
            Every product has a single price and a lower bulk price. The bulk price applies on its own from the
            product&apos;s bulk minimum, shown on each product (usually {bulkMinQty} pieces).
          </p>
        </div>
        <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
          {tiers.map((tier) => (
            <li key={tier.label} className={cn("flex flex-col items-center justify-center rounded-lg p-3 text-center", tier.tone)}>
              <span className="text-[0.7rem] font-semibold tracking-wider text-white uppercase">{tier.label}</span>
              <span className="my-0.5 text-lg font-bold">{tier.range}</span>
              <span className="text-xs font-semibold text-white">{tier.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The left column: the categories, any filters for this page, and a custom-request box. */
export function CatalogSidebar({
  menu,
  current,
  children,
}: {
  menu: MenuCategory[];
  current: string | null;
  children?: ReactNode;
}) {
  const link = (active: boolean) =>
    cn(
      "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-jh-light",
      active && "bg-jh-light font-semibold text-jh-navy",
    );
  return (
    <aside className="flex flex-col gap-5 lg:col-span-3">
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
        <h2 className="flex items-center gap-1.5 font-sans text-base font-bold text-jh-navy">
          <SlidersHorizontal aria-hidden className="size-4 text-jh-deep" />
          Browse the shop
        </h2>
        <nav aria-label="Categories">
          <p className={`${EYEBROW} mb-1.5 text-muted-foreground`}>Categories</p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link href="/shop" aria-current={current === null ? "page" : undefined} className={link(current === null)}>
                All products
              </Link>
            </li>
            {menu.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop/${category.slug}`}
                  aria-current={current === category.slug ? "page" : undefined}
                  className={link(current === category.slug)}
                >
                  {category.name}
                  <span className="text-xs text-muted-foreground">{category.productCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </div>
      {/* Computers only: on a phone it would push the products down (the sections below cover it). */}
      <div className="hidden flex-col gap-2 rounded-xl bg-jh-navy p-4 text-white shadow-sm lg:flex">
        <p className={`${EYEBROW} text-jh-bright`}>Custom requests</p>
        <p className="font-bold">Need a colour, length or your own label?</p>
        <p className="text-sm text-white/75">
          We bleach and colour on request (e.g. 613 blonde) and offer private labelling and branded wraps.
        </p>
        <Link href="/#quick-rfq" className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-jh-bright hover:text-white">
          Tell us what you need <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

/** "Why buyers choose Jana": three true points. */
export function WhyJana() {
  const points = [
    {
      icon: Sparkles,
      title: "Temple-sourced hair",
      text: "Single-donor temple hair, responsibly collected, alongside Non-Remy hair for affordable volume.",
    },
    {
      icon: Layers,
      title: "Sorted and drawn by hand",
      text: "Skilled artisans in Purba Midnapore sort and draw every bundle, single drawn or double drawn.",
    },
    {
      icon: Palette,
      title: "Colour and labelling on request",
      text: "Custom bleaching and colouring, and private labelling with branded wraps for your business.",
    },
  ];
  return (
    <section aria-labelledby="why-heading" className="w-full bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className={`${EYEBROW} text-jh-deep`}>Straight from Midnapore</p>
          <h2 id="why-heading" className="mt-2 text-2xl font-semibold text-jh-navy sm:text-3xl">
            Why buyers choose Jana Human Hair
          </h2>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-2 rounded-xl bg-jh-light p-6">
              <span className="flex size-12 items-center justify-center rounded-lg bg-jh-bright/25 text-jh-deep">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="font-sans text-lg font-bold text-jh-navy">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Not sure which hair?": ask about samples or a quote (in place of the design's priced sample kit). */
export function SamplesBand() {
  return (
    <section aria-labelledby="samples-heading" className="w-full bg-gradient-to-r from-jh-navy via-[#0e2f57] to-jh-navy px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 lg:flex-row">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-jh-bright text-jh-navy shadow-lg">
            <Package aria-hidden className="size-7" />
          </span>
          <div>
            <p className={`${EYEBROW} text-jh-bright`}>Not sure which hair to choose?</p>
            <h2 id="samples-heading" className="mt-1 text-xl font-semibold sm:text-2xl">
              Ask us about samples before you buy in bulk
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-white/75">
              Tell us the textures and lengths you&apos;re considering, and we&apos;ll reply with options and a quote,
              within 2 hours.
            </p>
          </div>
        </div>
        <Link
          href="/#quick-rfq"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-jh-bright px-6 py-3.5 text-sm font-bold text-jh-navy shadow-md transition-colors hover:bg-white sm:w-auto"
        >
          <Tag aria-hidden className="size-4" />
          Ask about samples
        </Link>
      </div>
    </section>
  );
}
