# Testing: JS1, shop pages

Pairs with [`plan`](../plan/2026-10-27-phase-js1-shop-pages.md) and [`status`](../status/2026-10-27-phase-js1-shop-pages.md).

## Setup

1. Start the API on 4100 and the admin panel on 3200.
2. In the admin panel, put at least one product live (prices, description, photo, status Live), with:
   - some variants made to order
   - one from stock, with stock added
3. Start the website on 3002 from `dev-esha` (`npm.cmd run dev -- -p 3002`).

## Steps

1. **Header → Products.**
   - **Expected:** a panel with the categories and their live products, "Shop all products" and "About our range".
   - **Expected:** Escape closes it.
2. **On a phone (or a narrow window): open the menu.**
   - **Expected:** under Products, "Shop all products" and the categories.
3. **/shop**
   - **Expected:** each category with cards, each showing "from ₹…" (25+), "1–24: from ₹…" and the unit.
   - **Expected:** drafts never show.
4. **A category page: click a filter value (e.g. 18 in), then "Can be ordered now".**
   - **Expected:** only matching products, with a count.
   - **Expected:** "Clear filters" resets.
5. **A product page.**
   - **Expected:** both prices per unit, with "Save N%".
   - **Expected:** the highlighted box matches the quantity.
6. **Quantity 3.**
   - **Expected:** the total is 3 × the single price, with "Add 22 more for the bulk price…".
7. **Quantity 25.**
   - **Expected:** the total is 25 × the bulk price, with "The bulk price applies."
8. **Pick a value shown with a dashed border.**
   - **Expected:** the other choices change to a combination that exists, and the address gets `?v=SKU`.
9. **Reload the page.**
   - **Expected:** the same choice.
10. **A from-stock variant.**
    - **Expected:** "In stock (N available)". The quantity can't go above N.
11. **"Ask for a quote".**
    - **Expected:** the contact form opens with the product, variant, SKU and quantity in the message.
12. **"Add to cart".**
    - **Expected:** disabled, with "Online ordering opens soon".
13. **/products → "Shop Weft".**
    - **Expected:** opens /shop/wefts (once a weft is live).
14. **View the page source of a shop page.**
    - **Expected:** `<meta name="robots" content="noindex, follow">`.
15. **Stop the API and reload /shop** (wait a minute for the cache).
    - **Expected:** "The shop is being updated". The rest of the site works.
16. **Automated checks:** `npm.cmd run check` and `npm.cmd run test:e2e`.
    - **Expected:** 31 and 25 pass.

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| 1–2 | Menu | | |
| 3–4 | Shop and category | | |
| 5–12 | Product page | | |
| 13–15 | Links, noindex, API down | | |
| 16 | Automated checks | | |

QC sign-off: ____________________, ____ / ____ / ______
