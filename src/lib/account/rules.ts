/**
 * My account in the shop's words: the order list's filters, what a buyer
 * may do with an order, and the notes after "Order again". Pure, so tested.
 */

/** The order list's filters and the statuses each one asks the API for. */
export const ORDER_FILTERS = [
  { key: "all", label: "All", statuses: [] },
  { key: "to-pay", label: "To pay", statuses: ["AWAITING_SHIPPING_QUOTE", "PENDING_PAYMENT"] },
  { key: "in-progress", label: "In progress", statuses: ["CONFIRMED", "PROCESSING", "SHIPPED"] },
  { key: "completed", label: "Completed", statuses: ["DELIVERED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
] as const;

export type OrderFilter = (typeof ORDER_FILTERS)[number];

export function orderFilter(key: string | undefined): OrderFilter {
  return ORDER_FILTERS.find((f) => f.key === key) ?? ORDER_FILTERS[0];
}

/**
 * Buyers cancel by themselves only before paying (owner's choice): paid
 * orders may already be made to order, so they contact the shop.
 */
export function canCancelOnline(status: string): boolean {
  return status === "AWAITING_SHIPPING_QUOTE" || status === "PENDING_PAYMENT";
}

/** Paid and not yet shipped: changes go through the shop. */
export function askToChange(status: string): boolean {
  return status === "CONFIRMED" || status === "PROCESSING";
}

/** "Bulk hair" / "Bulk hair and 2 more". */
export function itemsText(firstItemName: string, lines: number): string {
  return lines > 1 ? `${firstItemName} and ${lines - 1} more` : firstItemName;
}

/** After "Order again": what went into the cart, and what is no longer sold. */
export function orderAgainNote(added: number, skipped: string[]): string {
  const put = added > 0 ? `${added} ${added === 1 ? "item" : "items"} added to your cart.` : "Nothing could be added.";
  if (skipped.length === 0) return put;
  return `${put} No longer available: ${skipped.join(", ")}.`;
}

/** The steps an order has been through, for its timeline. */
export const TIMELINE_LABEL: Record<string, string> = {
  AWAITING_SHIPPING_QUOTE: "Order placed; shipping to be quoted",
  PENDING_PAYMENT: "Waiting for payment",
  CONFIRMED: "Paid",
  PROCESSING: "Being prepared",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
