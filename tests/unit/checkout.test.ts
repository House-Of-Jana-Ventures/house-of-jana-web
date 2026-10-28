import { describe, expect, it } from "vitest";
import { bulkNote, groupByProduct, leadTimeNote, lineProblem, pieces } from "@/lib/cart/rules";
import type { CartLine } from "@/lib/cart/types";
import { addressBody, addressLines, countries, INDIAN_STATES, internationalPhone } from "@/lib/checkout/address";
import {
  checkoutResult,
  deadlineText,
  panelState,
  paymentOutcome,
  RAZORPAY_SCRIPT_URL,
  razorpayScriptUrl,
} from "@/lib/checkout/payment";
import {
  cartCookie,
  clearedCookies,
  decodeWho,
  encodeWho,
  needsSession,
  readCartCount,
  safeNext,
  sessionCookies,
} from "@/lib/session/cookies";
import { parsePendingAdd, pendingAdd, withAdded } from "@/lib/session/pending-add";
import { friendlyMessage, sentence, toFormState } from "@/lib/shop/messages";

const VARIANT = "0b9f7a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b";

describe("session cookies", () => {
  const tokens = {
    accessToken: "a",
    accessTokenExpiresIn: 900,
    refreshToken: "r",
    refreshTokenExpiresAt: new Date(Date.UTC(2026, 10, 26)).toISOString(),
    user: { firstName: "Meera" },
  };

  it("keeps the tokens and the first name in httpOnly cookies; the access cookie ends a minute early", () => {
    const now = Date.UTC(2026, 9, 27);
    const cookies = sessionCookies(tokens, true, now);
    expect(cookies.map((c) => [c.name, c.options.maxAge])).toEqual([
      ["jh_at", 840],
      ["jh_rt", 30 * 86_400],
      ["jh_who", 30 * 86_400],
    ]);
    expect(cookies.every((c) => c.options.httpOnly && c.options.secure && c.options.sameSite === "lax")).toBe(true);
    expect(decodeWho(cookies[2].value)).toBe("Meera");
  });

  it("clears all four cookies on sign out", () => {
    expect(clearedCookies(false).map((c) => [c.name, c.options.maxAge])).toEqual([
      ["jh_at", 0],
      ["jh_rt", 0],
      ["jh_who", 0],
      ["jh_cart", 0],
    ]);
  });

  it("keeps names in any language, and survives a damaged cookie", () => {
    expect(decodeWho(encodeWho("মীরা"))).toBe("মীরা");
    expect(decodeWho("%E0%A4")).toBe("");
    expect(decodeWho(undefined)).toBe("");
  });

  it("reads the cart badge count", () => {
    expect(readCartCount(cartCookie(30, false).value)).toBe(30);
    expect(readCartCount("-2")).toBe(0);
    expect(readCartCount("abc")).toBe(0);
  });

  it("follows only paths on this site after signing in", () => {
    expect(safeNext("/shop/p/bulk-hair?v=BH-CUR-18")).toBe("/shop/p/bulk-hair?v=BH-CUR-18");
    expect(safeNext("//evil.example")).toBe("/shop");
    expect(safeNext("/\\evil.example")).toBe("/shop");
    expect(safeNext("https://evil.example")).toBe("/shop");
    expect(safeNext("/sign-in?next=/cart")).toBe("/shop");
    expect(safeNext("")).toBe("/shop");
  });

  it("asks for a session on the cart, checkout and account pages only", () => {
    expect(["/cart", "/checkout", "/account/orders/JH-100001"].every(needsSession)).toBe(true);
    expect(["/shop", "/cartography", "/sign-in", "/"].some(needsSession)).toBe(false);
  });
});

describe("adding to the cart while signed out", () => {
  it("carries the item through the sign-in page", () => {
    expect(parsePendingAdd(pendingAdd(VARIANT, 3))).toEqual({ variantId: VARIANT, quantity: 3 });
    expect(parsePendingAdd("nope:3")).toBeNull();
    expect(parsePendingAdd(`${VARIANT}:0`)).toBeNull();
    expect(parsePendingAdd(`${VARIANT}:1.5`)).toBeNull();
    expect(parsePendingAdd(undefined)).toBeNull();
  });

  it("returns to the product with the cart opened", () => {
    expect(withAdded("/shop/p/bulk-hair?v=X", true)).toBe("/shop/p/bulk-hair?v=X&added=1");
    expect(withAdded("/shop/p/bulk-hair", true)).toBe("/shop/p/bulk-hair?added=1");
    expect(withAdded("/shop", false)).toBe("/shop");
  });
});

const line = (over: Partial<CartLine>): CartLine => ({
  id: "l1",
  variantId: VARIANT,
  productId: "p1",
  productName: "Bulk hair",
  productSlug: "bulk-hair",
  sku: "BH-1",
  variantLabel: "Curly · 18 in",
  unitLabel: "bundle (100 g)",
  image: null,
  tier: "single",
  unitPrice: "6000.00",
  singlePrice: "6000.00",
  bulkPrice: "5200.00",
  stockMode: "IN_STOCK",
  leadTimeDays: null,
  quantity: 10,
  lineTotal: "60000.00",
  availability: "available",
  message: null,
  ...over,
});

describe("the cart", () => {
  it("groups lines under their product, in the cart's order", () => {
    const lines = [line({ id: "a" }), line({ id: "b", productId: "p2", productName: "K-Tip" }), line({ id: "c" })];
    const products = [
      { productId: "p1", productName: "Bulk hair", unitLabel: "bundle", quantity: 20, bulkMinQty: 25, tier: "single" as const, toBulk: 5 },
    ];
    const groups = groupByProduct({ lines, products });
    expect(groups.map((g) => [g.product.productName, g.lines.map((l) => l.id)])).toEqual([
      ["Bulk hair", ["a", "c"]],
      ["K-Tip", ["b"]],
    ]);
  });

  it("says how far the bulk price is", () => {
    const product = { productId: "p1", productName: "Bulk hair", unitLabel: "bundle", quantity: 18, bulkMinQty: 25, tier: "single" as const, toBulk: 7 };
    expect(bulkNote(product)).toBe("Add 7 more Bulk hair (any options) for the bulk price.");
    expect(bulkNote({ ...product, toBulk: 1 })).toBe("Add 1 more Bulk hair (any option) for the bulk price.");
    expect(bulkNote({ ...product, quantity: 30, tier: "bulk", toBulk: 0 })).toBe(
      "Bulk price on all 30 pieces of Bulk hair.",
    );
    // Each product's own minimum: Bulk hair from 10.
    expect(bulkNote({ ...product, quantity: 0, bulkMinQty: 10, toBulk: 10 })).toBe("The bulk price starts at 10 pieces.");
    expect(pieces(1)).toBe("1 piece");
  });

  it("explains lines that can't be ordered, and made-to-order times", () => {
    expect(lineProblem(line({}))).toBeNull();
    expect(lineProblem(line({ availability: "insufficient_stock" }))).toMatch(/in stock/);
    expect(lineProblem(line({ availability: "unavailable", message: "No longer sold." }))).toBe("No longer sold.");
    expect(leadTimeNote({ stockMode: "MADE_TO_ORDER", leadTimeDays: 14 })).toBe("Made to order, ships in about 14 days");
    expect(leadTimeNote({ stockMode: "IN_STOCK", leadTimeDays: null })).toBeNull();
  });
});

describe("addresses", () => {
  it("lists India first, then every country, without groupings", () => {
    const list = countries();
    expect(list[0]).toEqual({ code: "IN", name: "India" });
    expect(list.find((c) => c.code === "AE")?.name).toBe("United Arab Emirates");
    expect(list.some((c) => ["EU", "UN", "ZZ", "XK"].includes(c.code))).toBe(false);
    expect(list.length).toBeGreaterThan(200);
    expect(INDIAN_STATES).toHaveLength(36);
  });

  it("sends only filled-in fields, and the GSTIN only for India", () => {
    expect(
      addressBody({ country: "ae", fullName: " Asha ", gstNumber: "27ABCDE1234F1Z5", line2: "", city: "Dubai", isDefault: "on" }),
    ).toEqual({ country: "AE", fullName: "Asha", city: "Dubai", isDefault: true });
    expect(addressBody({ fullName: "Meera", gstNumber: "27abcde1234f1z5" })).toEqual({
      country: "IN",
      fullName: "Meera",
      gstNumber: "27abcde1234f1z5",
    });
  });

  it("writes phones the international way", () => {
    expect(["98123 45678", "098123-45678", "91 98123 45678", "+91 98123 45678"].map(internationalPhone)).toEqual(
      Array(4).fill("+919812345678"),
    );
    expect(internationalPhone("+971 50 123 4567")).toBe("+971501234567");
    expect(internationalPhone("00971501234567")).toBe("+971501234567");
    expect(internationalPhone("12345")).toBe("12345");
  });

  it("prints an address line by line", () => {
    expect(
      addressLines({
        fullName: "Meera Iyer",
        company: "Iyer Salon",
        line1: "Unit 4",
        line2: null,
        landmark: "Bus depot",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400050",
        country: "IN",
        countryName: "India",
        phone: "+919812345678",
        gstNumber: "27ABCDE1234F1Z5",
      }),
    ).toEqual([
      "Meera Iyer, Iyer Salon",
      "Unit 4",
      "Near Bus depot",
      "Mumbai, Maharashtra, 400050",
      "India",
      "+919812345678",
      "GSTIN 27ABCDE1234F1Z5",
    ]);
  });
});

describe("paying", () => {
  const order = (status: string, paymentStatus = "PENDING", canPay = true) => ({ status, paymentStatus, payment: { canPay } });

  it("knows what the payment panel shows", () => {
    expect(panelState(order("AWAITING_SHIPPING_QUOTE", "PENDING", false))).toBe("quote");
    expect(panelState(order("PENDING_PAYMENT"))).toBe("payable");
    expect(panelState(order("PENDING_PAYMENT", "PENDING", false))).toBe("waiting");
    expect(panelState(order("CONFIRMED", "PAID", false))).toBe("paid");
    expect(panelState(order("CANCELLED", "PENDING", false))).toBe("cancelled");
    expect(panelState(order("CANCELLED", "REFUND_PENDING", false))).toBe("paid");
  });

  it("tells the time left in hours, then minutes", () => {
    const now = Date.UTC(2026, 9, 27, 10);
    expect(deadlineText(new Date(now + 23.5 * 3_600_000).toISOString(), now)).toBe(
      "Please pay within 23 hours, or the order is cancelled.",
    );
    expect(deadlineText(new Date(now + 40 * 60_000).toISOString(), now)).toBe(
      "Please pay within 40 minutes, or the order is cancelled.",
    );
    expect(deadlineText(null, now)).toBeNull();
  });

  it("uses Razorpay's own script unless a test build allows the stand-in", () => {
    const fake = "http://localhost:4101/api/v1/dev/razorpay/checkout.js";
    expect(razorpayScriptUrl({})).toBe(RAZORPAY_SCRIPT_URL);
    expect(razorpayScriptUrl({ RAZORPAY_SCRIPT_URL: fake, NODE_ENV: "development" })).toBe(fake);
    expect(razorpayScriptUrl({ RAZORPAY_SCRIPT_URL: fake, NODE_ENV: "production" })).toBe(RAZORPAY_SCRIPT_URL);
    expect(
      razorpayScriptUrl({ RAZORPAY_SCRIPT_URL: fake, NODE_ENV: "production", ALLOW_TEST_PAYMENT_SCRIPT: "true" }),
    ).toBe(fake);
  });

  it("checks Razorpay's result before sending it on", () => {
    const ok = { razorpay_order_id: "order_ABC123", razorpay_payment_id: "pay_XYZ789", razorpay_signature: "a".repeat(64) };
    expect(checkoutResult(ok)).toEqual({
      razorpayOrderId: "order_ABC123",
      razorpayPaymentId: "pay_XYZ789",
      razorpaySignature: "a".repeat(64),
    });
    expect(checkoutResult({ ...ok, razorpay_signature: "x" })).toBeNull();
    expect(checkoutResult(null)).toBeNull();
  });

  it("words the API's payment answers for buyers", () => {
    expect(paymentOutcome(409, "PAYMENT_NOT_COMPLETED", "Your bank declined.", { reason: "failed" })).toEqual({
      kind: "failed",
      message: "Your bank declined.",
    });
    expect(paymentOutcome(409, "PAYMENT_NOT_COMPLETED", "Still pending.", { reason: "pending" }).kind).toBe("pending");
    expect(paymentOutcome(503, "PAYMENTS_UNAVAILABLE", "").message).toMatch(/bank transfer/);
    expect(paymentOutcome(0, "UNREACHABLE", "").kind).toBe("unavailable");
  });
});

describe("messages", () => {
  it("turns API refusals into the shop's words, field by field", () => {
    const state = toFormState(
      {
        status: 400,
        code: "VALIDATION_FAILED",
        message: "Validation failed",
        errors: [{ field: "postalCode", messages: ["postalCode must be a 6-digit PIN code"] }],
      },
      { postalCode: "4000" },
    );
    expect(state).toEqual({
      ok: false,
      message: "Please check the highlighted fields.",
      errors: { postalCode: ["Must be a 6-digit PIN code."] },
      values: { postalCode: "4000" },
    });
    expect(friendlyMessage({ status: 409, code: "INSUFFICIENT_STOCK", message: "", errors: [] })).toMatch(/in stock/);
    expect(friendlyMessage({ status: 0, code: "UNREACHABLE", message: "", errors: [] })).toMatch(/can't be reached/);
    expect(sentence("Enter a phone number.")).toBe("Enter a phone number.");
    expect(() => toFormState(new Error("boom"))).toThrow("boom");
  });
});
