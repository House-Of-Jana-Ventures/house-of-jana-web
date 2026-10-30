import { describe, expect, it } from "vitest";
import { bulkSaving, clampQuantity, quote, rangeText, rupees, startingQuantity, tierFor } from "@/lib/shop/prices";
import { choose, findVariant, startingChoice, valueState } from "@/lib/shop/variants";

const OPTIONS = [
  { name: "Texture", values: ["Straight", "Curly"] },
  { name: "Length", values: ["18 in", "22 in"] },
];
const v = (sku: string, Texture: string, Length: string, available = true) => ({
  sku,
  options: { Texture, Length },
  available,
});
// Curly only comes in 22 in; straight in both; straight 22 is sold out.
const VARIANTS = [v("S18", "Straight", "18 in"), v("S22", "Straight", "22 in", false), v("C22", "Curly", "22 in")];

describe("choosing a variant", () => {
  it("finds the variant for a full choice", () => {
    expect(findVariant(OPTIONS, VARIANTS, { Texture: "Curly", Length: "22 in" })?.sku).toBe("C22");
    expect(findVariant(OPTIONS, VARIANTS, { Texture: "Curly", Length: "18 in" })).toBeNull();
  });

  it("dims values that exist only with other choices", () => {
    const choice = { Texture: "Straight", Length: "18 in" };
    expect(valueState(OPTIONS, VARIANTS, choice, "Texture", "Curly")).toBe("other");
    expect(valueState(OPTIONS, VARIANTS, choice, "Length", "22 in")).toBe("ok");
  });

  it("moves to the closest combination on sale, keeping earlier choices", () => {
    expect(choose(OPTIONS, VARIANTS, { Texture: "Straight", Length: "18 in" }, "Texture", "Curly")).toEqual({
      Texture: "Curly",
      Length: "22 in",
    });
    expect(choose(OPTIONS, VARIANTS, { Texture: "Curly", Length: "22 in" }, "Length", "18 in")).toEqual({
      Texture: "Straight",
      Length: "18 in",
    });
    // A value nobody sells: the choice stays.
    expect(choose(OPTIONS, VARIANTS, { Texture: "Curly", Length: "22 in" }, "Length", "40 in")).toEqual({
      Texture: "Curly",
      Length: "22 in",
    });
  });

  it("starts at the variant in the address, else the first that can be ordered", () => {
    expect(startingChoice(OPTIONS, VARIANTS, "C22")).toEqual({ Texture: "Curly", Length: "22 in" });
    expect(startingChoice(OPTIONS, VARIANTS, "NOPE")).toEqual({ Texture: "Straight", Length: "18 in" });
    expect(startingChoice(OPTIONS, [VARIANTS[1], VARIANTS[2]])).toEqual({ Texture: "Curly", Length: "22 in" });
    expect(startingChoice([], [])).toEqual({});
  });
});

describe("prices", () => {
  it("formats rupees with Indian grouping", () => {
    expect(rupees("450000.00")).toBe("₹4,50,000");
    expect(rupees("4500.5")).toBe("₹4,500.50");
    expect(rangeText({ min: "3800.00", max: "3800.00" })).toBe("₹3,800");
    expect(rangeText({ min: "3800.00", max: "5200.00" })).toBe("₹3,800 – ₹5,200");
  });

  it("uses the single price below the bulk minimum and the bulk price from it", () => {
    expect(tierFor(24, 25)).toBe("single");
    expect(tierFor(25, 25)).toBe("bulk");
    const prices = { singlePrice: "4500.00", bulkPrice: "3800.50" };
    expect(quote(2, prices, 25)).toEqual({ tier: "single", unitPrice: "4500.00", total: "9000.00", toBulk: 23 });
    expect(quote(30, prices, 25)).toEqual({ tier: "bulk", unitPrice: "3800.50", total: "114015.00", toBulk: 0 });
    expect(bulkSaving("4500.00", "3825.00")).toBe(15);
    expect(bulkSaving("100.00", "100.00")).toBe(0);
  });

  it("keeps the quantity sensible", () => {
    expect(clampQuantity("0", null)).toBe(1);
    expect(clampQuantity("abc", 5)).toBe(1);
    expect(clampQuantity("12.7", null)).toBe(12);
    expect(clampQuantity(80, 40)).toBe(40);
  });

  it("starts the quantity at the bulk minimum, or the stock if that's less", () => {
    expect(startingQuantity(10, null)).toBe(10);
    expect(startingQuantity(25, null)).toBe(25);
    expect(startingQuantity(10, 4)).toBe(4);
    expect(startingQuantity(10, 0)).toBe(1);
  });
});
