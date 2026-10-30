import { CreditCard, Globe, HandHeart, Landmark } from "lucide-react";
import { trust } from "@/content/home";
import { getShopRules } from "@/lib/shop/api";

const ICONS = { globe: Globe, card: CreditCard, bank: Landmark, hand: HandHeart } as const;

/**
 * One thin line of reasons to trust the shop, under the hero. The payment
 * items show only while that way of paying is switched on in the shop.
 */
export async function TrustStrip() {
  const rules = await getShopRules();
  const items = trust.filter(
    (item) =>
      (item.icon !== "card" || rules?.payments.online) &&
      (item.icon !== "bank" || rules?.payments.bankTransfer.enabled),
  );
  return (
    <section aria-label="Why shop with us" className="border-b border-border bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-3 px-4 py-5 sm:px-6 md:flex md:justify-between">
        {items.map(({ icon, text }) => {
          const Icon = ICONS[icon];
          return (
            <li key={text} className="flex items-center gap-2.5 text-xs text-jh-navy/80 sm:text-sm">
              <Icon aria-hidden className="size-4 shrink-0 text-jh-deep" strokeWidth={1.5} />
              {text}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
