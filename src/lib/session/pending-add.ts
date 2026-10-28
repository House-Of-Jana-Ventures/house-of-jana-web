/**
 * "Add to cart" while signed out: the item travels through the sign-in page
 * as `add=<variantId>:<quantity>` and is added once the buyer has signed in
 * or registered. Pure, so tested.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function pendingAdd(variantId: string, quantity: number): string {
  return `${variantId}:${quantity}`;
}

export function parsePendingAdd(value: string | null | undefined): { variantId: string; quantity: number } | null {
  if (!value) return null;
  const [variantId, raw] = value.split(":");
  const quantity = Number(raw);
  if (!UUID.test(variantId ?? "") || !Number.isInteger(quantity) || quantity < 1 || quantity > 10_000) return null;
  return { variantId, quantity };
}

/** `/shop/p/bulk-hair?v=SKU` → `/shop/p/bulk-hair?v=SKU&added=1`, so the page opens the cart. */
export function withAdded(path: string, added: boolean): string {
  if (!added) return path;
  return `${path}${path.includes("?") ? "&" : "?"}added=1`;
}
