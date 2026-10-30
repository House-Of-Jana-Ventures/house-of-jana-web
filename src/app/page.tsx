import { BestSellers } from "@/components/home/best-sellers";
import { Explainer } from "@/components/home/explainer";
import { Hero } from "@/components/home/hero";
import { Standard } from "@/components/home/standard";
import { Steps } from "@/components/home/steps";
import { Testimonials } from "@/components/home/testimonials";
import { Trade } from "@/components/home/trade";
import { TrustStrip } from "@/components/home/trust-strip";
import { Welcome } from "@/components/home/welcome";
import { Section, SectionHeading } from "@/components/site/section";

/**
 * The home page (phase J3): a calm shop layout with the family's story.
 * Photo hero → trust line → products from the shop → the
 * family and the CEO → the Jana standard → how ordering works → bulk and
 * trade → customers' words → a short explainer of the kinds of hair.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BestSellers />
      <Welcome />
      <Standard />
      <Steps />
      <Trade />
      <Section labelledBy="reviews-heading" className="border-t border-border bg-jh-light">
        <SectionHeading id="reviews-heading" eyebrow="Trusted worldwide" title="What our customers say" />
        <Testimonials />
      </Section>
      <Explainer />
    </>
  );
}
