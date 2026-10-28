/** Shapes of the Jana API's cart, checkout and order answers (see its /api/docs). */
import type { ImageUrls } from "@/lib/shop/types";

export type PriceTier = "single" | "bulk";

export interface CartLine {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  variantLabel: string;
  unitLabel: string;
  image: ImageUrls | null;
  tier: PriceTier;
  unitPrice: string;
  singlePrice: string | null;
  bulkPrice: string | null;
  stockMode: "IN_STOCK" | "MADE_TO_ORDER";
  leadTimeDays: number | null;
  quantity: number;
  lineTotal: string;
  /** "available", or why the line can't be ordered as it is. */
  availability: string;
  message: string | null;
}

export interface CartProduct {
  productId: string;
  productName: string;
  unitLabel: string;
  quantity: number;
  /** This product's bulk minimum: from this many pieces, the bulk price. */
  bulkMinQty: number;
  tier: PriceTier;
  /** Pieces still needed for the bulk price (0 once reached). */
  toBulk: number;
}

export interface Cart {
  lines: CartLine[];
  products: CartProduct[];
  itemCount: number;
  subtotal: string;
  currency: string;
  bulkMinQty: number;
  readyForCheckout: boolean;
}

export interface Address {
  id: string;
  label: string | null;
  fullName: string;
  company: string | null;
  gstNumber: string | null;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  countryName: string;
  isDefault: boolean;
}

export interface Totals {
  subtotal: string;
  shipping: string;
  grandTotal: string;
  gstIncluded: string;
  currency: string;
}

export interface CheckoutPreview {
  lines: CartLine[];
  products: CartProduct[];
  totals: Totals;
  shippingQuoteNeeded: boolean;
  amountToFreeShipping: string | null;
  address: Address | null;
  problems: { code: string; message: string; lineId: string | null }[];
  canPlaceOrder: boolean;
}

export type OrderStatus =
  | "AWAITING_SHIPPING_QUOTE"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  sku: string;
  variantLabel: string;
  unitLabel: string;
  imageUrl: string | null;
  priceTier: PriceTier;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: string;
  shippingTotal: string;
  taxIncluded: string;
  grandTotal: string;
  shippingAddress: {
    fullName: string;
    company: string | null;
    gstNumber: string | null;
    phone: string;
    line1: string;
    line2: string | null;
    landmark: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
  };
  notes: string | null;
  tracking: { carrier: string; trackingNumber: string; trackingUrl: string | null } | null;
  placedAt: string;
  expiresAt: string | null;
  cancellationReason: string | null;
  timeline: { status: OrderStatus; at: string; note: string | null }[];
  canCancel: boolean;
  payment: { canPay: boolean; lastFailureMessage: string | null };
}

/** One order in My orders. */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  grandTotal: string;
  /** Pieces in the order. */
  itemCount: number;
  firstItemName: string;
  firstItemImageUrl: string | null;
  placedAt: string;
  /** Lines (different variants) in the order. */
  lineCount: number;
}

/** What Razorpay Checkout needs to open for an order. */
export interface RazorpayCheckout {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderNumber: string;
  prefill: { name: string; email: string; contact: string | null };
  notes: Record<string, string>;
  timeoutSeconds: number;
}

/** The parts of GET /shop/rules the checkout uses. */
export interface PaymentOptions {
  online: boolean;
  bankTransfer: { enabled: boolean; details: string[] };
}
