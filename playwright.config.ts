import { defineConfig, devices } from "@playwright/test";

export const BASE = "http://localhost:3301";

/**
 * Browser tests against the production build. The contact form runs in
 * dry-run mode (CONTACT_DRY_RUN=true, no RESEND_API_KEY): messages are only
 * logged, never emailed.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: BASE, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testIgnore: /mobile\.spec/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec/ },
  ],
  webServer: {
    command: "npx next start -p 3301",
    url: BASE,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      CONTACT_DRY_RUN: "true",
      GMAIL_APP_PASSWORD: "",
      // The test API started by scripts/e2e.mjs.
      API_URL: process.env.API_URL ?? "http://localhost:4101/api/v1",
      // Sign-in cookies over http (the test server isn't HTTPS), and the API's stand-in Razorpay window.
      COOKIE_SECURE: "false",
      RAZORPAY_SCRIPT_URL: "http://localhost:4101/api/v1/dev/razorpay/checkout.js",
      ALLOW_TEST_PAYMENT_SCRIPT: "true",
    },
  },
});
