import { ArrowRight, BadgeIndianRupee, CreditCard, MessageCircle, Package, Palette, Phone, Quote, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ceo } from "@/content/home";
import { site, telHref } from "@/content/site";
import { getMenu } from "@/lib/shop/api";
import { cn } from "@/lib/utils";

/** Where to go after signing in, and an item waiting to be added, carried between the two pages. */
export function carriedQuery(next: string, add: string): string {
  return `?next=${encodeURIComponent(next)}${add ? `&add=${encodeURIComponent(add)}` : ""}`;
}

/** True reasons to have an account (in place of the design's invented portal perks). */
const PERKS = [
  {
    icon: BadgeIndianRupee,
    title: "Single and bulk prices",
    tag: "Prices in ₹",
    text: "Every product shows both. The bulk price applies on its own from the product's bulk minimum.",
  },
  {
    icon: ReceiptText,
    title: "Follow your orders",
    tag: "Order again",
    text: "See every order, cancel before paying, and order the same again in one click.",
  },
  {
    icon: Palette,
    title: "Colour and private labels",
    tag: "On request",
    text: "Custom bleaching and colouring on request, and private labelling with branded wraps.",
  },
  {
    icon: CreditCard,
    title: "Pay your way",
    tag: "UPI & cards",
    text: "Pay online with UPI, cards or net banking, or by bank transfer for bulk orders.",
  },
];

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/**
 * The sign-in and create-account pages (owner's design, phase J4): a navy
 * welcome with what an account gives you, beside the real form, with links
 * between the two pages, and three ways to get help below.
 */
export function AuthSplit({
  active,
  query,
  title,
  intro,
  children,
}: {
  active: "sign-in" | "register";
  /** `?next=…&add=…`, kept when switching between the two pages. */
  query: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const tab = (on: boolean) =>
    cn(
      "flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-all",
      on ? "bg-jh-navy text-white shadow-sm" : "text-muted-foreground hover:text-jh-navy",
    );
  return (
    <>
      <section className="w-full px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-border lg:grid-cols-12">
          {/* The welcome */}
          <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-jh-navy p-6 text-white sm:p-10 lg:order-1 lg:col-span-7 lg:p-12">
            <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 size-80 rounded-full bg-jh-bright/15 blur-3xl" />
            <div className="relative flex flex-col gap-4">
              <p className={`${EYEBROW} inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-white`}>
                <Package aria-hidden className="size-3.5 text-jh-bright" />
                For salons, wig makers and buyers
              </p>
              <p className="font-heading text-3xl leading-tight font-semibold sm:text-4xl">Welcome to Jana Human Hair</p>
              <p className="max-w-xl text-white/75">
                One account for ordering natural human hair straight from Purba Midnapore, paying, and following
                every order.
              </p>
            </div>
            <ul className="relative grid gap-3 sm:grid-cols-2">
              {PERKS.map(({ icon: Icon, title: perk, tag, text }) => (
                <li key={perk} className="rounded-lg bg-white/[0.06] p-4 transition-colors hover:bg-white/10">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Icon aria-hidden className="size-6 text-jh-bright" />
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">{tag}</span>
                  </div>
                  <p className="font-bold">{perk}</p>
                  <p className="mt-1 text-sm text-white/70">{text}</p>
                </li>
              ))}
            </ul>
            <figure className="relative flex items-start gap-3 rounded-lg bg-white/10 p-4">
              <Quote aria-hidden className="mt-1 size-5 shrink-0 text-jh-bright" />
              <div>
                <blockquote className="font-heading text-sm leading-relaxed italic">“{ceo.quote}”</blockquote>
                <figcaption className="mt-1 text-sm">
                  <span className="font-bold">{ceo.name}</span>
                  <span className="text-white/70"> · CEO, Jana Human Hair</span>
                </figcaption>
              </div>
            </figure>
          </div>

          {/* The form */}
          <div className="order-first flex flex-col p-6 sm:p-10 lg:order-2 lg:col-span-5">
            <nav aria-label="Account" className="mb-6 flex items-center gap-1 rounded-lg bg-jh-light p-1">
              <Link href={`/sign-in${query}`} aria-current={active === "sign-in" ? "page" : undefined} className={tab(active === "sign-in")}>
                I have an account
              </Link>
              <Link href={`/register${query}`} aria-current={active === "register" ? "page" : undefined} className={tab(active === "register")}>
                I&apos;m new here
              </Link>
            </nav>
            <h1 className="text-3xl font-semibold text-jh-navy">{title}</h1>
            {intro ? <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</div> : null}
            <div className="mt-6">{children}</div>
            <div className="relative my-6 text-center">
              <div aria-hidden className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-border" />
              </div>
              <span className="relative bg-white px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Or reach us directly
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg bg-jh-light/70 p-2.5 transition-colors hover:bg-jh-light"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-jh-deep shadow-sm">
                  <MessageCircle aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-semibold text-jh-navy">WhatsApp us</span>
                  <span className="block text-xs text-muted-foreground">Questions about an order</span>
                </span>
              </a>
              <a href={telHref(site.phones[0])} className="flex items-center gap-2.5 rounded-lg bg-jh-light/70 p-2.5 transition-colors hover:bg-jh-light">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-jh-deep shadow-sm">
                  <Phone aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-semibold text-jh-navy">Call us</span>
                  <span className="block truncate text-xs text-muted-foreground">{site.phones[0]}</span>
                </span>
              </a>
            </div>
            <p className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Straight from Purba Midnapore</span>
              <span>Quote replies within 2 hours</span>
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <ShopRange />
      </Suspense>

      {/* Ways to get help */}
      <section aria-label="Help with ordering" className="w-full px-4 pb-14 sm:px-6">
        <ul className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="font-heading flex size-11 items-center justify-center rounded-lg bg-jh-navy text-lg font-bold text-white">01</span>
            <h2 className="font-sans text-lg font-bold text-jh-navy">How prices work</h2>
            <p className="text-sm text-muted-foreground">One price for small quantities, a lower bulk price from each product&apos;s bulk minimum.</p>
            <Link href="/shop" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
              See the shop <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="font-heading flex size-11 items-center justify-center rounded-lg bg-jh-navy text-lg font-bold text-white">02</span>
            <h2 className="font-sans text-lg font-bold text-jh-navy">Not sure what to order?</h2>
            <p className="text-sm text-muted-foreground">Ask about samples or a bulk quote. We reply within 2 hours.</p>
            <Link href="/#quick-rfq" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
              Request a quote <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="font-heading flex size-11 items-center justify-center rounded-lg bg-jh-navy text-lg font-bold text-white">03</span>
            <h2 className="font-sans text-lg font-bold text-jh-navy">Talk to us</h2>
            <p className="text-sm text-muted-foreground">Call us, or chat with us on WhatsApp.</p>
            <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-jh-deep">
              <a href={telHref(site.phones[0])} className="inline-flex items-center gap-1 hover:underline">
                <Phone aria-hidden className="size-4" />
                {site.phones[0]}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            </span>
          </li>
        </ul>
      </section>
    </>
  );
}

/** "What's in the shop": the real categories and how many products each has (in place of the design's live stock and dollar prices). */
async function ShopRange() {
  const menu = await getMenu();
  const categories = (menu ?? []).filter((c) => c.productCount > 0).slice(0, 4);
  if (categories.length === 0) return null;
  return (
    <section aria-labelledby="range-heading" className="w-full bg-jh-light px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className={`${EYEBROW} text-jh-deep`}>Made in Purba Midnapore</p>
            <h2 id="range-heading" className="mt-1 text-2xl font-semibold text-jh-navy">What&apos;s in the shop</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
            See everything <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/shop/${category.slug}`}
                className="flex h-full flex-col gap-1 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="self-start rounded-full bg-jh-light px-2 py-0.5 text-xs font-bold text-jh-deep">
                  {category.productCount} {category.productCount === 1 ? "product" : "products"}
                </span>
                <span className="mt-1 font-bold text-jh-navy">{category.name}</span>
                {category.description ? (
                  <span className="line-clamp-2 text-sm text-muted-foreground">{category.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
