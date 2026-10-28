import { expect, test } from "@playwright/test";
import { asAdmin, buyer, field, fillRegistration } from "./support";

/**
 * A product's own bulk minimum (JB4): Bulk hair from 10 pieces while the
 * shop default stays 25. Set through the test API for this file only, and
 * put back afterwards so the other files see the default.
 */
test.describe.configure({ mode: "serial" });

async function setBulkMinimum(value: number | null) {
  const [product] = await asAdmin<{ id: string }[]>("GET", "/admin/products?search=bulk%20hair&limit=1");
  const { version } = await asAdmin<{ version: number }>("GET", `/admin/products/${product.id}`);
  await asAdmin("PATCH", `/admin/products/${product.id}`, { version, bulkMinQty: value });
}

test.beforeAll(async () => setBulkMinimum(10));
test.afterAll(async () => setBulkMinimum(null));

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

/** Shop pages are cached for about a minute: reload until the change shows. */
async function untilShown(page: import("@playwright/test").Page, path: string, check: () => Promise<void>) {
  await expect(async () => {
    await page.goto(path);
    await check();
  }).toPass({ timeout: 150_000, intervals: [5_000] });
}

test("Bulk hair sells at the bulk price from 10 pieces: card, product page and cart", async ({ page }) => {
  test.setTimeout(240_000);
  await untilShown(page, "/shop", async () => {
    await expect(page.getByRole("link", { name: /Bulk hair/ }).filter({ hasText: "Bulk, 10+" })).toBeVisible({ timeout: 1_000 });
  });
  await expect(page.getByText("one price for small quantities, and a lower bulk price from a set number of pieces")).toBeVisible();

  await page.goto("/register");
  await fillRegistration(page, buyer("Dia"));
  const prices = page.getByRole("region", { name: "Prices" });
  await untilShown(page, "/shop/p/bulk-hair", async () => {
    await expect(prices).toContainText("1 to 9 pieces", { timeout: 1_000 });
  });
  await expect(prices).toContainText("10 pieces or more");
  await field(page, /Quantity/).fill("9");
  await expect(prices).toContainText("Add 1 more for the bulk price.");
  await field(page, /Quantity/).fill("10");
  await expect(prices).toContainText("The bulk price applies.");

  await field(page, /Quantity/).fill("9");
  await page.getByRole("button", { name: "Add to cart" }).click();
  const drawer = page.getByRole("dialog", { name: "Added to your cart" });
  await expect(drawer).toContainText("Add 1 more Bulk hair (any option) for the bulk price.");
  await expect(drawer).toContainText("(single price)");
  await drawer.getByRole("button", { name: /^One more/ }).click();
  await expect(drawer).toContainText("Bulk price on all 10 pieces of Bulk hair.");
  await expect(drawer).toContainText("(bulk price)");
});
