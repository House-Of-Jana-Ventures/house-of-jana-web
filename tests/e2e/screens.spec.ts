import { test } from "@playwright/test";

/** Not a check: saves screenshots of the shop for review (SCREENSHOTS=<folder>). */
test.skip(!process.env.SCREENSHOTS, "screenshots only on request");

test("shop screenshots", async ({ page }) => {
  const dir = process.env.SCREENSHOTS!;
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main" }).first().getByRole("button", { name: "Products" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/1-menu.png` });
  await page.goto("/shop/hair-extensions");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/2-category.png`, fullPage: true });
  await page.goto("/shop/p/bulk-hair");
  await page.getByLabel(/Quantity/).fill("10");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/3-product.png`, fullPage: true });
  await page.setViewportSize({ width: 412, height: 915 });
  await page.reload();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/4-product-phone.png`, fullPage: true });
});
