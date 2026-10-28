import { describe, expect, it } from "vitest";
import { askToChange, canCancelOnline, itemsText, orderAgainNote, orderFilter } from "@/lib/account/rules";
import { whoCookie, decodeWho } from "@/lib/session/cookies";

describe("my orders", () => {
  it("filters by what the buyer is waiting for", () => {
    expect(orderFilter(undefined).key).toBe("all");
    expect(orderFilter("nope").statuses).toEqual([]);
    expect(orderFilter("to-pay").statuses).toEqual(["AWAITING_SHIPPING_QUOTE", "PENDING_PAYMENT"]);
    expect(orderFilter("in-progress").statuses).toEqual(["CONFIRMED", "PROCESSING", "SHIPPED"]);
  });

  it("lets buyers cancel only before paying; paid orders go through the shop", () => {
    expect(["AWAITING_SHIPPING_QUOTE", "PENDING_PAYMENT"].every(canCancelOnline)).toBe(true);
    expect(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].some(canCancelOnline)).toBe(false);
    expect(askToChange("CONFIRMED")).toBe(true);
    expect(askToChange("SHIPPED")).toBe(false);
  });

  it("names the first item and how many more", () => {
    expect(itemsText("Bulk hair", 1)).toBe("Bulk hair");
    expect(itemsText("Bulk hair", 3)).toBe("Bulk hair and 2 more");
  });

  it("says what Order again could add", () => {
    expect(orderAgainNote(2, [])).toBe("2 items added to your cart.");
    expect(orderAgainNote(1, ["K-Tip (U tip)"])).toBe("1 item added to your cart. No longer available: K-Tip (U tip).");
    expect(orderAgainNote(0, ["A", "B"])).toBe("Nothing could be added. No longer available: A, B.");
  });

  it("keeps a changed first name for the header", () => {
    const cookie = whoCookie(" Meera ", true);
    expect(cookie.name).toBe("jh_who");
    expect(decodeWho(cookie.value)).toBe("Meera");
    expect(cookie.options.httpOnly).toBe(true);
  });
});
