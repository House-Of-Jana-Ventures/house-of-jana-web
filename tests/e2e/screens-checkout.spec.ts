import { test } from "@playwright/test";
import { buyer, chooseStraight18, field, fillRegistration } from "./support";

/** Not a check: saves screenshots of sign-in, cart, checkout and an order for review (SCREENSHOTS=<folder>). */
test.skip(!process.env.SCREENSHOTS, "screenshots only on request");

test("checkout screenshots", async ({ page }) => {
  const dir = process.env.SCREENSHOTS!;
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/register");
  await page.screenshot({ path: `${dir}/5-register.png`, fullPage: true });
  await fillRegistration(page, buyer("Meera"));
  await chooseStraight18(page, 20);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/6-drawer.png` });
  await page.goto("/cart");
  await page.screenshot({ path: `${dir}/7-cart.png`, fullPage: true });
  await page.goto("/checkout");
  await page.screenshot({ path: `${dir}/8-checkout-address.png`, fullPage: true });
  await field(page, "Address", { exact: true }).fill("Unit 4, Industrial Estate");
  await field(page, "City").fill("Mumbai");
  await field(page, "State").selectOption("Maharashtra");
  await field(page, "PIN code").fill("400050");
  await page.getByRole("button", { name: "Deliver to this address" }).click();
  await page.waitForURL(/address=/);
  await page.screenshot({ path: `${dir}/9-checkout.png`, fullPage: true });
  await page.getByRole("button", { name: "Place order" }).click();
  await page.waitForURL(/\/account\/orders\//);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/10-pay-window.png` });
  await page.frameLocator("iframe").first().getByRole("button", { name: "Close" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/11-order.png`, fullPage: true });
  await page.setViewportSize({ width: 412, height: 915 });
  await page.reload();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/12-order-phone.png`, fullPage: true });
});
