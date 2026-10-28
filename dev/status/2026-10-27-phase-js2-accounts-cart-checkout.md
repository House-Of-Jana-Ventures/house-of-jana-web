# Status: JS2, accounts, cart and checkout

Pairs with [`plan`](../plan/2026-10-27-phase-js2-accounts-cart-checkout.md) and [`testing`](../testing/2026-10-27-phase-js2-accounts-cart-checkout.md).

## Result

**Done (2026-10-27) on `dev-esha`. QC pending. Not committed.** `main` (live site) not touched.

Buyers can create an account, fill a cart with the 25-piece bulk rule, check out to an address in India or abroad, and pay online (Razorpay) or by bank transfer. Colours, fonts and sizes are unchanged.

## What was built

- **Accounts:**
  - `/sign-in`, `/register` (name, email, phone, password; company optional), `/forgot-password`, `/reset-password?token=…`
  - Phones typed the Indian way (98123 45678) are sent as +919812345678.
  - Sessions live in httpOnly cookies `jh_at` / `jh_rt` (plus `jh_who` for the first name and `jh_cart` for the badge).
  - `src/proxy.ts` refreshes an expired access token, and sends signed-out visitors from `/cart`, `/checkout` and `/account/…` to sign in and back.
- **Header:** "Sign in", or the first name with a small menu (Cart, Sign out), and a cart icon with the number of pieces. Phones included.
- **Product page:** **Add to cart** is on.
  - Signed in, it adds the item and opens the **cart drawer** (quantities, "Add 5 more for the bulk price", Checkout / Continue shopping / View cart).
  - Signed out, it goes to sign in or register; afterwards the buyer is back on the product, the item is in the cart, and the drawer opens (Q4).
- **`/cart`:** lines grouped by product, single/bulk badge, "add N more" note, made-to-order times, stock problems, quantity forms that work without JavaScript, subtotal.
- **`/checkout`:**
  1. choose a saved address or add one (the form changes with the country: Indian state list, PIN and GSTIN; elsewhere free region and postcode; prefilled with the account's name and phone)
  2. review the order
  3. totals: items, shipping (Free, ₹ amount, or "Quoted by us" abroad), GST included, "add ₹X for free shipping"
  4. a note for the shop, and **Place order** (one order even on a double click; a changed total is shown again before charging)
- **`/account/orders/[number]`** (the page the emails link to):
  - status, items, totals, address, tracking
  - **Pay online** (Razorpay window opens by itself after placing the order) and/or **bank transfer details** with the order number as reference
  - overseas orders show "Waiting for our shipping quote" until the shop enters it
- **API (house-of-jana-api):** `BANK_TRANSFER_DETAILS` setting (items separated by `|`; empty = off); `GET /shop/rules` now returns `payments: { online, bankTransfer: { enabled, details } }`; the "order placed" (India) and "ready to pay" emails include the bank details.

## Deviations from the plan

- **One setting** (`BANK_TRANSFER_DETAILS`) instead of two: bank transfer is on whenever details are given.
- **No payment choice at "Place order":** the buyer chooses on the order page (online or bank transfer), so the order and API stay the same either way.
- **The account menu** has Cart and Sign out only; "My orders" comes with JS3's orders list.

## Issues found and fixed

- The API refused phones like `98123 45678` at registration: the site now adds +91.
- After signing in, the header kept showing "Sign in" until the next full page load: the whole page is now redrawn after signing in or out.
- **Duplicate field ids:** Next 16 keeps recently visited pages mounted (hidden), so two pages each had `id="field-email"` and a label could point at the hidden box. Ids are now unique per page.
- The thank-you note disappeared when the payment window opened; the address is now tidied without reloading the page.

## Verification

- `npm run typecheck`, `npm run lint`: clean.
- `npm test`: **52 unit tests** pass, including cookies, safe return links, pending add-to-cart, cart grouping and wording, addresses and phones, payment panel states and messages.
- `npm run test:e2e`: **31 browser tests** pass, against the test API with the stand-in Razorpay. New in `tests/e2e/checkout.spec.ts` (6):
  - signed out → register → item added → drawer → bulk at 25
  - India: cart → address → order → pay online → confirmed (shipping ₹250 below ₹50,000)
  - abroad: waits for the shipping quote → quote entered → payable within 72 hours
  - double click on Place order → one order
  - sign out, wrong password, forgot password, reset, sign in with the new password
  - account pages `noindex` and the accessibility check
- API after the change: 332 unit and 214 e2e pass.
- Screenshots reviewed (desktop and phone): register, drawer, cart, checkout, payment window, order page.

## Known limitations / next

- **For real payments**, the owner sets in the API's `.env`: Razorpay keys and `ONLINE_PAYMENTS_ENABLED=true`, and/or `BANK_TRANSFER_DETAILS`. Until then the order page says "We'll email you how to pay".
- One real Razorpay **test-mode** payment by hand, once test keys are in.
- **JS3:** My orders list, profile, address book, change password, cancel an order.
- **JA2:** admin screens; until then overseas shipping quotes and bank-transfer payments are entered through the API docs.
