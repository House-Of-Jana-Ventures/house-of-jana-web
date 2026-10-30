import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Jana Human Hair: natural human hair extensions from Midnapore" },
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

test("Bulk enquiry fills in the message; Escape closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bulk enquiry" }).click();
  await expect(dialog(page).getByLabel("How can we help?")).toHaveValue(
    "I'd like to know more about bulk orders. ",
  );
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
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

test("the home banner moves every 3 seconds, stops under the pointer, and the dots choose a slide", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const banner = page.getByRole("region", { name: "Jana Human Hair", exact: true });
  // Only the slide on show is visible to screen readers and the keyboard.
  const title = banner.getByRole("heading", { level: 2 });
  await expect(title).toHaveText("The Art of Beautiful Hair");
  await page.clock.runFor(3_200);
  await expect(title).toHaveText("More Volume. More Confidence.");

  // The pointer on it: it stops. Off it: it carries on.
  await banner.hover();
  await page.clock.runFor(10_000);
  await expect(title).toHaveText("More Volume. More Confidence.");
  await page.mouse.move(5, page.viewportSize()!.height - 5);
  await page.clock.runFor(3_200);
  await expect(title).toHaveText("Crafted for a Natural Finish");

  // No arrows or pause button; the dots choose a slide.
  await expect(banner.getByRole("button", { name: /Next|Previous|Pause|Play/ })).toHaveCount(0);
  await banner.getByRole("button", { name: /^Show slide 4/ }).click();
  await expect(title).toHaveText("Experience the Beauty of Premium Hair");
  await expect(banner.getByRole("button", { name: /^Show slide 4/ })).toHaveAttribute("aria-current", "true");
});

test("testimonials move with the arrows", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("group", { name: "What our customers say" });
  await expect(carousel.getByText("Mei Ling")).toBeVisible();
  await carousel.getByRole("button", { name: "Next review" }).click();
  await expect(carousel.getByText("Emily Roberts")).toBeVisible();
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content shows at once and numbers don't count", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Story of Jana Human Hair")).toBeVisible();
    await expect(page.getByText("years of craftsmanship").last()).toBeVisible();
    await expect(page.locator("dd").first()).toContainText("50+");
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
  const stats = page.locator("main dd span[aria-hidden]");
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
