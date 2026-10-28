# Plan: Jana online shop (backend, admin panel, storefront)

**Status: Approved (2026-10-27).** Each phase below gets its own plan, status and testing docs, with a review stop after each.

**Owner answers (2026-10-27):** Q1 (a) same product counts together; Q3 India and abroad; Q5 in stock or made to order. Q2, Q4, Q6 and Q7 use the recommended defaults until the owner says otherwise.

## What the owner asked for

- **Backend:** NestJS with PostgreSQL. It follows the HairCraft backend's architecture, cut down to what Jana needs.
- **Admin panel:** a light one, in Next.js.
- **Products:** the categories and products in `Jana_Website_Product_Menu-1.docx`, each with photos.
- **Pricing:**
  - Each item has two prices.
  - **Bulk price:** applies from 25 pieces up.
  - **Single price:** applies for 1–24 pieces (owner's choice, 2026-10-27).
- **Checkout:** add to cart, then pay with Razorpay.
- **Accounts:** buyers need an account to order (owner's choice, 2026-10-27).
- **Storefront:**
  - It's built on the **`dev-esha`** branch of `house-of-jana-web`. `main` is the live janahumanhair.com and isn't touched.
  - It keeps the current colours and combinations: #E9F1FA, #00ABE4, white and navy.
  - It keeps the current fonts (Geist, Playfair Display) and the J2 motions.

## Where things live

Each folder is its own Git repo.

| Part | Folder | Stack | Dev port |
| ---- | ------ | ----- | -------- |
| Backend (API) | `Documents/house-of-jana-api` (new) | NestJS 11, TypeORM, PostgreSQL 17 (local service), Swagger | 4100 |
| Admin panel | `Documents/house-of-jana-admin` (new) | Next.js 16, Tailwind 4, shadcn (base-nova), same colours as the site | 3200 |
| Storefront | `Documents/house-of-jana-web`, branch `dev-esha` | the existing site | 3002 |

**Ports:** they avoid HairCraft's 3000, 3001 and 4200, so both projects can run side by side.

**Databases:** `jana_dev` and `jana_test`. They're separate from HairCraft's `hc_*` databases on the same Postgres service.

**GitHub:**
- The two new repos stay local until the owner creates them on GitHub, for example `House-Of-Jana-Ventures/house-of-jana-api` and `house-of-jana-admin`.
- Nothing is pushed unless the owner asks.

## The product menu (from the document)

Each item below becomes a category or a product. The options under each item become the choices a buyer picks from, and each choice has its own SKU, two prices and photos.

| Category | Products | Options |
| -------- | -------- | ------- |
| **Hair extensions** | Bulk hair | Texture: Straight, Wavy, Curly. Draw: Single drawn, Double drawn. Length: 14–40 in |
|  | K-Tip | Tip: Flat tip, I tip, U tip, Nano ring |
|  | Feather hair | Texture: Curly, Silky straight, Natural wavy |
|  | Tape-in extensions | Length: 16–30 in |
|  | Butterfly weft | Texture: Natural wavy |
| **Wefts** | Weft, Genius weft, Machine-made weft | Straight and Natural wavy: Single drawn or Double drawn. Curly: single ratio |
| **Wigs & toppers** | Wigs, Topper, Male patch | (options set by the owner in the admin panel) |
| **Hair raw material** | Raw hair | Quality: 2/2, 1/1 |

**Gaps in the document:**
- Several products have no lengths (K-Tip, feather hair, wefts, wigs). The admin panel lets the owner add lengths, or any other option, to any product.
- The document has no prices. The owner enters them in the admin panel.

**Seed:** the menu above is seeded as categories, products and option lists, with no prices or photos. Products stay hidden from the shop until they have a price and at least one photo.

## Pricing rule

- **Two prices per variant**, in INR:
  - **single price:** per piece, for 1–24 pieces
  - **bulk price:** per piece, from 25 up
- **The threshold** is a setting (`BULK_MIN_QTY`, default 25). The admin panel shows it.
- **The cart and the order** always use the price the API works out; the browser's price is never trusted.
- Each line shows which price applied. Below the threshold, it also says how many more pieces would unlock the bulk price.
- **What counts towards the 25** is open question Q1.

## Phases

Each phase stops for review, with its own plan, status and QC testing guide.

### Backend

**JB1. Foundation, accounts and roles**
- **Base:** new NestJS project with config, logging, Swagger at `/api/docs`, the error envelope with `code`, health check, security headers, rate limits and migrations.
- **Accounts:**
  - customer sign-up and sign-in with JWT and refresh tokens
  - company name and GST number are optional
  - forgot-password and email sending come in JB3 (they reuse the site's Gmail setup)
- **Admin sign-in and roles:**
  - RBAC with roles CUSTOMER, ADMIN and SUPER_ADMIN, plus permissions
  - a seeded super admin, whose password the owner sets in `.env`
- Designed as in HairCraft (guards → audience → permissions; `@RequirePermissions`).

**JB2. Catalogue, prices and photos**
- **Catalogue:** categories (two levels), products, option types and values, and variants with SKU, single price, bulk price and stock or "made to order".
- **Photos:** stored on the local disk in dev and in S3 in production (the same storage driver as HairCraft). They're resized to WebP.
- **Public endpoints:** menu tree, category listing with filters, product page.
- **Admin endpoints:** full CRUD, photo upload and reorder, and hide/show.
- **Seed:** the menu from the document.

**JB3. Cart, checkout, orders and Razorpay**
- **Cart:**
  - for signed-in buyers
  - uses the pricing rule above
  - checks stock or "made to order"
- **Addresses:** shipping and billing addresses (open question Q3).
- **Orders:** an order is created with prices fixed at that moment, numbered like `JH-100001`.
- **Razorpay:**
  - order creation, signature check on return, and a webhook
  - unpaid orders expire
  - refunds are recorded by the admin
  - test mode in dev, with a fake Razorpay in tests, as in HairCraft
- **Emails:** an order confirmation goes to the buyer and the owner, and forgot-password works.

### Admin panel (Next.js, light)

**JA1. Sign-in, catalogue and prices**
- Admin sign-in.
- Categories.
- Products:
  - options and variants
  - a price grid to set single and bulk prices for all variants at once
  - photo upload with drag to reorder
  - hide/show

**JA2. Orders, customers and dashboard**
- **Orders:** list and detail, status changes (paid → processing → shipped with tracking number → delivered, or cancelled), and recording a refund.
- **Customers:** list.
- **Admins:** a page for the super admin to add admins.
- **Dashboard:** today's and this month's orders and revenue.

The panel stays deliberately small: no coupons, reviews or charts in this version.

### Storefront (`dev-esha`)

**JS1. Shop menu and product pages**
- **Products menu:** a menu in the header, built from the API, laid out like the document's "Website menu overview".
- **Category pages:** product cards.
- **Product page:**
  - photo gallery
  - option pickers (texture, draw, length…)
  - both prices shown clearly, e.g. "₹X per piece · ₹Y per piece from 25 pcs"
  - quantity field
  - add to cart
- **Kept:** the existing pages (Home, About, Products, Community) and the contact pop-up. The current Products page links into the shop.

**JS2. Accounts, cart and checkout**
- Sign up, sign in and sign out. The session is kept in httpOnly cookies through the site's own server, as in HairCraft.
- Cart page and a cart drawer.
- Checkout:
  - choose or add an address
  - review the order
  - pay with Razorpay
  - see the order confirmation

**JS3. My account**
- My orders, with status and tracking, and paying again for an unpaid order.
- Profile and addresses.

## Order of work

1. JB1
2. JB2
3. JA1, so the owner can start entering prices and photos
4. JS1
5. JB3
6. JS2 and JS3
7. JA2

## Open questions

The recommended answer is the default if the owner agrees.

- **Q1. What counts towards the 25 pieces?**
  - **(a) Recommended:** all variants of the same product together. For example, 10 × 18 in + 15 × 22 in Straight Single Drawn = 25, so both lines get the bulk price.
  - **(b)** Each exact variant on its own.
  - **(c)** Everything in the cart.
- **Q2. Currency.**
  - **Recommended:** INR only for now. Razorpay can take international cards in INR once international payments are enabled on the Razorpay account.
  - USD prices can come later.
- **Q3. Shipping addresses.**
  - **Recommended:** India and international, since Jana exports.
  - Shipping cost is "to be confirmed" on international orders: the order is placed, and the owner adds shipping before payment.
  - Alternative: India only for now.
- **Q4. Shipping charge and GST in India.**
  - **Recommended:** settings for a flat shipping fee and GST rate, with placeholders until the owner gives the real numbers.
  - GST invoices aren't in this version.
- **Q5. Stock.**
  - **Recommended:** each variant is either "In stock (quantity)" or "Made to order" (no limit, with a lead-time note).
- **Q6. Razorpay keys.**
  - Jana needs its own Razorpay account and keys. The owner puts them in the API's `.env`, never in chat. Test keys are enough to build everything.
- **Q7. Next.js version.**
  - The site is on 16.4.0, which has a known security issue. A worktree on 16.4.2 already exists (`house-of-jana-web-next-16.4.2`).
  - **Recommended:** upgrade `dev-esha` to the patched version at the start of JS1. The new admin panel starts on the patched version.

## Not in this version

- coupons, reviews, wishlist, GST invoices, courier integration and multi-currency
- deployment (hosting can follow the HairCraft AWS setup when the owner asks)
