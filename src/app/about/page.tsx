import {
  ArrowDown,
  Building2,
  Check,
  Factory,
  FileText,
  Globe2,
  HandHeart,
  History,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Quote,
  ScrollText,
  Sparkles,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactTrigger } from "@/components/contact/contact-button";
import { Reveal } from "@/components/site/reveal";
import { mission, team, whatWeDo } from "@/content/about";
import { ceo, rfq, story } from "@/content/home";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Jana Human Hair: five decades of ethically sourced, handcrafted human hair from the Medinipur district of West Bengal, exported to customers across four continents.",
  alternates: { canonical: "/about" },
};

const ICONS: Record<string, LucideIcon> = {
  manufacture: Factory,
  sourcing: Leaf,
  export: Globe2,
  "supply-chain": Truck,
  compliance: ScrollText,
};

/** Four true facts for the opening. */
const FACTS: { label: string; value: string; text: string; icon: LucideIcon }[] = [
  { label: "Family craft", value: "5 decades", text: "A family business from a village in Purba Midnapore.", icon: History },
  { label: "Export", value: "4 continents", text: "Wig makers, extension brands and salons worldwide.", icon: Globe2 },
  { label: "Sourcing", value: "Temple hair", text: "Temple-sourced, single-donor hair, responsibly collected.", icon: Sparkles },
  { label: "Made by hand", value: "Midnapore", text: "Sorted and drawn by skilled local artisans.", icon: HandHeart },
];

const EYEBROW = "text-xs font-bold tracking-[0.15em] uppercase";

/**
 * The About page (phase J4, in the style of the owner's design, kept simple):
 * a navy opening with four facts, the family's story, what we do, the CEO's
 * words, where we work and an invitation to work with us. Real content only.
 */
export default function AboutPage() {
  return (
    <>
      {/* Opening */}
      <section className="relative overflow-hidden bg-jh-navy text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 [background-image:radial-gradient(#00abe4_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className={`${EYEBROW} inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-jh-bright`}>
                <span aria-hidden className="size-2 rounded-full bg-jh-bright" />
                {site.legalName}
              </p>
              <h1 className="mt-5 text-4xl leading-tight font-semibold sm:text-5xl lg:text-[3.25rem]">About Jana Human Hair</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
                A family business from West Bengal, crafting natural human hair for the world for five decades, with
                hair sorted and drawn by hand in Purba Midnapore.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/#quick-rfq"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-jh-bright px-6 py-3.5 text-sm font-bold text-jh-navy shadow-lg transition-colors hover:bg-white"
              >
                <FileText aria-hidden className="size-4" />
                Request a bulk quote
              </Link>
              <a
                href="#story"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/20"
              >
                Our story
                <ArrowDown aria-hidden className="size-4" />
              </a>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(({ label, value, text, icon: Icon }) => (
              <div key={label} className="flex flex-col gap-4 rounded-xl bg-white/[0.06] p-6">
                <dt className={`${EYEBROW} flex items-center justify-between text-jh-bright`}>
                  {label}
                  <Icon aria-hidden className="size-5" />
                </dt>
                <dd>
                  <span className="block font-heading text-3xl font-semibold">{value}</span>
                  <span className="mt-1 block text-sm text-white/70">{text}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The story */}
      <section id="story" aria-labelledby="story-heading" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <Reveal zoom className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/about/community-meeting.webp"
                alt="Artisans and community members meeting with the Jana Human Hair team"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-jh-navy/80 via-transparent to-transparent" />
              <p className="absolute inset-x-5 bottom-5 rounded-xl bg-white/95 p-4 backdrop-blur-md">
                <span className={`${EYEBROW} block text-jh-deep`}>Founded by</span>
                <span className="mt-1 block font-heading text-lg text-jh-navy">Shri Bishnupada Jana &amp; Smt Manimala Jana</span>
              </p>
            </div>
          </Reveal>
          <div className="flex flex-col gap-5 lg:col-span-7">
            <div>
              <p className={`${EYEBROW} text-jh-deep`}>Our heritage</p>
              <h2 id="story-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
                From a Midnapore village to four continents
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">{story.paragraphs[0]}</p>
            <p className="leading-relaxed text-muted-foreground">{story.paragraphs[1]}</p>
            <p className="border-l-2 border-jh-bright pl-4 leading-relaxed text-jh-navy italic">{mission}</p>
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="rounded-xl bg-jh-light p-5">
                <p className="mb-1 flex items-center gap-2 font-bold text-jh-navy">
                  <Users aria-hidden className="size-5 text-jh-deep" />
                  Artisans who are family
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{team[0]}</p>
              </div>
              <div className="rounded-xl bg-jh-light p-5">
                <p className="mb-1 flex items-center gap-2 font-bold text-jh-navy">
                  <Leaf aria-hidden className="size-5 text-jh-deep" />
                  Ethical, responsible sourcing
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{team[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section aria-labelledby="what-heading" className="bg-jh-light py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className={`${EYEBROW} text-jh-deep`}>Here&apos;s what we do</p>
            <h2 id="what-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
              From hand-picked hair to the world
            </h2>
            <p className="mt-3 text-muted-foreground">
              We serve both domestic and international markets, as a manufacturer and a B2B exporter.
            </p>
          </div>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whatWeDo.map((item) => {
              const Icon = ICONS[item.id] ?? Factory;
              return (
                <li key={item.id} className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="mb-4 flex size-12 items-center justify-center rounded-lg bg-jh-light text-jh-deep">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="font-sans text-base font-bold text-jh-navy">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* The CEO's words */}
      <section aria-label="A word from our CEO" className="bg-jh-navy py-16 text-white sm:py-20">
        <figure className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <Quote aria-hidden className="size-10 text-jh-bright/70" />
          <blockquote className="font-heading text-2xl leading-snug sm:text-3xl">“{ceo.quote}”</blockquote>
          <figcaption className="flex items-center gap-3">
            <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-jh-bright text-sm font-bold text-jh-navy">
              SJ
            </span>
            <span className="text-left">
              <span className="block font-bold">{ceo.name}</span>
              <span className="text-sm text-jh-bright">CEO, {site.legalName}</span>
            </span>
          </figcaption>
        </figure>
      </section>

      {/* Where we work */}
      <section aria-labelledby="places-heading" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className={`${EYEBROW} text-jh-deep`}>Where we work</p>
            <h2 id="places-heading" className="mt-2 text-3xl font-semibold text-jh-navy sm:text-4xl">
              Our warehouse and office
            </h2>
            <p className="mt-3 text-muted-foreground">From Purba Midnapore and Kolkata, to customers across India and abroad.</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {site.addresses.map((address, i) => {
              const Icon = i === 0 ? Factory : Building2;
              return (
                <li key={address.label} className="flex gap-4 rounded-2xl bg-jh-light p-6 sm:p-8">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-jh-deep shadow-sm">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold text-jh-navy">{address.label}</h3>
                    <address className="mt-2 flex gap-2 text-muted-foreground not-italic">
                      <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-jh-deep" />
                      <span>
                        {address.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </address>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Work with us */}
      <section aria-labelledby="partner-heading" className="border-t border-white/10 bg-jh-navy py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <p className={`${EYEBROW} text-jh-bright`}>Work with us</p>
            <h2 id="partner-heading" className="text-3xl font-semibold sm:text-4xl lg:text-5xl lg:leading-tight">
              Work with a family-run hair manufacturer
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-white/75">
              Buy straight from the people who sort and draw the hair. Tell us what you need, and we&apos;ll send you
              a quote.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/#quick-rfq"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-jh-bright px-7 py-3.5 text-sm font-bold text-jh-navy shadow-xl transition-colors hover:bg-white"
              >
                <FileText aria-hidden className="size-4" />
                Request a bulk quote
              </Link>
              <ContactTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                Contact us
              </ContactTrigger>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:col-span-5">
            <h3 className="font-sans text-lg font-bold">What you can count on</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              {[...rfq.benefits.slice(0, 3), rfq.response].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-jh-bright" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1.5 border-t border-white/15 pt-4 text-sm">
              <a href={telHref(site.phones[0])} className="flex items-center gap-2 font-semibold hover:underline">
                <Phone aria-hidden className="size-4 text-jh-bright" />
                {site.phones[0]}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-white/80 hover:underline">
                <Mail aria-hidden className="size-4 text-jh-bright" />
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
