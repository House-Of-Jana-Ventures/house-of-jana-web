# Status: Phase J3, a simpler, calmer design

**Built 2026-10-30** on `dev-esha`, from [the plan](../plan/2026-10-30-phase-j3-redesign.md), with the owner's changes made during the build (below). Not committed or deployed yet.

## What changed

**Whole site**
- **Announcement bar** (navy) above the header: three short lines, side by side on a computer, taking turns on a phone.
- **Header:** plain white with a thin line, text links, the current page underlined in navy. "Contact us" is a text link (no bright pill). Menu: **Home · About · Products · Contact us**.
- **Products menu:** the shop only (its categories and products, and "Shop all products"). "About our range" is gone.
- **Headings:** Cormorant Garamond (thin, elegant serif) instead of Playfair Display.
- **Corners:** small (`--radius` 0.375 rem); pill buttons became small-corner buttons across the shop, cart, checkout and account pages.
- **Calmer motion:** no shine on buttons; the heading rule is a thin line.
- **New styles:** `btn-line` (thin outline button, small capitals), `btn-line-light`, `link-line` (underlined small capitals), `eyebrow`.
- **Inner page banners:** photo under an even navy shade, white text (no frosted panel).
- **Footer:** navy, four columns: Shop (the shop's own categories), Company, Help, Get in touch.
- **Contact form pop-up:** once per visit, 30 seconds after arriving, and never if the visitor already opened it or sent a message (was: at once on Home, then every 15 seconds).

**Home page**, in order: photo hero (two thin outline buttons: Shop hair, Bulk enquiry) → trust line (payment items show only while that way of paying is on) → **Shop our hair** (up to 4 real products from the shop; hidden while the shop has none) → story of Jana with the CEO's words and the numbers → navy "Jana standard" band → how ordering works (4 steps) → bulk and trade banner → testimonials → "Understanding human hair".

**Shop cards:** square photo, no box, name in the serif, 4 across on a computer. **Fix:** the small-quantity line now follows each product's own bulk minimum (e.g. "1–9" when bulk starts at 10); it always said "1–24".

## Owner's changes during the build

1. **Removed pages:** "About our range" (`/products`) and Community Initiatives. They redirect (308) to `/shop` and `/about`. Their code, the community photos and two unused quality photos were deleted.
2. **No static product sections:** the planned "Shop by type" tiles and the old "Our products" cards (Non-Remy, Virgin Remy, Weft, Extensions, Wigs) are both removed, with their content file and photos. Only real shop products appear.

3. **Quantity starts at the bulk minimum:** on a product page the quantity box opens at the product's bulk minimum (e.g. 10, so the bulk price shows first), or at the stock if that's less; "−" goes below it to the single price (`startingQuantity` in `lib/shop/prices.ts`).
4. **Shop-wide bulk default 25 → 10** (`BULK_MIN_QTY=10` in the API's `.env` and `.env.example`), so the admin price table reads "Single price (1–9)" / "Bulk price (10+)" for products without their own minimum. The admin hint no longer says "25-piece". The browser tests pin `BULK_MIN_QTY=25` in `scripts/e2e.mjs`, like the API's own tests. **Live server:** set `BULK_MIN_QTY=10` in `/srv/jana/api/.env` and restart `jana-api`.

## Photos

Existing photos only (plan question 3). `scripts/clean-photos.mjs` makes `quality/handcrafted-round.webp` (see-through corners) for the navy band.

## Checks

- `npm run typecheck`, `npm run lint`: clean
- `npm test`: 57 passed
- `npm run test:e2e`: **35 passed**, 2 skipped (the screenshot tests, which only run on request), after all the changes above
- Admin: `npm run check` (types, lint, 12 tests) passed
- Looked at in the browser on a computer. The phone layout is covered by the phone browser test (pages fit the screen, menu, form as a bottom sheet).

## Not done

- Commit and deploy to `shop.janahumanhair.com` (waiting for the owner)
- New photos
