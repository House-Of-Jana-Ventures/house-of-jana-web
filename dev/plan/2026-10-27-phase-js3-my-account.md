# Plan: JS3, My account

**Status: Implemented (2026-10-27); see [status](../status/2026-10-27-phase-js3-my-account.md).** Owner answers (2026-10-27): Q1 cancel online only before paying; Q2 separate pages with a side menu; Q3 no self-service delete.

## Context

The last storefront phase of the [shop roadmap](2026-10-27-jana-shop-roadmap.md). Buyers can order and pay (JS2), but they can only reach an order through the link in its email. JS3 gives them their own area: their orders, their details, their addresses and their password.

## Branch and safety

- **All work on `dev-esha`.** `main` (live site) isn't touched.
- Colours, fonts and sizes stay as they are. The pages reuse JS2's cards, fields and buttons.
- Every page is `noindex` and needs sign-in (already handled by `src/proxy.ts` for `/account/…`).

## Pages

| Page | What it does |
| ---- | ------------ |
| `/account` | Overview: "Hello, Meera", orders waiting for something (to pay, waiting for our quote), the last 3 orders, and links to the sections below. |
| `/account/orders` | All orders, newest first, 10 per page. Each shows its number, date, first item (+ "and 2 more"), total and status. Filter: All · To pay · In progress · Completed · Cancelled. |
| `/account/orders/[number]` | Exists (JS2). Adds: a **timeline** (placed, quoted, paid, shipped, delivered), **Cancel order** (Q1), and "Order again", which puts the same items back in the cart. |
| `/account/addresses` | The address book (up to 10): add, edit, delete, make default. Same form as checkout (India or abroad). |
| `/account/profile` | Name, phone, company and GSTIN. The email is shown but can't be changed here (it would need email verification). |
| `/account/password` | Change the password (current one + new one twice). Other devices are signed out; this one stays signed in. "Sign out everywhere" button. |

- **Header account menu:** My account, My orders, Cart, Sign out.
- **On phones:** the sections are a row of tabs that scrolls sideways; on wider screens, a side menu.

## Approach

- **Same pattern as JS2:**
  - server-rendered pages inside `<Suspense>`
  - server actions for every change
  - API errors shown in the shop's words
  - forms that work without JavaScript where possible
- **Cancel:** a small confirm step with an optional reason. Afterwards the page shows the new state and what happens to the money (Q1).
- **Order again:** each line is added to the cart. Lines no longer on sale are skipped and listed ("2 items added; 18 in Curly is no longer sold").
- **API** (all already there): `GET /orders`, `POST /orders/{number}/cancel`, `GET/PATCH /profile`, the `/addresses` endpoints, `POST /auth/change-password`, `POST /auth/logout-all`.
  - One small addition: `GET /orders?status=` takes several statuses (comma-separated) for the filters.

## Out of scope

- Changing the email address (needs email verification; later).
- Deleting the account: buyers ask us via the contact form (Q3).
- Invoices (PDF) and reviews.

## Verification

- **Unit tests:** order filters and wording, "order again" summary, the profile and password forms' rules.
- **Browser tests** (test API, stand-in Razorpay):
  - orders list and filters
  - cancel an unpaid order (stock comes back)
  - paid order: what Q1 says
  - order again
  - add / edit / delete / default address
  - profile change shows in the header
  - password change (old password stops working, this device stays signed in)
  - phone layout
  - the accessibility check on every page
- Existing tests keep passing: 52 unit and 31 browser.

## Open questions (recommended first)

- **Q1. Cancelling an order online.**
  - **(a) Recommended:** buyers can cancel by themselves only **before paying** (including while waiting for our shipping quote). A paid order shows "Need to change or cancel? Contact us" with the order number. Paid orders are often made to order, so you decide case by case.
  - (b) Also after paying, until we start preparing it, with an automatic refund (the API already supports this).
- **Q2. Layout of My account.**
  - **(a) Recommended:** an overview page plus separate pages for orders, addresses, profile and password, with a side menu (tabs on phones).
  - (b) One long page with all sections.
- **Q3. Deleting an account.**
  - **(a) Recommended:** not self-service for now. The profile page says "To close your account, contact us". Order records must be kept for GST anyway.
  - (b) A "Delete my account" button (personal details removed, orders kept anonymised).
