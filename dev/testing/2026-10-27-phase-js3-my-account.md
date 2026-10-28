# Testing: JS3, My account

Pairs with [`plan`](../plan/2026-10-27-phase-js3-my-account.md) and [`status`](../status/2026-10-27-phase-js3-my-account.md).

## Setup

Same as the [JS2 guide](2026-10-27-phase-js2-accounts-cart-checkout.md): the API (4100, with the stand-in Razorpay for testing), the admin panel (3200) and the site on `dev-esha` (3002). Sign in as a buyer with two unpaid orders and, if possible, one paid order (record the payment in the admin panel).

## Steps

1. **Account menu (top right) → My account.**
   - **Expected:** "Hello, …", the unpaid orders under "Waiting for something", the last 3 orders, links to the sections.
2. **Orders.**
   - **Expected:** newest first; each row shows number, total, date, first item ("and 1 more" for two lines) and status.
   - Try **To pay**, **In progress**, **Completed**, **Cancelled**: each shows only those orders.
3. **Open an unpaid order.**
   - **Expected:** a timeline at the bottom.
   - **Cancel this order** → "Keep the order" closes it; again → reason → **Yes, cancel the order**.
   - **Expected:** "Your order is cancelled. Nothing was charged."; status Cancelled with your reason; no cancel button; the stock is back (admin panel → Stock, for in-stock items).
4. **Open a paid order** (not shipped).
   - **Expected:** no cancel button; the note to contact us with the order number.
5. **Order again** on any order.
   - **Expected:** the cart, with "N items added to your cart."
   - If a variant was switched off in the admin panel, it's named as no longer available.
6. **Addresses:**
   - Add an Indian address, then one abroad (e.g. United Kingdom, postcode `e1 6an` → shown as `E1 6AN`).
   - Edit one; make another the default; delete one.
   - **Expected:** a note after each; at 10 addresses, "Add an address" is replaced by a message.
7. **Your details:** change the first name, company and GSTIN, then Save.
   - **Expected:** "Your details are saved."; the header shows the new name.
   - A phone like `98123 45678` is saved as +919812345678.
8. **Password:**
   - A wrong current password shows "Your current password is incorrect." on that field.
   - Change it properly: **Expected:** still signed in here; on another browser where you were signed in, you're signed out.
   - **Sign out everywhere**: **Expected:** the sign-in page saying you're signed out on every device; the new password works.
9. **On a phone (or a narrow window):** the sections are tabs that scroll sideways; nothing makes the page scroll sideways.
10. **Automated checks:** `npm.cmd test` and `npm.cmd run test:e2e`.
    - **Expected:** 57 and 35 pass (2 screenshot tests skipped).

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| 1–2 | Overview, orders and filters | | |
| 3–5 | Cancel, paid order note, order again | | |
| 6 | Addresses | | |
| 7–8 | Details, password, sign out everywhere | | |
| 9–10 | Phone, automated checks | | |

QC sign-off: ____________________, ____ / ____ / ______
