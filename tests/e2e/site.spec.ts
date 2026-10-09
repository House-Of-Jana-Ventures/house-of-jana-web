import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "From the heart of Midnapore to the world" },
  { path: "/about", heading: "About Jana Human Hair" },
  { path: "/products", heading: "Discover the perfect hair for every need" },
  { path: "/community-initiatives", heading: "Our philanthropic journey" },
];

const contactButton = (page: Page) => page.getByRole("button", { name: "Contact us" }).last();
const dialog = (page: Page) => page.getByRole("dialog", { name: "Contact us" });

// The form pops up by itself every 10 seconds until a message is sent; most tests start as if one had been.
test.beforeEach(async ({ page }, testInfo) => {
  if (/pops? up/.test(testInfo.title)) return;
  await page.addInitScript(() => sessionStorage.setItem("jh-contact-sent", "1"));
});

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

test("every page has its heading, the menu and the footer details", async ({ page }) => {
  for (const { path, heading } of PAGES) {
    await page.goto(path);
    // The accessible name (the hero's animated words are hidden from screen readers).
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

test("Enquire about a product fills in the message; Escape closes", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("button", { name: "Enquire about Weft" }).click();
  await expect(dialog(page).getByLabel("How can we help?")).toHaveValue(
    "I'd like to know more about Weft. ",
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
  const missing = await page.goto("/no-such-page");
  expect(missing?.status()).toBe(404);
});

test("the community gallery opens photos large and moves between them", async ({ page }) => {
  await page.goto("/community-initiatives");
  await page.getByRole("button", { name: /^View larger: Crocheted bunny/ }).click();
  const viewer = page.getByRole("dialog");
  await expect(viewer.getByText(/1 of 12/)).toBeVisible();
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(viewer.getByText(/2 of 12/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
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

test("the form pops up every 10 seconds, even after closing, in its usual place", async ({ page }) => {
  await page.clock.install();
  await page.goto("/about");
  await page.waitForLoadState("networkidle");
  await page.clock.runFor(9_000);
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(1_500);
  await expect(dialog(page)).toBeVisible();
  // Bottom right on a computer, above the round button.
  const box = (await dialog(page).boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x + box.width).toBeGreaterThan(viewport.width - 60);
  expect(box.y + box.height).toBeGreaterThan(viewport.height - 140);

  // Closed: back again 10 seconds later.
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(9_000);
  await expect(dialog(page)).toBeHidden();
  await page.clock.runFor(1_500);
  await expect(dialog(page)).toBeVisible();
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
  await page.clock.runFor(12_000);
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
