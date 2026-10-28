# Testing: JS2, accounts, cart and checkout

Pairs with [`plan`](../plan/2026-10-27-phase-js2-accounts-cart-checkout.md) and [`status`](../status/2026-10-27-phase-js2-accounts-cart-checkout.md).

## Setup

1. In `house-of-jana-api/.env`, for testing only:
   - `RAZORPAY_FAKE=true` and `ONLINE_PAYMENTS_ENABLED=true` (a stand-in payment window, no real money)
   - `BANK_TRANSFER_DETAILS=Account name: House of Jana Ventures Pvt Ltd | Bank: Test Bank | IFSC: TEST0000001`
   - optionally `SHIPPING_FEE_INDIA=250` and `FREE_SHIPPING_THRESHOLD_INDIA=50000`
2. Restart the API (`npm.cmd run start:dev`, port 4100).
3. In `house-of-jana-web/.env.local`, add `RAZORPAY_SCRIPT_URL=http://localhost:4100/api/v1/dev/razorpay/checkout.js`, then start the site on `dev-esha` (`npm.cmd run dev -- -p 3002`).
4. At least one product must be live with prices (admin panel, http://localhost:3200).

## Steps

1. **Signed out, open a product and click Add to cart.**
   - **Expected:** the sign-in page, saying the item goes into the cart straight after.
2. **Click "Create an account"** and register (phone like `98123 45678`).
   - **Expected:** back on the product, the cart drawer open with the item, the header showing your first name and the cart count.
3. **In the drawer, press + until the product has 25 pieces.**
   - **Expected:** every line switches to the bulk price; the note says "Bulk price on all 25 pieces".
4. **View cart; lower a line below 25 in total** (type a number, Update).
   - **Expected:** back to single price, "Add N more … for the bulk price". Remove works.
5. **Checkout with no saved address.**
   - **Expected:** the address form, prefilled with your name and phone.
   - India: a state list, PIN code and GSTIN. Choose another country: the state becomes free text, "Postcode", no GSTIN.
6. **Save an Indian address.**
   - **Expected:** totals with Items, Shipping (₹250, or Free from ₹50,000), Total, GST included; the text says you can pay online or by bank transfer within 24 hours.
7. **Place order.**
   - **Expected:** the order page with "Thank you…", "Waiting for payment", the time left, bank details with the order number as reference, and the payment window opening by itself.
8. **In the stand-in window, click Pay.**
   - **Expected:** "Confirmed", "Paid, thank you." The header cart count is gone.
9. **Another order, click Fail in the window, then Close.**
   - **Expected:** a message that the payment didn't go through; Pay online can be tried again.
10. **Abroad:** add an address in another country (e.g. United Arab Emirates) and place an order.
    - **Expected:** "Quoted by us" at checkout; the order page shows "Waiting for our shipping quote" and no payment.
    - In the API docs, `POST /api/v1/admin/orders/{id}/shipping-quote` with `{"shipping": "12500"}`, then reload: payable, about 71 hours to pay.
11. **Click Place order twice quickly.**
    - **Expected:** one order (check `GET /api/v1/admin/orders`).
12. **Account menu → Sign out, then open `/cart`.**
    - **Expected:** sign-in page; after signing in, back on the cart.
13. **Forgot password** with your email.
    - **Expected:** the same message whatever the email. With Gmail set in the API, the email's link opens `/reset-password`; a new password works and old sessions end.
14. **On a phone (or a narrow window):** header icons, drawer, checkout and order page fit the screen.
15. **Automated checks:** `npm.cmd test` and `npm.cmd run test:e2e`.
    - **Expected:** 52 and 31 pass (2 screenshot tests skipped).

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| 1–3 | Add to cart signed out, register, drawer, bulk | | |
| 4 | Cart page | | |
| 5–9 | Checkout India, pay online, failed payment | | |
| 10 | Abroad and shipping quote | | |
| 11–13 | Double click, sign out/in, forgot password | | |
| 14–15 | Phone, automated checks | | |

QC sign-off: ____________________, ____ / ____ / ______

**After testing:** remove `RAZORPAY_FAKE`, the test bank details and `RAZORPAY_SCRIPT_URL` again.
