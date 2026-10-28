# Status: JS1, shop pages

Pairs with [`plan`](../plan/2026-10-27-phase-js1-shop-pages.md) and [`testing`](../testing/2026-10-27-phase-js1-shop-pages.md).

## Result

**Done (2026-10-27) on `dev-esha`. Not committed. QC pending.** `main` (live site) is untouched.

## What was built

- **Branch:**
  - `dev-esha` fast-forwarded to `main`, so the J2 work is included
  - Next.js upgraded 16.4.0 → **16.4.3**, which ends the "security upgrade" stop
- **Header "Products":**
  - a dropdown with each category and its products on sale, plus **Shop all products** and **About our range**
  - opens on click (and on hover with a mouse); closes on Escape, outside clicks and navigation
  - on phones, the menu sheet lists the shop and its categories under Products
  - the menu comes from `GET /categories`, cached about a minute
- **`/shop`:** a section per category with product cards showing photo, name, "from ₹bulk" (25+), "1–24: from ₹single", the unit, and "Sold out for now" when nothing can be ordered.
- **`/shop/[category]`:** filter chips per option (only values on sale) and "Can be ordered now" (the same variant must match), plus clear filters, the count, pages and breadcrumbs.
- **`/shop/p/[product]`:**
  - **Gallery:** a variant's own photos come first.
  - **Option pickers (radio groups):** values that exist only with other choices are dashed, and picking one moves the other choices to the nearest combination on sale. The choice is kept in the address as `?v=SKU`.
  - **Two price boxes:** 1–24 and 25+, per unit, with "Save N%". The box that applies is highlighted.
  - **Quantity box:** shows the total, which price applies, and "Add N more for the bulk price. Every Bulk hair in your order counts, whatever the texture, draw or length."
  - **Availability:** made to order (days), in stock (count), or sold out.
  - **Add to cart:** disabled, with "Online ordering opens soon".
  - **Ask for a quote:** opens the contact form with product, variant, SKU and quantity filled in.
  - **Description, facts and SKU.**
  - **Product JSON-LD:** an AggregateOffer with the low and high prices.
- **`/products`:** each range has a **Shop …** button into the matching shop page.
- **Search engines:** shop pages are `noindex` until `SHOP_INDEXING=true`, and the sitemap adds the shop only then.
- **API down:** "The shop is being updated" (with the contact form as the way to ask); the menu shows its links only.
  - Nothing on sale yet: "Our online shop opens soon".
- **Settings:** `API_URL` and `SHOP_INDEXING` (in `env.example`).

## Deviations from the plan

- **The header is wrapped in `<Suspense>`** with a logo-bar fallback. Next.js requires this once some routes depend on the address.
- **Unknown products show the site's not-found page** with status 200, not 404, because the content streams after the page starts. It's harmless while the shop is `noindex`; to revisit before launch.

## Verification

- **Checks:** `npm run check` passes: types, lint, and **31 unit tests**, including 7 new ones for variant choosing and price tiers.
- **Browser tests:** `npm run test:e2e` (new `scripts/e2e.mjs`) does the following:
  - resets `jana_test` and seeds the menu
  - prices and publishes Bulk hair through the API
  - starts the test API on 4101
  - builds the site against it
  - runs **25 Playwright tests**, all passing: 7 new shop tests and the 18 existing site tests
- **The new shop tests cover:**
  - the menu
  - cards and prices
  - filters on one variant
  - pickers, the quantity tiers (₹18,000 for 3; ₹1,30,000 for 25)
  - moving to a combination that exists
  - in-stock count
  - the quote message
  - `?v=` links
  - not-found
  - range page links
  - noindex
  - axe on all three shop pages
- **Screenshots:** the menu, a category, the product page on a computer and on a phone, all reviewed.

## Next

QC by hand, then **JB3** (cart, orders, Razorpay in the API) and **JS2** (sign-in, cart, checkout).
