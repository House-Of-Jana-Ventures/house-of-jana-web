import type { Option, ShopVariant } from "./types";

type Choice = Record<string, string>;
type WithOptions = Pick<ShopVariant, "options" | "available" | "sku">;

/** The variant with exactly these values, if it is on sale. */
export function findVariant<V extends WithOptions>(options: Option[], variants: V[], choice: Choice): V | null {
  return variants.find((v) => options.every((o) => v.options[o.name] === choice[o.name])) ?? null;
}

/**
 * How a value looks in its picker, given the other choices:
 * - "ok": on sale with the other choices as they are
 * - "other": on sale, but only with different other choices (picking it moves them)
 */
export function valueState<V extends WithOptions>(
  options: Option[],
  variants: V[],
  choice: Choice,
  name: string,
  value: string,
): "ok" | "other" {
  const fits = variants.some(
    (v) => v.options[name] === value && options.every((o) => o.name === name || v.options[o.name] === choice[o.name]),
  );
  return fits ? "ok" : "other";
}

/**
 * The choice after picking `value` for `name`: kept as it is when that
 * combination is on sale; otherwise the closest one that is, keeping as many
 * of the other choices as possible (earlier options count more), preferring
 * one that can be ordered now.
 */
export function choose<V extends WithOptions>(options: Option[], variants: V[], choice: Choice, name: string, value: string): Choice {
  const wanted = { ...choice, [name]: value };
  if (findVariant(options, variants, wanted)) return wanted;
  const candidates = variants.filter((v) => v.options[name] === value);
  if (candidates.length === 0) return choice;
  const score = (v: V) =>
    options.reduce(
      (sum, o, i) => sum + (o.name !== name && v.options[o.name] === choice[o.name] ? 2 ** (options.length - i) : 0),
      0,
    ) + (v.available ? 0.5 : 0);
  const best = candidates.reduce((a, b) => (score(b) > score(a) ? b : a));
  return Object.fromEntries(options.map((o) => [o.name, best.options[o.name]]));
}

/** Where the page starts: the variant in the address (?v=SKU), else the first one that can be ordered. */
export function startingChoice<V extends WithOptions>(options: Option[], variants: V[], sku?: string | null): Choice {
  const start = (sku ? variants.find((v) => v.sku === sku) : undefined) ?? variants.find((v) => v.available) ?? variants[0];
  return start ? Object.fromEntries(options.map((o) => [o.name, start.options[o.name]])) : {};
}
