import { Gem, HandHeart, Quote } from "lucide-react";
import Image from "next/image";
import { ContactButton } from "@/components/contact/contact-button";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/home/product-card";
import { Testimonials } from "@/components/home/testimonials";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { ceo, story, whyUs } from "@/content/home";
import { products } from "@/content/products";

const WHY_ICONS = [Gem, HandHeart];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The CEO's words */}
      <section aria-label="A word from our CEO" className="bg-white py-16 sm:py-20">
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <figure>
            <Quote aria-hidden className="mx-auto size-10 text-jh-bright" />
            <blockquote className="mt-3 font-heading text-2xl leading-snug font-medium text-jh-navy sm:text-3xl">
              {ceo.quote}
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold">{ceo.name}</span>
              <span className="block text-muted-foreground">{ceo.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Our story */}
      <Section labelledBy="story-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="story-heading" eyebrow="Our heritage" title={story.title} align="left" />
            {story.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="mt-5 leading-relaxed text-muted-foreground">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] shadow-xl shadow-jh-navy/10">
              <Image
                src="/images/about/team-gathering.webp"
                alt="A gathering of the Jana Human Hair team"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-border sm:-left-6">
              <p className="font-heading text-2xl font-semibold text-jh-navy">Purba Midnapore</p>
              <p className="text-sm text-muted-foreground">West Bengal, India</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Products */}
      <Section labelledBy="products-heading" className="bg-white">
        <SectionHeading
          id="products-heading"
          eyebrow="What we make"
          title="Our products"
          intro="Raw hair and finished pieces for wig makers, extension manufacturers and salons around the world."
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <li key={product.slug}>
              <Reveal delay={0.06 * i} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Why us */}
      <Section labelledBy="why-heading">
        <SectionHeading id="why-heading" eyebrow="Why Jana Human Hair" title={whyUs.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {whyUs.points.map((point, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <Reveal key={point.title} delay={0.08 * i}>
                <div className="h-full rounded-[1.75rem] bg-white p-8 shadow-sm ring-1 ring-border">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-jh-light text-jh-deep">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold">{point.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{point.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Testimonials */}
      <Section labelledBy="reviews-heading" className="bg-white">
        <SectionHeading id="reviews-heading" eyebrow="Trusted worldwide" title="What our customers say" />
        <Testimonials />
      </Section>

      {/* Invitation */}
      <section aria-labelledby="cta-heading" className="px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-jh-navy px-6 py-14 text-center text-white sm:px-12">
          <h2 id="cta-heading" className="text-3xl font-semibold sm:text-4xl">
            Looking for a reliable supplier of human hair?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Tell us the textures, lengths, colours and quantities you need, and we&apos;ll get back to you with
            the right solution for your business.
          </p>
          <ContactButton className="mt-8 h-12 px-7 text-base">Contact us</ContactButton>
        </Reveal>
      </section>
    </>
  );
}
