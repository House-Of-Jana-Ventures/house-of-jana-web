import { Factory, Globe2, Leaf, ScrollText, Truck, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactButton } from "@/components/contact/contact-button";
import { Reveal } from "@/components/site/reveal";
import { PageBanner, Section, SectionHeading } from "@/components/site/section";
import { mission, team, whatWeDo } from "@/content/about";

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

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="About us"
        title="About Jana Human Hair"
        intro="A family business from West Bengal, crafting natural human hair for the world."
        image="/images/banners/about.webp"
      />

      <Section labelledBy="mission-heading" className="bg-white">
        <SectionHeading id="mission-heading" eyebrow="Our mission" title="Simple, yet powerful" />
        <Reveal>
          <blockquote className="mx-auto mt-10 max-w-4xl text-center font-heading text-xl leading-relaxed text-jh-navy sm:text-2xl">
            “{mission}”
          </blockquote>
        </Reveal>
      </Section>

      <Section labelledBy="team-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal zoom className="order-last lg:order-first">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-xl shadow-jh-navy/10">
              <Image
                src="/images/about/community-meeting.webp"
                alt="Artisans and community members meeting with the Jana Human Hair team"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading id="team-heading" eyebrow="Our team" title="Artisans who are family" align="left" />
            {team.map((paragraph, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p className="mt-5 leading-relaxed text-muted-foreground">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section labelledBy="what-heading" className="bg-white">
        <SectionHeading
          id="what-heading"
          eyebrow="Here's what we do"
          title="From hand-picked hair to the world"
          intro="We serve both domestic and international markets, as a manufacturer and a B2B exporter."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whatWeDo.map((item, i) => {
            const Icon = ICONS[item.id] ?? Factory;
            return (
              <li key={item.id} className={i === 0 ? "md:col-span-2 lg:col-span-1" : undefined}>
                <Reveal delay={0.05 * i} className="h-full">
                  <div className="group h-full rounded-[1.75rem] bg-jh-light/60 p-7 ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:bg-jh-light hover:shadow-md">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-jh-deep shadow-sm transition-all duration-300 group-hover:-rotate-6 group-hover:bg-jh-bright group-hover:text-jh-navy">
                      <Icon aria-hidden className="size-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <Reveal className="mt-12 text-center">
          <ContactButton className="h-12 px-7 text-base">Talk to us about your needs</ContactButton>
        </Reveal>
      </Section>
    </>
  );
}
