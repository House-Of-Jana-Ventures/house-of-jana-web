import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { buyer, chooseStraight18, field, fillRegistration } from "./support";

/**
 * My account (JS3) against the test API (scripts/e2e.mjs): orders and their
 * filters, cancelling before paying, order again, the address book, details
 * and password.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

async function orderOne(page: Page, quantity: number) {
  await chooseStraight18(page, quantity);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Checkout" }).click();
  // A first order shows the address form; later ones use the saved address.
  const next = page.getByRole("button", { name: /^(Place order|Deliver to this address)$/ });
  await expect(next).toBeVisible();
  if ((await next.textContent())?.includes("Deliver")) {
    await field(page, "Address", { exact: true }).fill("Unit 4, Industrial Estate");
    await field(page, "City").fill("Mumbai");
    await field(page, "State").selectOption("Maharashtra");
    await field(page, "PIN code").fill("400050");
    await page.getByRole("button", { name: "Deliver to this address" }).click();
    await expect(page).toHaveURL(/address=/);
  }
  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page).toHaveURL(/\/account\/orders\/JH-\d+/);
  // Close the payment window that opens by itself.
  await page.frameLocator("iframe").first().getByRole("button", { name: "Close" }).click();
  return page.url().match(/JH-\d+/)![0];
}

test("orders: list, filters, cancel before paying, order again", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Nila"));
  const first = await orderOne(page, 2);
  const second = await orderOne(page, 3);

  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Hello, Nila" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Waiting for something" })).toContainText(`${first} is waiting for your payment.`);

  await page.getByRole("navigation", { name: "My account" }).getByRole("link", { name: "Orders" }).click();
  await expect(page.getByRole("link", { name: new RegExp(`^${second} ₹`) })).toBeVisible();
  await page.getByRole("link", { name: "To pay" }).click();
  await expect(page.getByRole("link", { name: new RegExp(`^${first} ₹`) })).toBeVisible();
  await page.getByRole("link", { name: "Cancelled" }).click();
  await expect(page.getByText("No orders here.")).toBeVisible();

  // Cancel the second one.
  await page.goto(`/account/orders/${second}`);
  await expect(page.getByRole("region", { name: "Timeline" })).toContainText("Waiting for payment");
  await page.getByRole("button", { name: "Cancel this order" }).click();
  await field(page, /Why\?/).fill("Ordered twice");
  await page.getByRole("button", { name: "Yes, cancel the order" }).click();
  await expect(page.getByText("Your order is cancelled. Nothing was charged.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("This order was cancelled: Ordered twice.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel this order" })).toHaveCount(0);

  // Order again puts the 3 pieces back in the cart.
  await page.getByRole("button", { name: "Order again" }).click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByRole("main").getByRole("status")).toHaveText("1 item added to your cart.");
  await expect(page.getByRole("main").getByLabel(/Quantity of/)).toHaveValue("3");
});

test("addresses: add one abroad, edit, make default, delete", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Rafi"));
  await page.goto("/account/addresses");
  await expect(page.getByText("No addresses yet.")).toBeVisible();

  await page.getByRole("link", { name: "Add an address" }).click();
  await field(page, "Full name").fill("Rafi Khan");
  await field(page, "Phone").fill("9812345678");
  await field(page, "Address", { exact: true }).fill("12 Park Street");
  await field(page, "City").fill("Kolkata");
  await field(page, "State").selectOption("West Bengal");
  await field(page, "PIN code").fill("700016");
  await page.getByRole("button", { name: "Add address" }).click();
  await expect(page.getByRole("status")).toHaveText("Address added.");

  await page.getByRole("link", { name: "Add an address" }).click();
  await field(page, "Country").selectOption("GB");
  await field(page, "Full name").fill("Rafi Khan");
  await field(page, "Phone").fill("+44 20 7946 0958");
  await field(page, "Address", { exact: true }).fill("10 Market Street");
  await field(page, "City").fill("London");
  await field(page, "Postcode").fill("e1 6an");
  await page.getByRole("button", { name: "Add address" }).click();
  // Next keeps the page just left mounted (hidden): only what is on screen counts.
  const london = page.getByRole("main").getByRole("listitem").filter({ hasText: "London", visible: true });
  await expect(london).toContainText("United Kingdom");
  await expect(london).toContainText("E1 6AN");

  await london.getByRole("link", { name: /Edit/ }).click();
  await field(page, "City").fill("Manchester");
  await field(page, "Postcode").fill("M1 1AE");
  await page.getByRole("button", { name: "Save address" }).click();
  await expect(page.getByRole("status")).toHaveText("Address saved.");
  const manchester = page.getByRole("main").getByRole("listitem").filter({ hasText: "Manchester", visible: true });
  await manchester.getByRole("button", { name: /Make default/ }).click();
  await expect(page.getByRole("main").getByRole("listitem").filter({ hasText: "Manchester", visible: true })).toContainText("Default");
  await page.getByRole("main").getByRole("listitem").filter({ hasText: "Kolkata", visible: true }).getByRole("button", { name: /Delete/ }).click();
  await expect(page.getByRole("status")).toHaveText("Address deleted.");
  await expect(page.getByRole("main").getByRole("listitem").filter({ hasText: "Kolkata", visible: true })).toHaveCount(0);
});

test("details and password: the header follows the new name; the new password works", async ({ page }) => {
  const tara = buyer("Tara");
  await page.goto("/register");
  await fillRegistration(page, tara);
  await page.goto("/account/profile");
  await expect(page.getByText(tara.email)).toBeVisible();
  await field(page, "First name").fill("Tarini");
  await field(page, "Company").fill("Tarini Salon");
  await field(page, "GSTIN").fill("19abcde1234f1z5");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("main").getByRole("status")).toHaveText("Your details are saved.");
  await expect(page.getByRole("button", { name: "Account menu for Tarini" })).toBeVisible();

  await page.getByRole("navigation", { name: "My account" }).getByRole("link", { name: "Password" }).click();
  await field(page, "Current password").fill("wrong-one-123");
  await field(page, "New password", { exact: true }).fill("Moonlight2027");
  await field(page, "New password again").fill("Moonlight2027");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByText("Your current password is incorrect.")).toBeVisible();
  await field(page, "Current password").fill(tara.password);
  await field(page, "New password", { exact: true }).fill("Moonlight2027");
  await field(page, "New password again").fill("Moonlight2027");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText("Password changed.");
  // Still signed in here.
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Hello, Tarini" })).toBeVisible();

  await page.goto("/account/password");
  await page.getByRole("button", { name: "Sign out everywhere" }).click();
  await expect(page.getByText("You're signed out on every device.")).toBeVisible();
  await field(page, "Email").fill(tara.email);
  await field(page, "Password", { exact: true }).fill("Moonlight2027");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/shop$/);
});

test("my account fits a phone and passes the accessibility check", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Ira"));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/account", "/account/orders", "/account/addresses", "/account/profile", "/account/password"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, screen: window.innerWidth }));
    expect(widths.page, path).toBeLessThanOrEqual(widths.screen);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), path).toEqual([]);
  }
});
