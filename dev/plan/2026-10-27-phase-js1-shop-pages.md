# Plan: JS1, shop pages (Products menu, category and product pages)

**Status: Implemented (2026-10-27).** Q1 everyone sees prices; Q2 new /shop pages.

## Context

The third phase of the [shop roadmap](2026-10-27-jana-shop-roadmap.md). The API (JB1, JB2) and the admin panel (JA1) are done. Now the website shows the catalogue: the menu, category listings and product pages with both prices. The cart and checkout come in JS2. This phase only shows products and prices.

## Branch and safety

- **All work on `dev-esha`.** `main` (live janahumanhair.com) isn't touched.
- **First, bring `dev-esha` up to date:** `git merge --ff-only main`, to take the J2 commit (motions, contact form).
- **Same look:** the existing colours (#E9F1FA, #00ABE4, navy, white), fonts (Geist, Playfair Display) and simple motions.
- **Next.js upgrade:** 16.4.0 → 16.4.3, the patched version HairCraft already uses (roadmap Q7).

## Pages

| Address | What |
| ------- | ---- |
| `/shop` | All categories, each with its products on sale (cards) |
| `/shop/[category]` | One category: its product cards, with filters (e.g. Texture, Length) and "Available now" |
| `/shop/p/[product]` | The product page |
| `/products` (existing) | Kept as the "about our products" page; each section gets a **"Shop now"** button to the matching product. |

**Product card:** photo, name, unit, "from ₹Y per piece in bulk (25+)" and "₹X for 1–24".

**Product page:**
- **Gallery:** the main photo and thumbnails. When a variant with its own photo is picked, its photo shows.
- **Option pickers**, e.g. Texture, Draw, Length. Values with no variant on sale for the current choices are dimmed but can still be picked; picking one moves the other choices to the nearest combination that exists.
- **Price box:**
  - **Single price** "₹X per bundle (100 g), 1–24" and **bulk price** "₹Y per bundle (100 g), from 25", with the bulk saving shown.
  - **A quantity field** that shows the total and which price applies: "25 or more → bulk price ₹Y each". Below 25 it says "Add N more of this product (any lengths or textures) for the bulk price".
  - **Availability:** "Made to order, ships in about 14 days", "In stock (40)" or "Sold out".
- **Buttons:**
  - **Add to cart:** shown but disabled, with "Online ordering opens soon" (cart in JS2).
  - **"Ask for a quote":** opens the existing contact form, with the product and choices filled into the message.
- **Description and facts.**
- **Breadcrumbs.**

**Header "Products" menu:**
- A dropdown with the categories and their products (from `GET /categories`), laid out like the menu overview in the document. On phones it's a list in the side menu.
- If the API isn't reachable, the menu falls back to the plain "Products" link and the shop pages show a friendly "Shop is being updated" note. The rest of the site keeps working.

## Approach

- **Data:** server-side fetches from the API (`API_URL`, e.g. http://localhost:4100/api/v1) with Next's fetch cache, kept for 60 seconds, so admin changes show within a minute.
  - The site uses Cache Components (`cacheComponents`); fetches are wrapped in `"use cache"` with `cacheLife`, as the site already does for dates.
- **Photos:** from the API (local) or S3/CloudFront later. They're allowed in `next.config` `images.remotePatterns` from a configured `MEDIA_ORIGINS` list.
- **Choosing a variant:** pure rules in `src/lib/shop/variants.ts`, unit-tested: matching, dimming and the nearest combination. The choice is kept in the address (`?v=SKU`), so a link opens the same choice.
- **Price wording:** `src/lib/shop/prices.ts` holds the tier for a quantity (with the 25 from `GET /shop/rules`) and the rupee format.
- **SEO:**
  - titles and descriptions per page, Product JSON-LD (offers: lowest and highest price), sitemap entries
  - the shop pages stay `noindex` until launch, using a setting `SHOP_INDEXING` (default false)
- **Accessibility:** pickers are radio groups with labels; prices are read as text; the gallery works by keyboard; axe checks as on the other pages.

## Out of scope (later phases)

Cart, sign-in, checkout, Razorpay (JS2) and My account (JS3).

## Verification

- unit tests for the variant and price rules
- Playwright against the real API on a test database seeded with a priced product:
  - menu, category, filters, product page, picking options, quantity tier text, quote button
  - the "API down" fallback
  - axe on the new pages
  - a phone layout check
- screenshots for review

## Open questions (recommended first)

- **Q1. Who sees prices?**
  - **(a) Recommended:** everyone.
  - (b) Only signed-in buyers; others see "Sign in for prices". Typical for some B2B, but it hides prices from search engines and new buyers.
- **Q2. Shop address.**
  - **Recommended:** `/shop/...` as above, keeping today's `/products` page.
  - Alternative: turn `/products` itself into the shop.
