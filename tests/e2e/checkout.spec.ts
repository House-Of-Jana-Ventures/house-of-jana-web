import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { asAdmin, buyer, chooseStraight18, field, fillRegistration, resetLinkToken } from "./support";

/**
 * Accounts, cart and checkout against the test API (scripts/e2e.mjs): the
 * stand-in Razorpay, bank transfer offered, ₹250 shipping in India below
 * ₹50,000 of goods. Bulk hair at 18 in costs ₹6,000 each, ₹5,200 from 25.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

async function addIndianAddress(page: Page) {
  await field(page, "Full name").fill("Meera Iyer");
  await field(page, "Phone").fill("98123 45678");
  await field(page, "Address", { exact: true }).fill("Unit 4, Industrial Estate");
  await field(page, "City").fill("Mumbai");
  await field(page, "State").selectOption("Maharashtra");
  await field(page, "PIN code").fill("400 050");
  await page.getByRole("button", { name: "Deliver to this address" }).click();
}

test("signed out, Add to cart signs up first, then the item is in the cart and the cart opens", async ({ page }) => {
  const meera = buyer("Meera");
  await chooseStraight18(page, 20);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page).toHaveURL(/\/sign-in\?next=.*bulk-hair.*&add=/);
  await expect(page.getByText("Your item goes into the cart straight after")).toBeVisible();

  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/register\?next=.*&add=/);
  await fillRegistration(page, meera);

  // Back on the product, with the cart open.
  await expect(page).toHaveURL(/\/shop\/p\/bulk-hair\?v=BH-STR-/);
  const drawer = page.getByRole("dialog", { name: "Added to your cart" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("20 pieces in your cart");
  await expect(drawer).toContainText("Add 5 more Bulk hair (any options) for the bulk price.");
  await expect(drawer).toContainText("₹1,20,000");

  // Five more from the drawer: the bulk price for all.
  for (let i = 0; i < 5; i++) await drawer.getByRole("button", { name: /^One more/ }).click();
  await expect(drawer).toContainText("Bulk price on all 25 pieces of Bulk hair.");
  await expect(drawer).toContainText("₹1,30,000");
  await drawer.getByRole("button", { name: "Continue shopping" }).click();
  await expect(page.getByRole("link", { name: "Cart, 25 pieces" })).toBeVisible();
});

test("India: cart → address → order → pay online → confirmed", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Asha"));
  await expect(page).toHaveURL(/\/shop$/);

  await chooseStraight18(page, 3);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "View cart" }).click();

  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
  const cart = page.getByRole("main");
  await expect(cart.getByText("Add 22 more Bulk hair (any options) for the bulk price.")).toBeVisible();
  await field(page, /Quantity of/).fill("5");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(cart.getByText("Add 20 more Bulk hair")).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Summary" })).toContainText("₹30,000");
  await page.getByRole("link", { name: "Checkout" }).click();

  // No address yet: the form is open, with the account's name and phone.
  await expect(field(page, "Full name")).toHaveValue("Asha");
  await addIndianAddress(page);
  await expect(page).toHaveURL(/\/checkout\?address=/);
  const total = page.getByRole("complementary", { name: "Total" });
  await expect(total).toContainText("₹30,000");
  await expect(total).toContainText("₹250");
  await expect(total).toContainText("₹30,250");
  await expect(total).toContainText("Add ₹20,000 more for free shipping in India.");
  await expect(total).toContainText("online (UPI, cards, net banking) or by bank transfer, within 24 hours");

  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page).toHaveURL(/\/account\/orders\/JH-\d{6}$/);
  await expect(page.getByText("Thank you, your order is placed.")).toBeVisible();
  await expect(page.getByText("Waiting for payment", { exact: true }).first()).toBeVisible();
  const payment = page.getByRole("region", { name: "Pay ₹30,250" });
  await expect(payment).toContainText("Or pay by bank transfer");
  await expect(payment).toContainText("IFSC: TEST0000001");
  // The cart is empty again (the badge is gone).
  await expect(page.getByRole("link", { name: "Cart", exact: true })).toBeVisible();

  // The payment window opened by itself (the API's stand-in): pay.
  const window = page.frameLocator("iframe").first();
  await window.getByRole("button", { name: "Pay" }).click();
  await expect(page.getByText("Paid, thank you.")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Confirmed", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: /^Pay / })).toHaveCount(0);
});

test("abroad: the order waits for our shipping quote, then can be paid", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Layla"), "+971 50 123 4567");
  await chooseStraight18(page, 30);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Checkout" }).click();

  await field(page, "Country").selectOption("AE");
  await expect(field(page, "Postcode")).toBeVisible();
  await expect(field(page, "GSTIN")).toHaveCount(0);
  await field(page, "Full name").fill("Layla Haddad");
  await field(page, "Address", { exact: true }).fill("Warehouse 7, Al Quoz");
  await field(page, "City").fill("Dubai");
  await field(page, "State / region").fill("Dubai");
  await field(page, "Postcode").fill("00000");
  await page.getByRole("button", { name: "Deliver to this address" }).click();

  const total = page.getByRole("complementary", { name: "Total" });
  await expect(total).toContainText("Quoted by us");
  await expect(total).toContainText("Total before shipping");
  await expect(total).toContainText("₹1,56,000");
  await page.getByRole("button", { name: "Place order, get a shipping quote" }).click();

  await expect(page.getByText("Waiting for our shipping quote")).toBeVisible();
  await expect(page.getByRole("region", { name: /^Pay / })).toHaveCount(0);
  const number = page.url().match(/JH-\d+/)![0];

  // The shop enters the shipping (the admin screen comes in JA2).
  const orders = await asAdmin<{ id: string; orderNumber: string }[]>("GET", `/admin/orders?search=${number}`);
  await asAdmin("POST", `/admin/orders/${orders[0].id}/shipping-quote`, { shipping: "12500" });
  await page.reload();
  await expect(page.getByText("Waiting for payment", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Pay ₹1,68,500" })).toContainText("Please pay within 71 hours");
});

test("a double click on Place order places one order", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, buyer("Ravi"));
  await chooseStraight18(page, 1);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Checkout" }).click();
  await addIndianAddress(page);
  await page.getByRole("button", { name: "Place order" }).dblclick();
  await expect(page).toHaveURL(/\/account\/orders\/JH-\d{6}/);
  const mine = await asAdmin<unknown[]>("GET", `/admin/orders?search=ravi.`);
  expect(mine).toHaveLength(1);
});

test("sign out, sign in again; forgot and reset password", async ({ page }) => {
  const sam = buyer("Sam");
  await page.goto("/register");
  await fillRegistration(page, sam);
  await page.getByRole("button", { name: "Account menu for Sam" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();

  // The cart needs signing in, and comes back after.
  await page.goto("/cart");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fcart/);
  await field(page, "Email").fill(sam.email);
  await field(page, "Password").fill("wrong-password-1");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("That email and password don't match an account.");
  await expect(field(page, "Email")).toHaveValue(sam.email);

  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Forgot your password?" })).toBeVisible();
  await field(page, "Email").fill(sam.email);
  await page.getByRole("button", { name: "Email me a link" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText("we've emailed a link");

  await page.goto(`/reset-password?token=${await resetLinkToken(sam.email)}`);
  await field(page, "New password", { exact: true }).fill("NewSunshine2027");
  await field(page, "New password again").fill("NewSunshine2027");
  await page.getByRole("button", { name: "Save the new password" }).click();
  await expect(page.getByText("Your password has been changed.")).toBeVisible();
  await field(page, "Email").fill(sam.email);
  await field(page, "Password", { exact: true }).fill("NewSunshine2027");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/shop$/);

  await page.goto("/reset-password?token=short");
  await expect(page.getByRole("heading", { name: "This link doesn't work" })).toBeVisible();
});

test("account pages are out of search engines and pass the accessibility check", async ({ page }) => {
  for (const path of ["/sign-in", "/register", "/forgot-password"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), path).toEqual([]);
  }
  await page.goto("/register");
  await fillRegistration(page, buyer("Tara"));
  await chooseStraight18(page, 2);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "View cart" }).click();
  for (const path of ["/cart", "/checkout"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), path).toEqual([]);
  }
});
