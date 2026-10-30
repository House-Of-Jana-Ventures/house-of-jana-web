import { ContactTrigger } from "@/components/contact/contact-button";
import { Reveal } from "@/components/site/reveal";
import { trade } from "@/content/home";

/** The trade banner: an invitation to businesses buying in quantity. */
export function Trade() {
  return (
    <section aria-labelledby="trade-heading" className="px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="mx-auto max-w-4xl border-y border-jh-navy/15 py-12 text-center">
        <p className="eyebrow">Bulk and trade</p>
        <h2 id="trade-heading" className="mt-3 text-4xl font-medium sm:text-5xl">
          {trade.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{trade.text}</p>
        <ContactTrigger topic="bulk orders" className="btn-line mt-8 text-jh-navy">
          Get a bulk quote
        </ContactTrigger>
      </Reveal>
    </section>
  );
}
