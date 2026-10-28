# Status: JS3, My account

Pairs with [`plan`](../plan/2026-10-27-phase-js3-my-account.md) and [`testing`](../testing/2026-10-27-phase-js3-my-account.md).

## Result

**Done (2026-10-27) on `dev-esha`. QC pending. Not committed.** `main` (live site) not touched.

Buyers have their own area: orders (with filters, timeline, cancel before paying, order again), the address book, their details and their password. Colours, fonts and sizes are unchanged.

## What was built

- **Layout:** `/account/…` has a side menu (Overview, Orders, Addresses, Your details, Password); on phones it's a row of tabs that scrolls sideways.
- **Header account menu:** My account, My orders, Cart, Sign out.
- **`/account`:**
  - "Hello, Meera"
  - **Waiting for something:** orders to pay, and orders waiting for our shipping quote
  - the last 3 orders, and links to the sections
- **`/account/orders`:** all orders, newest first, 10 per page. Each row shows number, total, date, first item ("and 2 more"), and status (amber when waiting). Filters: All · To pay · In progress · Completed · Cancelled.
- **Order page** (from JS2) adds:
  - a **timeline** of every step with date and note
  - **Cancel this order** before paying, with a confirm step and an optional reason (Q1). Paid orders that aren't shipped yet say "contact us to change or cancel".
  - **Order again:** the same items go back into the cart; items no longer sold are skipped and named on the cart page.
  - a link back to all orders
- **`/account/addresses`:** up to 10 addresses. Add, edit (the checkout form, India or abroad), make default, delete. Buttons work without JavaScript.
- **`/account/profile`:** name, phone (Indian numbers get +91), company, GSTIN.
  - The email is shown, with "contact us" to change it.
  - Closing an account is by contact, not self-service (Q3).
  - A new first name shows in the header at once.
- **`/account/password`:**
  - change the password: this device stays signed in, other devices are signed out
  - **Sign out everywhere**
- **API (house-of-jana-api):**
  - Order summaries now include `lineCount`, for "and 2 more".
  - **Fixed:** `GET /orders?status=A,B` (the buyer's list with several statuses) answered 500; the SQL lost a `$` in JB3's change (`ANY(2)`). Now covered by an e2e test.

## Deviations from the plan

- **Paid order wording:** a paid order shows the "contact us" note only until it ships; after that there's nothing to change.
- **Cancel confirmation:** after cancelling, the page shows the confirmation itself (the form goes away once the order is cancelled).

## Issues found and fixed

- **The buyer's multi-status order list failed** (see the API bug above).
- **Phone overflow:** on phones the account menu's grid column didn't shrink, so the page was 535 px wide on a 390 px screen.
- **Menu on dynamic routes:** the account menu reads the current address; on dynamic routes, Next 16 needs it inside `<Suspense>`, or the build stops.

## Verification

- `npm run typecheck`, `npm run lint`: clean.
- `npm test`: **57 unit tests** pass (new: order filters, who may cancel, "and N more", the order-again note, the name cookie).
- `npm run test:e2e`: **35 browser tests** pass. New in `tests/e2e/account.spec.ts` (4):
  - orders: overview, filters, cancel before paying, order again
  - addresses: India and abroad, edit, default, delete
  - details (header follows the name) and password (wrong current password, change, still signed in, sign out everywhere, new password works)
  - every account page on a phone: no sideways scrolling, `noindex`, accessibility check
- API: 332 unit and **216 e2e** pass; admin panel 12 unit pass.

## Next

- The whole shop (JB1–JB3, JA1–JA2, JS1–JS3) is built and waits for QC.
- **Before launch:**
  - in the API's `.env`: real shipping and GST settings, Razorpay keys and/or bank details, Gmail settings
  - one real Razorpay test payment
  - on the site: `SHOP_INDEXING=true`
  - commit, and merge `dev-esha` into `main` when you decide
