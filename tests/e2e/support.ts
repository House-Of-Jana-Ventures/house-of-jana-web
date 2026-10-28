import { createHash, randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { join } from "node:path";
import { expect, type Page } from "@playwright/test";

/** The test API and its super admin, set up by scripts/e2e.mjs (jana_test only). */
export const API = process.env.API_URL ?? "http://localhost:4101/api/v1";
const QC = { email: "qc.shop@test.local", password: "QcShop2026pass" };
// Playwright runs from the site's folder; the API sits beside it.
const API_DIR = join(process.cwd(), "..", "house-of-jana-api");

/** A signed-in admin call to the test API (for what JA2's screens will do: shipping quotes). */
export async function asAdmin<T>(method: string, path: string, body?: unknown): Promise<T> {
  const login = await fetch(`${API}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(QC),
  });
  const token = (await login.json()).data.accessToken as string;
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${JSON.stringify(json)}`);
  return json.data as T;
}

/**
 * A password reset link for an account, made straight in jana_test the way
 * the API makes one (only the hash is stored): emails aren't sent in tests.
 */
export async function resetLinkToken(email: string): Promise<string> {
  process.loadEnvFile(join(API_DIR, ".env"));
  const { Client } = createRequire(join(API_DIR, "package.json"))("pg");
  const db = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "jana_test",
  });
  await db.connect();
  try {
    const secret = randomBytes(32).toString("base64url");
    await db.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       SELECT id, $2, now() + interval '1 hour' FROM users WHERE email = $1`,
      [email, createHash("sha256").update(secret).digest("hex")],
    );
    return secret;
  } finally {
    await db.end();
  }
}

/** A new buyer each run, so tests don't depend on each other. */
export function buyer(name: string) {
  return { firstName: name, email: `${name.toLowerCase()}.${Date.now()}@test.local`, password: "Sunshine2026" };
}

export async function fillRegistration(page: Page, who: ReturnType<typeof buyer>, phone = "9812345678") {
  await field(page, "First name").fill(who.firstName);
  await field(page, "Email").fill(who.email);
  await field(page, "Phone").fill(phone);
  await field(page, "Password", { exact: true }).fill(who.password);
  await field(page, "Password again").fill(who.password);
  await page.getByRole("button", { name: "Create account" }).click();
  // Signed in once the page has moved on.
  await expect(page).not.toHaveURL(/\/register/);
}

/** Picks Straight · 18 in (made to order, ₹6,000 / ₹5,200) and a quantity. */
export async function chooseStraight18(page: Page, quantity: number) {
  await page.goto("/shop/p/bulk-hair");
  await page.locator("label").filter({ hasText: /^Straight/ }).click();
  await page.locator("label").filter({ hasText: /^18 in/ }).click();
  await expect(page.getByText("Made to order, ships in about 14 days")).toBeVisible();
  await field(page, /Quantity/).fill(String(quantity));
}

/**
 * A form field by its label, on the page in view. Next keeps recently
 * visited pages mounted but hidden, so the sign-in page's Email box can sit
 * (invisible) beside the register page's.
 */
export function field(page: Page, label: string | RegExp, options?: { exact?: boolean }) {
  return page.getByLabel(label, options).filter({ visible: true });
}
