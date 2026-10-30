"use client";

import { CheckCircle2, Clock, ImageOff, Loader2, Minus, Package, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useContact } from "@/components/contact/contact-context";
import { Button } from "@/components/ui/button";
import { addToCart, loadCart } from "@/lib/cart/actions";
import type { Cart } from "@/lib/cart/types";
import { bulkSaving, clampQuantity, quote, rupees, startingQuantity } from "@/lib/shop/prices";
import type { ShopProduct, ShopVariant } from "@/lib/shop/types";
import { choose, findVariant, startingChoice, valueState } from "@/lib/shop/variants";
import { cn } from "@/lib/utils";

/**
 * The interactive part of a product page: the gallery, option pickers,
 * both prices, a quantity box that shows which price applies, Add to cart
 * (signed out: sign in first, then the item is added and the cart opens)
 * and the quote button. The chosen variant is kept in the address (?v=SKU).
 */
export function ProductView({ product }: { product: ShopProduct }) {
  const params = useSearchParams();
  const { openContact } = useContact();
  const [choice, setChoice] = useState(() => startingChoice(product.options, product.variants, params.get("v")));
  const variant = findVariant(product.options, product.variants, choice) ?? product.variants[0];
  // Starts at the bulk minimum, so the bulk price shows first; "−" goes below it.
  const [quantity, setQuantity] = useState(() => startingQuantity(product.bulkMinQty, maxFor(variant)));
  const images = useMemo(() => photosFor(product, variant), [product, variant]);
  const [shown, setShown] = useState<string | null>(null);
  const main = images.find((i) => i.id === shown) ?? images[0];
  const max = maxFor(variant);
  const total = quote(quantity, variant, product.bulkMinQty);
  const saving = bulkSaving(variant.singlePrice, variant.bulkPrice);
  const router = useRouter();
  const [adding, startAdding] = useTransition();
  const [addNote, setAddNote] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reopened = useRef(false);

  // Back from signing in with the item added (?added=1): show the cart once.
  useEffect(() => {
    if (params.get("added") !== "1" || reopened.current) return;
    reopened.current = true;
    const url = new URL(window.location.href);
    url.searchParams.delete("added");
    window.history.replaceState(null, "", url);
    setDrawerOpen(true);
    void loadCart().then((loaded) => {
      if (!loaded) return;
      setCart(loaded);
      setAdded(loaded.lines.find((l) => l.variantId === variant.id)?.id ?? null);
    });
  }, [params, variant.id]);

  const add = () =>
    startAdding(async () => {
      setAddNote(null);
      const result = await addToCart(variant.id, quantity, `/shop/p/${product.slug}?v=${encodeURIComponent(variant.sku)}`);
      if (result.ok) {
        setCart(result.cart);
        setAdded(result.cart.lines.find((l) => l.variantId === variant.id)?.id ?? null);
        setDrawerOpen(true);
        router.refresh();
      } else if ("signIn" in result) router.push(result.signIn);
      else setAddNote(result.message);
    });

  const pick = (name: string, value: string) => {
    const next = choose(product.options, product.variants, choice, name, value);
    setChoice(next);
    setShown(null);
    const picked = findVariant(product.options, product.variants, next);
    if (picked) {
      const url = new URL(window.location.href);
      url.searchParams.set("v", picked.sku);
      window.history.replaceState(null, "", url);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
      {/* Gallery */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-jh-light ring-1 ring-border">
          {main ? (
            <Image
              key={main.id}
              src={main.urls.large}
              alt={main.altText ?? `${product.name}, ${variant.label}`}
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover motion-safe:animate-in motion-safe:fade-in"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff aria-hidden className="size-10" />
            </span>
          )}
        </div>
        {images.length > 1 ? (
          <ul className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label="More photos">
            {images.map((image, i) => (
              <li key={image.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setShown(image.id)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={image.id === main?.id}
                  className={cn(
                    "relative block size-20 overflow-hidden rounded-xl ring-2 ring-transparent transition focus-visible:outline-2 focus-visible:outline-jh-bright",
                    image.id === main?.id && "ring-jh-bright",
                  )}
                >
                  <Image src={image.urls.thumbnail} alt="" fill unoptimized sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Details */}
      <div>
        <h1 className="text-4xl font-semibold sm:text-5xl">{product.name}</h1>
        {product.shortDescription ? (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        ) : null}

        {product.options.map((option) => (
          <fieldset key={option.name} className="mt-7">
            <legend className="mb-2.5 text-sm font-semibold">
              {option.name}: <span className="font-normal text-muted-foreground">{choice[option.name]}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const state = valueState(product.options, product.variants, choice, option.name, value);
                const checked = choice[option.name] === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      "cursor-pointer rounded-sm px-4 py-2 text-sm ring-1 ring-border transition-colors select-none hover:ring-jh-bright",
                      "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-jh-bright",
                      checked && "bg-jh-bright font-semibold text-jh-navy ring-jh-bright",
                      !checked && state === "other" && "border border-dashed border-input text-muted-foreground ring-0",
                    )}
                  >
                    <input
                      type="radio"
                      name={`option-${option.name}`}
                      value={value}
                      checked={checked}
                      onChange={() => pick(option.name, value)}
                      className="sr-only"
                    />
                    {value}
                    {state === "other" && !checked ? <span className="sr-only"> (changes other choices)</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Prices */}
        <section aria-label="Prices" className="mt-8 rounded-3xl bg-jh-light/70 p-5 ring-1 ring-border sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <PriceTier
              active={total.tier === "single"}
              title={`1 to ${product.bulkMinQty - 1} pieces`}
              price={variant.singlePrice}
              unit={product.unitLabel}
            />
            <PriceTier
              active={total.tier === "bulk"}
              title={`${product.bulkMinQty} pieces or more`}
              price={variant.bulkPrice}
              unit={product.unitLabel}
              note={saving > 0 ? `Save ${saving}%` : undefined}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold">
                Quantity ({product.unitLabel})
              </label>
              <div className="mt-1.5 flex items-center rounded-full bg-white ring-1 ring-border">
                <button
                  type="button"
                  aria-label="One less"
                  onClick={() => setQuantity((q) => clampQuantity(q - 1, max))}
                  className="flex size-11 items-center justify-center rounded-full hover:bg-jh-light"
                >
                  <Minus aria-hidden className="size-4" />
                </button>
                <input
                  id="quantity"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => setQuantity(clampQuantity(e.target.value, max))}
                  className="h-11 w-16 bg-transparent text-center text-lg font-semibold tabular-nums outline-none"
                />
                <button
                  type="button"
                  aria-label="One more"
                  onClick={() => setQuantity((q) => clampQuantity(q + 1, max))}
                  className="flex size-11 items-center justify-center rounded-full hover:bg-jh-light"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              </div>
            </div>
            <p aria-live="polite" className="pb-2.5 text-sm">
              <span className="block text-2xl font-semibold text-jh-navy tabular-nums">{rupees(total.total)}</span>
              {quantity} × {rupees(total.unitPrice)} ({total.tier === "bulk" ? "bulk price" : "single price"})
            </p>
          </div>
          <p className="mt-3 text-sm text-jh-deep">
            {total.toBulk > 0
              ? `Add ${total.toBulk} more for the bulk price. Every ${product.name} in your order counts${product.options.length > 0 ? `, whatever the ${listWords(product.options.map((o) => o.name.toLowerCase()))}` : ""}.`
              : "The bulk price applies."}
          </p>

          <Availability variant={variant} />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={add}
              disabled={adding || !variant.available}
              aria-busy={adding}
              className="h-12 rounded-sm px-6 text-base"
            >
              {adding ? <Loader2 aria-hidden className="animate-spin" /> : <ShoppingBag aria-hidden />} Add to cart
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-haspopup="dialog"
              className="h-12 rounded-sm px-6 text-base"
              onClick={() =>
                openContact(`${product.name}: ${variant.label} (${variant.sku}), ${quantity} × ${product.unitLabel}`)
              }
            >
              Ask for a quote
            </Button>
          </div>
          {addNote ? (
            <p role="alert" className="mt-3 rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {addNote}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            Prices include GST. Shipping is added at checkout; for orders outside India we quote it.
          </p>
        </section>

        {product.description ? (
          <section aria-labelledby="about-heading" className="mt-10">
            <h2 id="about-heading" className="text-2xl font-semibold">
              About this product
            </h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">{product.description}</p>
          </section>
        ) : null}
        {Object.keys(product.attributes).length > 0 ? (
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {Object.entries(product.attributes).map(([name, value]) => (
              <div key={name} className="contents">
                <dt className="font-semibold">{name}</dt>
                <dd className="text-muted-foreground">{value}</dd>
              </div>
            ))}
            <dt className="font-semibold">SKU</dt>
            <dd className="font-mono text-muted-foreground">{variant.sku}</dd>
          </dl>
        ) : null}
      </div>
      <CartDrawer cart={cart} added={added} open={drawerOpen} onOpenChange={setDrawerOpen} onCart={setCart} />
    </div>
  );
}

function PriceTier({
  active,
  title,
  price,
  unit,
  note,
}: {
  active: boolean;
  title: string;
  price: string;
  unit: string;
  note?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 ring-1 ring-border transition-shadow",
        active && "shadow-md ring-2 ring-jh-bright",
      )}
    >
      <p className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        {title}
        {note ? <span className="rounded-full bg-jh-bright/20 px-2 py-0.5 text-xs font-semibold text-jh-deep">{note}</span> : null}
      </p>
      <p className="mt-1 text-2xl font-semibold text-jh-navy tabular-nums">{rupees(price)}</p>
      <p className="text-xs text-muted-foreground">per {unit}</p>
      {active ? <p className="sr-only">This price applies to the quantity chosen.</p> : null}
    </div>
  );
}

function Availability({ variant }: { variant: ShopVariant }) {
  if (variant.stockMode === "MADE_TO_ORDER") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm">
        <Clock aria-hidden className="size-4 text-jh-deep" />
        Made to order{variant.leadTimeDays ? `, ships in about ${variant.leadTimeDays} days` : ""}
      </p>
    );
  }
  return variant.available ? (
    <p className="mt-4 flex items-center gap-2 text-sm">
      <CheckCircle2 aria-hidden className="size-4 text-emerald-700" />
      In stock{variant.maxQuantity !== null ? ` (${variant.maxQuantity} available)` : ""}
    </p>
  ) : (
    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
      <Package aria-hidden className="size-4" />
      Sold out for now. Ask for a quote and we&apos;ll tell you when it&apos;s back.
    </p>
  );
}

/** The variant's own photos first, then the product's general ones (others' photos hidden). */
function photosFor(product: ShopProduct, variant: ShopVariant) {
  const own = product.images.filter((i) => i.variantId === variant.id);
  const general = product.images.filter((i) => i.variantId === null);
  return [...own, ...general];
}

/** ["texture", "draw", "length"] → "texture, draw or length". */
function listWords(words: string[]): string {
  return words.length < 2 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;
}

/** The most of this variant that can be ordered: its stock when sold from stock, otherwise no limit. */
function maxFor(variant: ShopVariant): number | null {
  return variant.stockMode === "IN_STOCK" ? Math.max(variant.maxQuantity ?? 0, 0) : null;
}
