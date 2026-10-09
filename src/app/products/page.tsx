import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactButton } from "@/components/contact/contact-button";
import { Reveal } from "@/components/site/reveal";
import { PageBanner, Section, SectionHeading } from "@/components/site/section";
import { products, quality } from "@/content/products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Non-Remy double drawn and Virgin Remy single drawn human hair, wefts, extensions and wigs, in many textures and natural colours, for businesses worldwide.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Our products"
        title="Discover the perfect hair for every need"
        intro="We create value through quality, authenticity, inclusivity and creativity, so every client has access to high-quality hair, whatever the type or texture. And we're open about our products, sourcing and processes."
        image="/images/banners/products.webp"
      />

      <Section className="bg-white" labelledBy="range-heading">
        <h2 id="range-heading" className="sr-only">
          Our range
        </h2>
        <div className="flex flex-col gap-20 sm:gap-24">
          {products.map((product, i) => (
            <article
              key={product.slug}
              id={product.slug}
              aria-labelledby={`${product.slug}-name`}
              className="grid scroll-mt-28 items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <Reveal className={cn(i % 2 === 1 && "md:order-last")}>
                <div className="relative mx-auto aspect-square w-full max-w-sm">
                  <span aria-hidden className="absolute inset-4 rounded-full bg-jh-bright/15 blur-2xl" />
                  <div className="relative size-full overflow-hidden rounded-full ring-8 ring-jh-light">
                    <Image
                      src={product.image}
                      alt={`${product.name} human hair`}
                      fill
                      sizes="(min-width: 768px) 384px, 80vw"
                      className="scale-[1.42] object-cover transition-transform duration-700 hover:scale-[1.5]"
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-xs font-semibold tracking-[0.25em] text-jh-deep uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 id={`${product.slug}-name`} className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {product.name}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {product.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-jh-deep" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <ContactButton topic={product.name} className="mt-8">
                  Enquire about {product.name}
                </ContactButton>
              </Reveal>
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="quality-heading">
        <SectionHeading id="quality-heading" eyebrow="Our promise" title="Our commitment to quality" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {quality.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={0.08 * i} className="h-full">
                <div className="group flex h-full flex-col items-center rounded-[1.75rem] bg-white p-7 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="relative block size-36 overflow-hidden rounded-full ring-4 ring-jh-light">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="144px"
                      className="scale-[1.42] object-cover transition-transform duration-500 group-hover:scale-[1.5]"
                    />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
