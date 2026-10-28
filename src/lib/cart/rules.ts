/**
 * How the cart is shown: lines grouped by product (the bulk price is
 * decided per product), and the wording around it. The prices themselves
 * always come from the API. Pure, so tested.
 */
import type { Cart, CartLine, CartProduct } from "./types";

export interface ProductGroup {
  product: CartProduct;
  lines: CartLine[];
}

/** Lines under their product, in the cart's order; a line whose product has no summary gets one. */
export function groupByProduct(cart: Pick<Cart, "lines" | "products">): ProductGroup[] {
  const groups = new Map<string, ProductGroup>();
  for (const line of cart.lines) {
    let group = groups.get(line.productId);
    if (!group) {
      const product = cart.products.find((p) => p.productId === line.productId) ?? {
        productId: line.productId,
        productName: line.productName,
        unitLabel: line.unitLabel,
        quantity: 0,
        // Only if the API sent no summary: the shop's usual minimum.
        bulkMinQty: 25,
        tier: line.tier,
        toBulk: 0,
      };
      group = { product, lines: [] };
      groups.set(line.productId, group);
    }
    group.lines.push(line);
  }
  return [...groups.values()];
}

/** "Add 7 more Bulk hair for the bulk price" / "Bulk price on all 30 pieces" (each product has its own minimum). */
export function bulkNote(product: CartProduct): string {
  if (product.tier === "bulk") return `Bulk price on all ${product.quantity} pieces of ${product.productName}.`;
  if (product.quantity === 0) return `The bulk price starts at ${product.bulkMinQty} pieces.`;
  return `Add ${product.toBulk} more ${product.productName} (any ${product.toBulk === 1 ? "option" : "options"}) for the bulk price.`;
}

/** "1 piece" / "30 pieces". */
export function pieces(n: number): string {
  return `${n} ${n === 1 ? "piece" : "pieces"}`;
}

/** Why a line can't be ordered as it is, in the shop's words (null when it can). */
export function lineProblem(line: CartLine): string | null {
  if (line.availability === "available") return null;
  if (line.message) return line.message;
  return line.availability === "insufficient_stock"
    ? "We don't have this many in stock. Lower the quantity."
    : "This item isn't on sale any more. Remove it to continue.";
}

/** "Ships in about 14 days" for made-to-order lines, or null. */
export function leadTimeNote(line: Pick<CartLine, "stockMode" | "leadTimeDays">): string | null {
  if (line.stockMode !== "MADE_TO_ORDER") return null;
  return line.leadTimeDays ? `Made to order, ships in about ${line.leadTimeDays} days` : "Made to order";
}
