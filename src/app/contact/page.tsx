import { ArrowRight, Building2, ChevronDown, Clock, HeartHandshake, Mail, MapPin, MessageCircle, Phone, Sparkles, Warehouse } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BulkQuote } from "@/components/home/bulk-quote";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Contact Jana Human Hair: call, WhatsApp or email us, visit our warehouse in Purba Midnapore or our office in Kolkata, or ask for a bulk quote. We reply to quotes within 2 hours.",
  alternates: { canonical: "/contact" },
};

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/** Four true facts (in place of the design's invented capacity, flight and certification figures). */
const FACTS = [
  { label: "Quote replies", value: "Within 2 hours", note: "By email or WhatsApp" },
  { label: "Our craft", value: "5 decades", note: "Of hair work in Midnapore" },
  { label: "Shipped to", value: "4 continents", note: "And across India" },
  { label: "Talk to us", value: "2 phone lines", note: "Call or WhatsApp" },
];

/** Questions with true answers only (the design's kg tiers, lab tests, transit times and percentages left out). */
const FAQS = [
  {
    q: "Is there a minimum order?",
    a: [
      "No. You can order a single piece at the single price. Each product also shows its bulk minimum: from that many pieces, the lower bulk price applies on its own.",
      "Different lengths and textures of the same product count together towards the bulk minimum.",
    ],
  },
  {
    q: "What is the difference between Remy and Non-Remy hair?",
    a: [
      "Remy hair comes from a single donor, with every cuticle intact and running in one direction, so it stays smooth and tangle-free for longer. Our Virgin Remy hair is temple-sourced.",
      "Non-Remy hair is collected from several sources and processed to align the strands: a more affordable choice with a full, polished finish.",
    ],
  },
  {
    q: "Can you colour the hair or put our own label on it?",
    a: [
      "Yes. We bleach and colour on request (for example 613 blonde), and offer private labelling with branded wraps for your business. Tell us what you need in the quote form and we'll reply with options and a price.",
    ],
  },
  {
    q: "How can I pay, and where do you ship?",
    a: [
      "Pay online with UPI, cards or net banking, or by bank transfer for bulk orders. We ship across India and to customers on four continents. Ask us for delivery times to your country.",
    ],
  },
];

const mapLink = (lines: readonly string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(", "))}`;

/** The contact page (owner's design, phase J4), with Jana's real details only. */
export default function ContactPage() {
  const [warehouse, office] = site.addresses;
  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full bg-jh-light px-4 py-2.5 text-sm text-muted-foreground sm:px-6">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl">
          <Link href="/" className="hover:text-jh-deep hover:underline">
            Home
          </Link>{" "}
          / <span aria-current="page" className="font-semibold text-jh-navy">Contact us</span>
        </nav>
      </div>

      {/* Opening */}
      <section className="w-full bg-white px-4 pt-10 pb-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className={`${EYEBROW} inline-flex items-center gap-2 rounded-full bg-jh-light px-3 py-1 text-jh-deep`}>
              <HeartHandshake aria-hidden className="size-3.5" />
              Straight from Purba Midnapore
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-jh-navy sm:text-4xl">Contact Jana Human Hair</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground sm:text-lg">
              Talk to us about an order, a bulk quote, samples, colouring or private labelling. We reply to quote
              requests within <strong className="text-jh-navy">2 hours</strong>, by email or WhatsApp.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-jh-light p-4 sm:p-5 md:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className={`${EYEBROW} order-1 text-jh-deep`}>{fact.label}</dt>
                <dd className="order-2 font-heading text-xl font-bold text-jh-navy sm:text-2xl">{fact.value}</dd>
                <dd className="order-3 text-sm text-muted-foreground">{fact.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Ways to reach us */}
      <section aria-labelledby="reach-heading" className="w-full bg-white px-4 pt-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className={`${EYEBROW} text-jh-deep`}>Ways to reach us</p>
            <h2 id="reach-heading" className="mt-1 text-2xl font-semibold text-jh-navy sm:text-3xl">
              Our places and our phone lines
            </h2>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            <li className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md ring-1 ring-border">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-lg bg-jh-light text-jh-deep">
                  <Warehouse aria-hidden className="size-6" />
                </span>
                <span className="rounded-full bg-jh-light px-2.5 py-1 text-xs font-bold text-jh-navy">Where the hair is made</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-jh-navy">{warehouse.label}, Purba Midnapore</h3>
                <p className="mt-1 text-sm text-muted-foreground">Where our artisans sort, draw and finish every bundle by hand.</p>
              </div>
              <address className="flex items-start gap-2 rounded-lg bg-jh-light/70 p-3 text-sm not-italic">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-deep" />
                <span>{warehouse.lines.join(", ")}</span>
              </address>
              <a href={mapLink(warehouse.lines)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
                Open in Google Maps <ArrowRight aria-hidden className="size-4" />
              </a>
            </li>

            <li className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md ring-1 ring-border">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-lg bg-jh-light text-jh-deep">
                  <Building2 aria-hidden className="size-6" />
                </span>
                <span className="rounded-full bg-jh-light px-2.5 py-1 text-xs font-bold text-jh-navy">Orders &amp; accounts</span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-jh-navy">{office.label}, Kolkata</h3>
                <p className="mt-1 text-sm text-muted-foreground">For orders, quotes, invoices and anything about your account.</p>
              </div>
              <address className="flex flex-col gap-2 rounded-lg bg-jh-light/70 p-3 text-sm not-italic">
                <span className="flex items-start gap-2">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-deep" />
                  <span>{office.lines.join(", ")}</span>
                </span>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 font-semibold text-jh-navy hover:text-jh-deep hover:underline">
                  <Mail aria-hidden className="size-4 shrink-0 text-jh-deep" />
                  {site.email}
                </a>
              </address>
              <a href={mapLink(office.lines)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-jh-deep hover:underline">
                Open in Google Maps <ArrowRight aria-hidden className="size-4" />
              </a>
            </li>

            <li className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-jh-navy p-6 text-white shadow-lg">
              <div aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 size-44 rounded-full bg-jh-bright/15 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-lg bg-white/10 text-jh-bright">
                  <MessageCircle aria-hidden className="size-6" />
                </span>
                <span className="rounded-full bg-jh-bright px-2.5 py-1 text-xs font-bold text-jh-navy">Quickest</span>
              </div>
              <div className="relative">
                <h3 className="font-heading text-xl font-semibold">Call or WhatsApp us</h3>
                <p className="mt-1 text-sm text-white/75">Ask about products, prices, colours or an order you&apos;ve placed.</p>
              </div>
              <ul className="relative flex flex-col gap-2 rounded-lg bg-white/10 p-3">
                {site.phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className="flex items-center gap-2 font-heading text-lg font-bold tracking-wide hover:text-jh-bright">
                      <Phone aria-hidden className="size-4 text-jh-bright" />
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-jh-bright px-4 py-3 text-sm font-bold text-jh-navy shadow-md transition-colors hover:bg-white"
              >
                <MessageCircle aria-hidden className="size-5" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* The quote form (the same one as on the home page) */}
      <BulkQuote />

      {/* Questions */}
      <section aria-labelledby="faq-heading" className="w-full bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <div className="text-center">
            <p className={`${EYEBROW} text-jh-deep`}>Good to know</p>
            <h2 id="faq-heading" className="mt-2 text-2xl font-semibold text-jh-navy sm:text-3xl">
              Questions we&apos;re often asked
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <details key={faq.q} open={i === 0} className="group rounded-xl bg-jh-light/60 ring-1 ring-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-jh-navy [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown aria-hidden className="size-5 shrink-0 text-jh-deep transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col gap-2 px-5 pb-5 text-muted-foreground">
                  {faq.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-jh-light p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-jh-deep shadow-sm">
                <Sparkles aria-hidden className="size-6" />
              </span>
              <div>
                <p className="font-bold text-jh-navy">Something else in mind?</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock aria-hidden className="size-4" /> Call us and talk to the team directly.
                </p>
              </div>
            </div>
            <a
              href={telHref(site.phones[0])}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-jh-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-jh-deep"
            >
              <Phone aria-hidden className="size-4" />
              Call {site.phones[0]}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
