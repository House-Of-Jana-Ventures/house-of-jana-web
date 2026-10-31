# Status: Phase J4, the owner's design for the home page

**Built 2026-10-31** on `dev-esha`, from an HTML design the owner pasted in chat (Tailwind, Playfair Display + Plus Jakarta Sans). Layout and look follow the design; **all content is real**: the design's placeholder phone numbers, email, addresses, company name, dollar prices, discount tiers, certifications and one invented testimonial were replaced with Jana's own details.

## Owner's decisions (2026-10-31)

| Question | Answer |
|---|---|
| Top of the home page | The design's section (words + hair-type card), replacing the photo slider |
| Claims that are true | Temple-sourced single-donor hair; custom bleaching and private labelling; quote reply within 2 hours. **Not** MSME / ISO 9001 (left out) |
| Bulk calculator | A real one: the shop's products, ₹ prices and bulk minimum |
| Header | Keep the logo image (the slim 64 px header from J3 stays) |

## What changed

- **Fonts:** Playfair Display (headings), Plus Jakarta Sans (text). Corners 8 px. Jana's colours unchanged.
- **Announcement bar:** icons on each promise, the phone number on the right.
- **Header:** menu Home · About · Products · Bulk & wholesale (`/#quick-rfq`) · Hair education (`/#hair-education`, large screens), and a navy "Request bulk quote" button (extra-large screens). The Products panel now stays inside the screen.
- **Home, in order:**
  1. **Hero:** pills, "Crafted for a Natural Finish", Explore the shop / Quick bulk enquiry, three numbers; the hair-type card with Virgin Remy / Non-Remy / Raw Temple tabs (owner's photos, true descriptions, no prices).
  2. **Shop our hair:** real products (hidden while none).
  3. **How ordering works:** four steps and the **bulk price estimator** (single price below a product's bulk minimum, bulk price from it; "from" prices).
  4. **Heritage:** navy band, team photo with the founders, the story, the CEO's words, the Jana standard, 50+ / 4.
  5. **Understanding human hair:** Remy vs Non-Remy, single vs double drawn, thickness bars.
  6. **Bulk & trade desk:** the quote form, sent through the contact form's action (same checks and inbox); the choices are written into the message (`lib/rfq.ts`).
  7. **What our customers say:** three cards (Mei Ling, Emily Roberts, Sophia Klein) and a line of promises.
  8. **Floating quote bar** (computers): phone and "Request a quote".
- **Footer:** logo, description and true badges; Shop (the shop's categories), Company, Help, Get in touch.
- **Removed:** the photo slider and its slide texts, the J3 welcome / standard / steps / trade / explainer / trust strip, and the testimonials carousel.

## Checks

- `npm run typecheck`, `npm run lint`: clean
- `npm test`: 59 passed (new: the quote message)
- `npm run test:e2e`: 37 passed, 2 skipped (screenshot tests). New tests: the hair-type tabs, the bulk price estimator, the quote form (checks, sends, thanks), the three review cards
- Full-page screenshots at 1440 px and 390 px checked; the hair-type card fixed for 360 px phones

## Not done

- Push and deploy (waiting for the owner)
- The design's search box, currency switch (the shop is in ₹ only) and "Download spec sheet (PDF)" (no PDF exists) were left out

## About page (2026-10-31, same day)

The owner pasted a second design, for the About page, and asked to make it simpler. Built in the same style with real content only: a navy opening with four true facts (5 decades, 4 continents, temple hair, made in Midnapore), the family story with the founders and the mission, what we do (five cards), the CEO's words, the warehouse and corporate office, and an invitation to work with us (real phone and email, confirmed promises).

Left out of the design as unverified or invented: "Est. 1974", "38+ nations", "100% Remy", "0% acid bath", named temples, the 1974–2026 timeline, ISO / MSME / export-unit badges, three named artisans and their quotes, a founders' quote, factory size and capacity figures, the comparison with "industrial hair", a Debra address and a placeholder phone and email. Any of these can be added once the owner confirms the facts.

Checks: types, lint; `npm run test:e2e` 38 passed (including the accessibility check on /about); screenshots at 1440 px and 390 px.
