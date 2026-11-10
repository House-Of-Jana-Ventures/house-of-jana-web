import { describe, expect, it } from "vitest";
import { categoryTrail, productsUnder } from "@/lib/shop/categories";
import { isRichText, richTextToPlain, sanitizeRichText } from "@/lib/shop/rich-text";
import type { MenuCategory } from "@/lib/shop/types";

const cat = (slug: string, products: string[], children: MenuCategory[] = []): MenuCategory => ({
  id: slug,
  name: slug,
  slug,
  description: null,
  productCount: products.length,
  products: products.map((p) => ({ name: p, slug: p })),
  children,
});

describe("three category levels", () => {
  const menu = [
    cat("hair-patches", ["patch-a"], [cat("male", [], [cat("lace", ["mirage", "patch-a"])]), cat("female", ["rose"])]),
    cat("wefts", ["weft"]),
  ];

  it("finds the way down to a category at any level", () => {
    expect(categoryTrail(menu, "lace")?.map((c) => c.slug)).toEqual(["hair-patches", "male", "lace"]);
    expect(categoryTrail(menu, "wefts")?.map((c) => c.slug)).toEqual(["wefts"]);
    expect(categoryTrail(menu, "nope")).toBeNull();
  });

  it("lists the products of a category and everything below it, once each", () => {
    expect(productsUnder(menu[0]).map((p) => p.slug)).toEqual(["patch-a", "mirage", "rose"]);
  });
});

describe("formatted descriptions on the product page", () => {
  it("keeps only bold, italic, sizes, paragraphs and breaks", () => {
    expect(
      sanitizeRichText('<p onclick="x()"><b>Raw</b> <span data-size="big">hair</span><script>alert(1)</script><a href="#">link</a></p>'),
    ).toBe('<p><strong>Raw</strong> <span data-size="big">hair</span>link</p>');
    expect(isRichText("Plain text, 5 < 6")).toBe(false);
    expect(sanitizeRichText('<ol><li><p>One</p></li></ol><ul class="x"><li>Two</li></ul>')).toBe(
      "<ol><li><p>One</p></li></ol><ul><li>Two</li></ul>",
    );
  });

  it("gives plain words for search engines", () => {
    expect(richTextToPlain("<p><strong>Raw</strong> hair &amp; wefts</p><p>Sorted</p>")).toBe("Raw hair & wefts\nSorted");
  });
});
