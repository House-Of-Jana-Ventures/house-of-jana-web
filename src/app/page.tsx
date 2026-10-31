import { BestSellers } from "@/components/home/best-sellers";
import { BulkQuote } from "@/components/home/bulk-quote";
import { Education } from "@/components/home/education";
import { Heritage } from "@/components/home/heritage";
import { Hero } from "@/components/home/hero";
import { Ordering } from "@/components/home/ordering";
import { Reviews } from "@/components/home/reviews";
import { WholesaleDock } from "@/components/home/wholesale-dock";

/**
 * The home page (phase J4, the owner's design): the promise with the
 * hair-type card → the shop's own products → how ordering works with the bulk
 * price estimator → the family's story → hair education → the bulk quote
 * form → customers' words, with a floating quote bar.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <Ordering />
      <Heritage />
      <Education />
      <BulkQuote />
      <Reviews />
      <WholesaleDock />
    </>
  );
}
