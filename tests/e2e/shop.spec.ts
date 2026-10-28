import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * The shop, against the test API prepared by scripts/e2e.mjs: Bulk hair is
 * live with Straight and Curly at 18 in (₹6,000 / ₹5,200) and Curly 22 in
 * (₹7,000 / ₹6,100). Curly 18 in comes from stock (40); the rest is made to
 * order. Every other product is still a draft.
 */
test.beforeEach(async ({ page }) => {
  // The contact form pops up by itself until a message is sent; not wanted here.
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

test("the Products menu lists categories and products on sale", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" }).first();
  await nav.getByRole("button", { name: "Products" }).click();
  await expect(nav.getByRole("link", { name: "Hair extensions" })).toBeVisible();
  await nav.getByRole("link", { name: "Bulk hair" }).click();
  await expect(page).toHaveURL(/\/shop\/p\/bulk-hair$/);
  await expect(page.getByRole("heading", { level: 1, name: "Bulk hair" })).toBeVisible();
  // Escape closes the menu again.
  await nav.getByRole("button", { name: "Products" }).click();
  await expect(nav.getByRole("link", { name: "Shop all products" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav.getByRole("link", { name: "Shop all products" })).toBeHidden();
});

test("the shop and a category show cards with both prices", async ({ page }) => {
  await page.goto("/shop");
  const card = page.getByRole("link", { name: /Bulk hair/ }).filter({ hasText: "Bulk, 25+" });
  await expect(card).toContainText("from ₹5,200");
  await expect(card).toContainText("1–24: from ₹6,000");
  await expect(card).toContainText("per bundle (100 g)");
  // Drafts never appear.
  await expect(page.getByText("K-Tip")).toHaveCount(0);

  await page.getByRole("link", { name: "See all hair extensions" }).click();
  await expect(page).toHaveURL(/\/shop\/hair-extensions$/);
  await expect(page.getByRole("status").filter({ hasText: "product" })).toHaveText("1 product");
});

test("filters keep to one variant, and 'Can be ordered now' hides sold-out choices", async ({ page }) => {
  await page.goto("/shop/hair-extensions");
  const filters = page.getByRole("group", { name: "Length" });
  await expect(filters.getByRole("link")).toHaveText(["18 in", "22 in"]);
  await filters.getByRole("link", { name: "22 in" }).click();
  await expect(page).toHaveURL(/options=Length%3A22\+in|options=Length:22/);
  await expect(page.getByRole("link", { name: /Bulk hair/ })).toBeVisible();
  await page.getByRole("group", { name: "Texture" }).getByRole("link", { name: "Straight" }).click();
  await expect(page.getByText("Nothing matches these choices.")).toBeVisible();
  await page.getByRole("link", { name: "Clear filters" }).first().click();
  await expect(page).toHaveURL(/\/shop\/hair-extensions$/);
});

test("the product page: pickers, prices, quantity tiers and the quote button", async ({ page }) => {
  await page.goto("/shop/p/bulk-hair");
  const prices = page.getByRole("region", { name: "Prices" });
  await expect(prices).toContainText("₹6,000");
  await expect(prices).toContainText("₹5,200");
  await expect(prices).toContainText("Save 13%");

  // Starts on the first variant that can be ordered: Straight, single drawn, 18 in (made to order).
  await expect(page.getByText("Made to order, ships in about 14 days")).toBeVisible();

  const quantity = page.getByLabel(/Quantity/);
  await quantity.fill("3");
  await expect(prices).toContainText("₹18,000");
  await expect(prices).toContainText("Add 22 more for the bulk price. Every Bulk hair in your order counts, whatever the texture, draw or length.");
  await quantity.fill("25");
  await expect(prices).toContainText("₹1,30,000");
  await expect(prices).toContainText("The bulk price applies.");

  // Picking 22 in moves Texture to Curly (straight 22 in isn't sold).
  await page.locator("label").filter({ hasText: /^22 in/ }).click();
  await expect(page.getByRole("radio", { name: "22 in" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Curly" })).toBeChecked();
  await expect(prices).toContainText("₹7,000");
  await expect(page).toHaveURL(/\?v=BH-CUR-/);

  // Curly 18 in is from stock.
  await page.locator("label").filter({ hasText: /^18 in/ }).click();
  await expect(page.getByRole("radio", { name: "18 in" })).toBeChecked();
  await expect(page.getByText("In stock (40 available)")).toBeVisible();

  await expect(page.getByRole("button", { name: "Add to cart" })).toBeEnabled();
  await page.getByRole("button", { name: "Ask for a quote" }).click();
  const form = page.getByRole("dialog", { name: "Contact us" });
  await expect(form).toBeVisible();
  await expect(form.getByLabel(/How can we help/)).toHaveValue(/Bulk hair: Curly · .* · 18 in \(BH-CUR-.*-18\), 25 × bundle \(100 g\)/);
});

test("a link with ?v= opens that variant; unknown products are not found", async ({ page }) => {
  await page.goto("/shop/p/bulk-hair?v=BH-CUR-DD-22");
  await expect(page.getByRole("radio", { name: "Double drawn" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "22 in" })).toBeChecked();
  await page.goto("/shop/p/k-tip");
  await expect(page.getByText(/couldn.t find that page/i)).toBeVisible();
});

test("the range page links into the shop", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: "Shop Weft" }).click();
  await expect(page).toHaveURL(/\/shop\/wefts$/);
});

test("shop pages are kept out of search engines until launch, and pass the accessibility check", async ({ page }) => {
  for (const path of ["/shop", "/shop/hair-extensions", "/shop/p/bulk-hair"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${path}: ${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
  }
});
