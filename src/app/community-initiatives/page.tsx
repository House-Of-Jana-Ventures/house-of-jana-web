import { ArrowUpRight, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";
import { Gallery } from "@/components/community/gallery";
import { Reveal } from "@/components/site/reveal";
import { PageBanner, Section, SectionHeading } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { handcrafted, livelihoods, partnership } from "@/content/community";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community Initiatives",
  description:
    "Jana Human Hair's partnership with The Wings of Hope Charitable Trust, supporting livelihoods for displaced communities in Manipur.",
  alternates: { canonical: "/community-initiatives" },
};

export default function CommunityPage() {
  return (
    <>
      <PageBanner
        eyebrow="Community initiatives"
        title="Our philanthropic journey"
        intro="Giving back to the communities that make our work possible."
        image="/images/banners/community.webp"
      />

      <Section labelledBy="partnership-heading" className="bg-white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-jh-light text-jh-deep">
              <HeartHandshake aria-hidden className="size-7" />
            </span>
            <h2 id="partnership-heading" className="mt-6 text-3xl font-semibold sm:text-4xl">
              {partnership.title}
            </h2>
          </Reveal>
          {partnership.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{paragraph}</p>
            </Reveal>
          ))}
          <Reveal>
            <div className="mt-8 flex flex-col items-start gap-4 rounded-[1.75rem] bg-jh-light p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">{partnership.joinText}</p>
              <a
                href={partnership.joinHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), "h-11 shrink-0 rounded-full px-5 font-semibold")}
              >
                Join us
                <ArrowUpRight aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="livelihoods-heading">
        <SectionHeading id="livelihoods-heading" eyebrow="WHCT" title={livelihoods.title} intro={livelihoods.text} />
        <Reveal>
          <ol className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {livelihoods.steps.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-border"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-jh-bright text-xs font-semibold text-jh-navy">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section labelledBy="handcrafted-heading" className="bg-white">
        <SectionHeading
          id="handcrafted-heading"
          eyebrow="Made by the project's artisans"
          title="Handcrafted products"
          intro="Bags, baskets, toys and accessories made by the artisans the livelihoods project supports."
        />
        <Gallery photos={handcrafted} />
      </Section>
    </>
  );
}
