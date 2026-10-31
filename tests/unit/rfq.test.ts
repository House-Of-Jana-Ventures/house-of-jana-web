import { describe, expect, it } from "vitest";
import { rfqMessage } from "@/lib/rfq";

describe("the bulk quote form's message", () => {
  it("lists every choice, then the notes", () => {
    expect(
      rfqMessage({
        textures: ["Straight", "Wavy"],
        lengths: "18 – 24 in",
        quantity: "Small lot (10 – 50 pieces)",
        destination: " London, UK ",
        notes: " 613 blonde please ",
      }),
    ).toBe(
      "Bulk quote request\nTextures: Straight, Wavy\nLengths: 18 – 24 in\nQuantity: Small lot (10 – 50 pieces)\nDeliver to: London, UK\n\n613 blonde please",
    );
  });

  it("says what wasn't chosen, and leaves out empty notes", () => {
    expect(rfqMessage({ textures: [], lengths: "", quantity: "", destination: "", notes: "  " })).toBe(
      "Bulk quote request\nTextures: not chosen\nLengths: not chosen\nQuantity: not chosen\nDeliver to: not given",
    );
  });
});
