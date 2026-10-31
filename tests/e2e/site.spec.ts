import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Crafted for a Natural Finish" },
  { path: "/about", heading: "About Jana Human Hair" },
];

const contactButton = (page: Page) => page.getByRole("button", { name: "Contact us" }).last();
const dialog = (page: Page) => page.getByRole("dialog", { name: "Contact us" });

// The form pops up by itself once per visit, 30 seconds after arriving, unless it was opened or a message sent; most tests start as if one had been sent.
test.beforeEach(async ({ page }, testInfo) => {
  if (/pops? up/.test(testInfo.title)) return;
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(900);
}

test("every page has its heading, the menu and the footer details", async ({ page }) => {
  for (const { path, heading } of PAGES) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Main" }).first()).toBeVisible();
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "jweindia@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:jweindia@gmail.com",
    );
    await expect(footer.getByRole("link", { name: "+91 80176 79521" })).toHaveAttribute(
      "href",
      "tel:+918017679521",
    );
  }
});

test("the contact button opens the form; it checks, sends and thanks", async ({ page }) => {
  await page.goto("/about");
  const button = page.getByRole("button", { name: "Contact us" }).last();
  await button.click();
  const form = dialog(page);
  await expect(form).toBeVisible();

  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Please enter your name.")).toBeVisible();
  await expect(form.getByText("Please enter your email address.")).toBeVisible();
  await expect(form.getByLabel("Name")).toBeFocused();

  await form.getByLabel("Name").fill("Mei Ling");
  await form.getByLabel("Email").fill("not-an-email");
  await form.getByLabel("Phone").click();
  await expect(form.getByText(/include an @/)).toBeVisible();
  await form.getByLabel("Email").fill("mei@example.com");
  await form.getByLabel("Phone").fill("+86 138 0013 8000");
  await form.getByLabel("Company").fill("Silk Hair Co.");
  await form.getByLabel("How can we help?").fill("Please send prices for Virgin Remy single drawn hair.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Thank you!")).toBeVisible();
  await form.getByRole("button", { name: "Close" }).first().click();
  await expect(form).toBeHidden();
});

test("what was typed survives the server's checks", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  const form = dialog(page);
  await form.getByLabel("Name").fill("Mei Ling");
  await form.getByLabel("Company").fill("Silk Hair Co.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Please enter your email address.")).toBeVisible();
  await expect(form.getByLabel("Name")).toHaveValue("Mei Ling");
  await expect(form.getByLabel("Company")).toHaveValue("Silk Hair Co.");
});

test("the bulk quote form checks, then sends the choices to the inbox and thanks", async ({ page }) => {
  await page.goto("/");
  const desk = page.getByRole("region", { name: "Buying for a salon or a wig business?" });
  await desk.getByRole("button", { name: "Send my quote request" }).click();
  await expect(desk.getByText("Please enter your name.")).toBeVisible();

  await desk.getByRole("button", { name: "Wavy" }).click();
  await expect(desk.getByRole("button", { name: "Wavy" })).toHaveAttribute("aria-pressed", "true");
  await desk.getByLabel("Deliver to (city, country)").fill("London, UK");
  await desk.getByLabel("Your name").fill("Mei Ling");
  await desk.getByLabel("Company / salon").fill("Silk Hair Co.");
  await desk.getByLabel("Email").fill("mei@example.com");
  await desk.getByLabel("Phone / WhatsApp").fill("+86 138 0013 8000");
  await desk.getByRole("button", { name: "Send my quote request" }).click();
  await expect(desk.getByText("Thank you!")).toBeVisible();
  await expect(desk.getByRole("status")).toContainText("reply within 2 hours");
});

test("old WordPress addresses redirect; /contact opens the form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/\?contact=?$/);
  await expect(dialog(page)).toBeVisible();
  for (const old of ["/thankyou", "/0xf8d554fb/", "/tag/0xf8d554fb/"]) {
    await page.goto(old);
    await expect(page.getByRole("heading", { level: 1, name: PAGES[0].heading })).toBeVisible();
  }
  // Pages removed in phase J3.
  await page.goto("/products");
  await expect(page).toHaveURL(/\/shop$/);
  await page.goto("/community-initiatives");
  await expect(page).toHaveURL(/\/about$/);
  const missing = await page.goto("/no-such-page");
  expect(missing?.status()).toBe(404);
});

test("the hair-type card switches between Virgin Remy, Non-Remy and Raw Temple", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Kinds of hair" });
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("Virgin Remy Single Drawn");
  await tabs.getByRole("tab", { name: "Non-Remy" }).click();
  await expect(tabs.getByRole("tab", { name: "Non-Remy" })).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText("Non-Remy Double Drawn");
  await tabs.getByRole("tab", { name: "Raw Temple" }).click();
  await expect(panel).toContainText("Temple, single donor");
});

test("the bulk price estimator uses the shop's real rule: single below the minimum, bulk from it", async ({ page }) => {
  await page.goto("/");
  const estimator = page.getByRole("region", { name: "How ordering works" });
  const product = estimator.getByLabel("Product");
  await product.selectOption((await product.locator("option", { hasText: "Bulk hair" }).getAttribute("value"))!);
  const output = estimator.locator("output");
  // It starts at the product's bulk minimum.
  const min = Number((await output.textContent())!.match(/\d+/)![0]);
  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
  await expect(estimator.getByText("from ₹5,200", { exact: true })).toBeVisible();
  await expect(estimator.getByText(`from ${inr(min * 5200)}`, { exact: true })).toBeVisible();
  // One fewer: the single price.
  await estimator.getByLabel("Quantity").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(output).toHaveText(`${min - 1} pieces`);
  await expect(estimator.getByText("Single price · 1 more for bulk")).toBeVisible();
  await expect(estimator.getByText(`from ${inr((min - 1) * 6000)}`, { exact: true })).toBeVisible();
});

test("three customers' words show as cards", async ({ page }) => {
  await page.goto("/");
  const reviews = page.getByRole("region", { name: "What our customers say" });
  for (const name of ["Mei Ling", "Emily Roberts", "Sophia Klein"]) await expect(reviews.getByText(name)).toBeVisible();
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content shows at once and numbers don't count", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Story of Jana Human Hair")).toBeVisible();
    await expect(page.getByText("years of craftsmanship").last()).toBeVisible();
    await expect(page.locator("section[aria-labelledby=story-heading] dd").first()).toContainText("50+");
  });
});

test("accessibility: no serious problems on any page or in the form", async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path);
    await scrollThrough(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`), path).toEqual([]);
  }
  await contactButton(page).click();
  await page.waitForTimeout(400);
  const form = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
  expect(form.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});

test("the bot trap is out of reach of autofill and form-filling assistants", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  const trap = dialog(page).locator('input[name="jh_trap"]');
  await expect(trap).toHaveCount(1);
  await expect(trap).toBeHidden();
  await expect(dialog(page).locator('input[name="website"]')).toHaveCount(0);
});

test("the form pops up once, 30 seconds after arriving, in its usual place", async ({ page }) => {
  // Fast-forwarding the page's clock runs its timers, which takes real time.
  test.setTimeout(90_000);
  await page.clock.install();
  await page.goto("/about");
  await page.waitForLoadState("networkidle");
  await page.clock.runFor(29_000);
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(1_500);
  await expect(dialog(page)).toBeVisible();
  // Bottom right on a computer, above the round button.
  const box = (await dialog(page).boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x + box.width).toBeGreaterThan(viewport.width - 60);
  expect(box.y + box.height).toBeGreaterThan(viewport.height - 140);

  // Closed: it doesn't come back this visit, even after a reload.
  await dialog(page).getByRole("button", { name: "Close" }).first().click();
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(35_000);
  await expect(dialog(page)).toBeHidden();
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page.clock.runFor(31_000);
  await expect(dialog(page)).toBeHidden();
});

test("once the visitor has opened the form, it never pops up by itself", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await contactButton(page).click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole("button", { name: "Close" }).first().click();
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(35_000);
  await expect(dialog(page)).toBeHidden();
});

test("while the form pops up, the page still scrolls and works, and focus stays put", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.clock.runFor(30_500);
  const form = dialog(page);
  await expect(form).toBeVisible();
  // Opened by the timer: focus isn't pulled into the form.
  expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"))).toBe(false);

  // The page scrolls behind it, and clicking the page doesn't close it.
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  await page.locator("main").click({ position: { x: 20, y: 20 } });
  await expect(form).toBeVisible();

  // A link behind it works, and the form stays open with what was typed.
  await form.getByLabel("Name").fill("Mei Ling");
  await page.getByRole("navigation", { name: "Main" }).first().getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(form).toBeVisible();
  await expect(form.getByLabel("Name")).toHaveValue("Mei Ling");

  await page.keyboard.press("Escape");
  await expect(form).toBeHidden();
});

test("once a message is sent, the form stops popping up", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await contactButton(page).click();
  const form = dialog(page);
  await form.getByLabel("Name").fill("Mei Ling");
  await form.getByLabel("Email").fill("mei@example.com");
  await form.getByLabel("Phone").fill("+86 138 0013 8000");
  await form.getByLabel("Company").fill("Silk Hair Co.");
  await form.getByLabel("How can we help?").fill("Please send prices for Virgin Remy hair.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Thank you!")).toBeVisible();
  await form.getByRole("button", { name: "Close" }).first().click();
  await page.clock.runFor(31_000);
  await expect(dialog(page)).toBeHidden();
});

test("email typos get a one-click fix, and errors clear as they're corrected", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  const form = dialog(page);
  await form.getByLabel("Email").fill("mei@gmial.con");
  await form.getByLabel("Phone").click();
  await expect(form.getByText("Did you mean mei@gmail.com?")).toBeVisible();
  await form.getByRole("button", { name: "Yes, use mei@gmail.com" }).click();
  await expect(form.getByLabel("Email")).toHaveValue("mei@gmail.com");
  await expect(form.getByText(/Did you mean/)).toBeHidden();

  await form.getByLabel("Email").fill("mei@example");
  await form.getByLabel("Phone").click();
  await expect(form.getByText(/missing its ending/)).toBeVisible();
  await form.getByLabel("Email").fill("mei@example.com");
  await expect(form.getByText(/missing its ending/)).toBeHidden();
});

test("required fields are starred, and WhatsApp is offered as another way", async ({ page }) => {
  await page.goto("/");
  await contactButton(page).click();
  const form = dialog(page);
  await expect(form.getByText(/Fields marked \* are required/)).toBeVisible();
  for (const label of ["Name", "Email", "Phone", "Company", "How can we help?"]) {
    // The star is visual; the field's name stays clean for screen readers, which hear "required".
    const field = form.getByRole("textbox", { name: label, exact: true });
    await expect(field).toHaveAttribute("required", "");
    await expect(form.locator("label", { hasText: label }).locator("span", { hasText: "*" })).toBeVisible();
  }
  const whatsapp = form.getByRole("link", { name: /Chat with us on WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("href", "https://wa.me/message/5EXU5MQ2N5Y3B1");
  await expect(whatsapp).toHaveAttribute("target", "_blank");
});

test("numbers and sections still show after visiting another page and coming back", async ({ page }) => {
  await page.goto("/");
  const stats = page.locator("section[aria-labelledby=story-heading] dd span[aria-hidden]");
  // The numbers sit in the story section and count up once scrolled into view.
  await stats.first().scrollIntoViewIfNeeded();
  await expect(stats.first()).toHaveText("50+", { timeout: 5_000 });
  const nav = page.getByRole("navigation", { name: "Main" }).first();
  for (const other of ["About"]) {
    await nav.getByRole("link", { name: other }).click();
    await expect(page.getByRole("heading", { level: 1 }).filter({ visible: true })).toBeVisible();
    await nav.getByRole("link", { name: "Home" }).click();
    await stats.filter({ visible: true }).first().scrollIntoViewIfNeeded();
    await expect(stats.filter({ visible: true }).first()).toHaveText("50+", { timeout: 5_000 });
    await expect(stats.filter({ visible: true }).nth(1)).toHaveText("4");
  }
  // Every section on the page appears as it's scrolled to.
  await scrollThrough(page);
  const invisible = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
        (e) => e.getClientRects().length > 0 && getComputedStyle(e).opacity === "0",
      ).length,
  );
  expect(invisible).toBe(0);
});
