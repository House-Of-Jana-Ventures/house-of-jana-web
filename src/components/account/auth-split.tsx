import { ArrowRight, BadgeIndianRupee, CreditCard, MessageCircle, Package, Palette, Percent, Phone, Quote, ReceiptText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ceo } from "@/content/home";
import { site, telHref } from "@/content/site";
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
    text: "Every product shows both. The bulk price applies on its own from the product's bulk minimum.",
  },
  {
    icon: ReceiptText,
    title: "Follow your orders",
    text: "See every order, cancel before paying, and order the same again in one click.",
  },
  {
    icon: Palette,
    title: "Colour and private labels",
    text: "Custom bleaching and colouring on request, and private labelling with branded wraps.",
  },
  {
    icon: CreditCard,
    title: "Pay your way",
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
          <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-jh-navy p-6 text-white sm:p-10 lg:col-span-7 lg:p-12">
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
              {PERKS.map(({ icon: Icon, title: perk, text }) => (
                <li key={perk} className="rounded-lg bg-white/[0.06] p-4">
                  <Icon aria-hidden className="mb-2 size-6 text-jh-bright" />
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
          <div className="flex flex-col p-6 sm:p-10 lg:col-span-5">
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
          </div>
        </div>
      </section>

      {/* Ways to get help */}
      <section aria-label="Help with ordering" className="w-full px-4 pb-14 sm:px-6">
        <ul className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="flex size-11 items-center justify-center rounded-lg bg-jh-navy text-white">
              <Percent aria-hidden className="size-5" />
            </span>
            <h2 className="font-sans text-lg font-bold text-jh-navy">How prices work</h2>
            <p className="text-sm text-muted-foreground">One price for small quantities, a lower bulk price from each product&apos;s bulk minimum.</p>
            <Link href="/shop" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
              See the shop <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="flex size-11 items-center justify-center rounded-lg bg-jh-navy text-white">
              <Package aria-hidden className="size-5" />
            </span>
            <h2 className="font-sans text-lg font-bold text-jh-navy">Not sure what to order?</h2>
            <p className="text-sm text-muted-foreground">Ask about samples or a bulk quote. We reply within 2 hours.</p>
            <Link href="/#quick-rfq" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
              Request a quote <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
          <li className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <span className="flex size-11 items-center justify-center rounded-lg bg-jh-navy text-white">
              <MessageCircle aria-hidden className="size-5" />
            </span>
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
