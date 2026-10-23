import { expect, test } from "@playwright/test";

// The form pops up by itself every 15 seconds until a message is sent; most tests start as if one had been.
test.beforeEach(async ({ page }, testInfo) => {
  if (/pops? up/.test(testInfo.title)) return;
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

test("on a phone: the menu slides out, pages fit, and the form is a bottom sheet", async ({ page }) => {
  for (const path of ["/", "/about", "/products", "/community-initiatives"]) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      screen: window.innerWidth,
    }));
    expect(widths.page, path).toBeLessThanOrEqual(widths.screen);
  }

  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page.getByRole("dialog").getByRole("link", { name: "Products" }).tap();
  await expect(page).toHaveURL(/\/products$/);

  await page.getByRole("button", { name: "Contact us" }).last().tap();
  const form = page.getByRole("dialog", { name: "Contact us" });
  await expect(form).toBeVisible();
  const box = (await form.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(Math.round(box.y + box.height)).toBeGreaterThanOrEqual(viewport.height - 2);
  expect(Math.round(box.width)).toBe(viewport.width);
  // A short sheet: the page above it stays in view and scrolls.
  expect(box.height).toBeLessThanOrEqual(viewport.height * 0.63);
  await page.mouse.wheel(0, 800);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  await expect(form).toBeVisible();
});
