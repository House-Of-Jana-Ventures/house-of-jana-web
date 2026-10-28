# Plan: JS2, accounts, cart and checkout

**Status: Implemented (2026-10-27); see [status](../status/2026-10-27-phase-js2-accounts-cart-checkout.md).** Owner answers (2026-10-27): Q1 Razorpay + bank transfer; Q2 name, email, phone, password (company optional); Q3 cart page + drawer; Q4 sign in, then back to the product with the item added.

## Context

The fifth phase of the [shop roadmap](2026-10-27-jana-shop-roadmap.md). The API can take orders (JB3): addresses, the cart with the 25-piece rule, checkout for India and abroad, Razorpay, emails and forgot password. The website shows products and prices (JS1), but "Add to cart" is switched off. This phase lets a buyer create an account, fill a cart, check out and pay.

## Branch and safety

- **All work on `dev-esha`.** `main` (live janahumanhair.com) isn't touched.
- **Colours, fonts and sizes stay as they are:** #E9F1FA, #00ABE4, white and navy; Geist and Playfair Display. New pages reuse the existing buttons, cards and form fields (shadcn), like the contact form.
- The shop stays out of search engines (`SHOP_INDEXING=false`), and account, cart and checkout pages are always `noindex`.

## Pages

| Page | What it does |
| ---- | ------------ |
| `/sign-in` | Email and password. "Forgot password?" link. Returns to the page the buyer came from. |
| `/register` | Create an account (fields per Q2). Signs in straight away. |
| `/forgot-password` | Enter an email. The same message is shown whether the account exists or not. |
| `/reset-password?token=…` | Choose a new password from the emailed link, then sign in. |
| `/cart` | Lines grouped by product. Quantity steppers. Single or bulk price per line. "Add 7 more of Bulk hair for the bulk price". Stock warnings. Total. "Checkout". |
| `/checkout` | 1. **Address:** choose a saved one or add one (India or abroad). 2. **Review:** items, shipping (or "shipping quoted by us" for overseas), GST included, total, a note for the shop. 3. **Place order**, then pay (Q1). |
| `/account/orders/[number]` | The order page that the emails link to. Shows status, items, totals and address, plus **Pay now** while unpaid (time left shown). Overseas orders show "waiting for our shipping quote" until it's entered. Also the order confirmation after checkout. |

The orders list, profile and address book are JS3.

## Header and product page

- **Header:**
  - an account icon: "Sign in" or the first name, with a small menu (My order pages in JS3, Sign out)
  - a cart icon with the number of pieces
  - Both are on phones too.
- **Product page (JS1):** **Add to cart** is switched on.
  - Adds the chosen variant and quantity, then opens the cart drawer (Q3).
  - Signed out: goes to sign in or register first (Q4), then comes back to the product.
  - The price text stays: "1–24 pieces: single price · 25+: bulk price".

## Approach

- **Sessions:** the same pattern as the admin panel (JA1) and HairCraft.
  - Tokens live in **httpOnly cookies** (`jh_at`, `jh_rt`), set by server actions.
  - `src/proxy.ts` refreshes an expired access token once, before the page renders.
  - The browser never sees a token.
  - All API calls for a buyer go through the site's server (`API_URL`).
- **Server actions for every change:** sign in, register, cart changes, place order, verify payment. Forms work with JavaScript off where possible (cart steppers degrade to a quantity box and "Update").
- **Personal parts** (header account and cart count, cart, checkout) render per request inside `<Suspense>`. The catalogue pages keep their 60-second cache (`cacheComponents`).
- **Prices always come from the API.** The site never works out a price itself; it shows the tier and amounts the cart returns.
- **Double clicks:** each checkout attempt gets one `Idempotency-Key`, so a double click on "Place order" places one order. The order total shown is sent as `expectedGrandTotal`. If it changed, the buyer sees the new total and confirms again.
- **Razorpay:**
  - Razorpay's Checkout script loads only on the pay step (from `checkout.razorpay.com`).
  - The success result goes to a server action that asks the API to verify it.
  - If the browser is closed mid-payment, the API's webhook and background check still confirm the order. The order page shows the result.
- **Errors:** friendly messages for the API's codes:
  - `PRICE_CHANGED`
  - `INSUFFICIENT_STOCK`
  - `CART_NOT_READY`
  - `PAYMENT_NOT_COMPLETED`
  - session expired → sign in again and come back

## Small API changes (in house-of-jana-api)

- **`GET /shop/rules` gains `payments`:** `{ online: true|false, bankTransfer: { enabled, details } }`. The site can then show only the payment options that work.
- **New settings:** `BANK_TRANSFER_ENABLED` and `BANK_TRANSFER_DETAILS` (Q1): account name, bank, account number, IFSC and SWIFT, entered by the owner in `.env`.
- **The new-order email and the order page** show the bank details when the buyer chooses bank transfer.

## Files

- `src/lib/session/*`: cookies, the session reader, refresh, safe "come back to" links
- `src/lib/cart/*`, `src/lib/checkout/*`: API calls and server actions
- `src/proxy.ts`
- `src/app/(auth)/{sign-in,register,forgot-password,reset-password}/page.tsx`
- `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/app/account/orders/[number]/page.tsx`
- `src/components/{auth,cart,checkout}/*`
- header and product-view changes
- `env.example`: nothing secret; the site needs only `API_URL`, as now

## Out of scope

- **JS3:** orders list, profile, address book, change password.
- **JA2:** admin screens for orders, quotes, customers and the dashboard. Until then, the owner enters overseas shipping quotes and bank-transfer payments through the API docs.
- Guest checkout (an account is required), coupons, wishlists.

## Verification

- **Unit tests:** safe return links, cookie handling, cart grouping and the "add N more" text, address form rules, error-code messages.
- **Browser tests** (Playwright against the test API on 4101 with Razorpay's built-in fake):
  - register → add to cart → the cart switches to bulk at 25 → checkout in India → pay → order confirmed
  - an overseas order → "waiting for our shipping quote" → the quote is entered via the API → Pay now
  - sign in, sign out, coming back to the product after sign-in
  - forgot password: the page answers; reset with a token made by the test
  - a double click on "Place order" makes one order
  - phone-size screens
- **By hand:** one real test-mode payment once the owner's Razorpay test keys are in the API's `.env`.
- Existing tests keep passing: 31 unit and 25 e2e.

## Open questions (recommended first)

- **Q1. How can buyers pay?**
  - **(a) Recommended:** online with Razorpay (when the keys are set), **and** bank transfer. Bank transfer shows the owner's bank details; the owner records the payment when it arrives. Large B2B orders are often paid this way, and it works before Razorpay is set up.
  - (b) Razorpay only.
- **Q2. What does registration ask for?**
  - **(a) Recommended:** name, email, phone and password; company name optional. The GSTIN is asked with the address, where the API already stores it.
  - (b) Also require the company name (B2B only).
- **Q3. Cart display.**
  - **(a) Recommended:** a cart page, plus a slide-in cart drawer that opens after "Add to cart" (with "Continue shopping" and "Checkout").
  - (b) The cart page only, with a short "Added" message.
- **Q4. "Add to cart" when signed out.**
  - **(a) Recommended:** go to sign in (with a "Create account" link). After signing in or registering, the buyer is back on the product with the item added.
  - (b) Show "Sign in to order" instead of the button until signed in.
