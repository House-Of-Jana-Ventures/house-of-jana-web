/** Price wording for the shop. Amounts arrive from the API as exact strings ("4500.00"). */

/** "450000.00" → "₹4,50,000"; "4500.50" → "₹4,500.50". */
export function rupees(amount: string): string {
  const [whole, fraction = "00"] = amount.split(".");
  const grouped = Number(whole).toLocaleString("en-IN");
  return fraction === "00" ? `₹${grouped}` : `₹${grouped}.${fraction.padEnd(2, "0").slice(0, 2)}`;
}

/** Paise, to add and multiply exactly. */
export function toPaise(amount: string): number {
  const [whole, fraction = ""] = amount.split(".");
  return Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
}

export function fromPaise(paise: number): string {
  return `${Math.floor(paise / 100)}.${String(paise % 100).padStart(2, "0")}`;
}

/** Which price applies to this many pieces of one product. */
export function tierFor(quantity: number, bulkMinQty: number): "single" | "bulk" {
  return quantity >= bulkMinQty ? "bulk" : "single";
}

/** Whole-percent saving of the bulk price on the single price (0 when the same). */
export function bulkSaving(single: string, bulk: string): number {
  const s = toPaise(single);
  return s === 0 ? 0 : Math.floor(((s - toPaise(bulk)) / s) * 100);
}

export interface QuantityQuote {
  tier: "single" | "bulk";
  unitPrice: string;
  total: string;
  /** Pieces still needed for the bulk price (0 once reached). */
  toBulk: number;
}

/** What `quantity` pieces of one variant cost, and how far the bulk price is. */
export function quote(quantity: number, prices: { singlePrice: string; bulkPrice: string }, bulkMinQty: number): QuantityQuote {
  const tier = tierFor(quantity, bulkMinQty);
  const unitPrice = tier === "bulk" ? prices.bulkPrice : prices.singlePrice;
  return {
    tier,
    unitPrice,
    total: fromPaise(toPaise(unitPrice) * quantity),
    toBulk: Math.max(0, bulkMinQty - quantity),
  };
}

/** "₹3,800" or "₹3,800 – ₹5,200". */
export function rangeText(range: { min: string; max: string }): string {
  return range.min === range.max ? rupees(range.min) : `${rupees(range.min)} – ${rupees(range.max)}`;
}

/**
 * Where a product page's quantity box starts: the product's bulk minimum, so
 * the bulk price shows first (fewer with "−" switches to the single price),
 * or the most that can be ordered, if that's less.
 */
export function startingQuantity(bulkMinQty: number, max: number | null): number {
  return clampQuantity(bulkMinQty, max);
}

/** A quantity typed in the box, kept within 1 and the most that can be ordered. */
export function clampQuantity(input: string | number, max: number | null): number {
  const n = Math.floor(Number(input));
  if (!Number.isFinite(n) || n < 1) return 1;
  return max === null ? Math.min(n, 100_000) : Math.max(1, Math.min(n, max));
}
