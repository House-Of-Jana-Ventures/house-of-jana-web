/**
 * The order page's payment panel: what it shows, the time left to pay, and
 * the API's payment answers in the shop's words. Pure, so tested.
 */

/** Razorpay Checkout's script, as Razorpay publishes it. */
export const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * The script to load: Razorpay's own, or a stand-in for browser tests
 * (RAZORPAY_SCRIPT_URL), which a production build only accepts with
 * ALLOW_TEST_PAYMENT_SCRIPT=true.
 */
export function razorpayScriptUrl(env: Record<string, string | undefined>): string {
  const wanted = env.RAZORPAY_SCRIPT_URL?.trim();
  if (!wanted || wanted === RAZORPAY_SCRIPT_URL) return RAZORPAY_SCRIPT_URL;
  if (env.NODE_ENV === "production" && env.ALLOW_TEST_PAYMENT_SCRIPT !== "true") return RAZORPAY_SCRIPT_URL;
  return wanted;
}

export type PanelState =
  /** Overseas order: the shop is working out the shipping. */
  | "quote"
  | "payable"
  /** Unpaid, but can't be paid this moment (e.g. the bank is still confirming). */
  | "waiting"
  | "paid"
  | "cancelled";

export function panelState(order: {
  status: string;
  paymentStatus: string;
  payment: { canPay: boolean };
}): PanelState {
  if (["PAID", "REFUND_PENDING", "REFUNDED", "PARTIALLY_REFUNDED"].includes(order.paymentStatus)) return "paid";
  if (order.status === "CANCELLED") return "cancelled";
  if (order.status === "AWAITING_SHIPPING_QUOTE") return "quote";
  if (order.status !== "PENDING_PAYMENT") return "paid";
  return order.payment.canPay ? "payable" : "waiting";
}

/** "Please pay within 23 hours" / "… within 40 minutes"; null without a deadline. */
export function deadlineText(expiresAt: string | null, now: number): string | null {
  if (!expiresAt) return null;
  const ms = Date.parse(expiresAt) - now;
  if (Number.isNaN(ms)) return null;
  const minutes = Math.max(0, Math.floor(ms / 60_000));
  if (minutes < 1) return "Please pay within a minute, or the order is cancelled.";
  if (minutes < 120) return `Please pay within ${minutes} ${minutes === 1 ? "minute" : "minutes"}, or the order is cancelled.`;
  const hours = Math.floor(minutes / 60);
  return `Please pay within ${hours} hours, or the order is cancelled.`;
}

export type PaymentOutcome = { kind: "failed" | "pending" | "changed" | "unavailable"; message: string };

const UNAVAILABLE =
  "Online payment isn't available at the moment. Nothing has been charged. Please try again in a minute, or pay by bank transfer.";

/** The API's refusal (start or verify) as the panel's note. */
export function paymentOutcome(status: number, code: string, message: string, data: unknown = null): PaymentOutcome {
  switch (code) {
    case "PAYMENT_NOT_COMPLETED": {
      // The API's message is written for buyers ("Your bank declined…").
      const reason = (data as { reason?: unknown } | null)?.reason;
      return { kind: reason === "pending" ? "pending" : "failed", message };
    }
    case "PAYMENT_VERIFICATION_FAILED":
      return {
        kind: "pending",
        message:
          "We couldn't confirm this payment yet. If money left your account, the order is confirmed by itself within a few minutes.",
      };
    case "ORDER_NOT_PAYABLE":
      return { kind: "changed", message: "This order can't be paid now. The page shows its latest state." };
    case "PAYMENTS_UNAVAILABLE":
      return { kind: "unavailable", message: UNAVAILABLE };
  }
  if (status === 0 || status >= 500) return { kind: "unavailable", message: UNAVAILABLE };
  return { kind: "failed", message: "That didn't work. Please try again." };
}

/** Razorpay's own "payment.failed" description, or a plain one. */
export function failedMessage(description: unknown): string {
  return typeof description === "string" && description.trim()
    ? description.trim().slice(0, 300)
    : "The payment didn't go through. Nothing has been charged. Please try again or use another method.";
}

/** Razorpay Checkout's success result, checked before it's sent on. */
export function checkoutResult(
  raw: unknown,
): { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const ok = (value: unknown, pattern: RegExp) => typeof value === "string" && pattern.test(value);
  if (
    !ok(r.razorpay_order_id, /^order_[A-Za-z0-9]{6,40}$/) ||
    !ok(r.razorpay_payment_id, /^pay_[A-Za-z0-9]{6,40}$/) ||
    !ok(r.razorpay_signature, /^[a-f0-9]{64}$/)
  )
    return null;
  return {
    razorpayOrderId: r.razorpay_order_id as string,
    razorpayPaymentId: r.razorpay_payment_id as string,
    razorpaySignature: r.razorpay_signature as string,
  };
}

export const ORDER_NUMBER = /^JH-\d{6,12}$/i;

/** Where each order status stands, for the buyer. */
export const STATUS_TEXT: Record<string, { label: string; note: string }> = {
  AWAITING_SHIPPING_QUOTE: {
    label: "Waiting for our shipping quote",
    note: "We're working out the shipping to your country. We'll email you the final total with a link to pay, usually within one working day.",
  },
  PENDING_PAYMENT: { label: "Waiting for payment", note: "Your order is confirmed once it is paid." },
  CONFIRMED: { label: "Confirmed", note: "Paid, thank you. We'll start preparing it." },
  PROCESSING: { label: "Being prepared", note: "We're preparing your order." },
  SHIPPED: { label: "Shipped", note: "Your order is on its way." },
  DELIVERED: { label: "Delivered", note: "Your order has been delivered." },
  CANCELLED: { label: "Cancelled", note: "This order was cancelled." },
};
