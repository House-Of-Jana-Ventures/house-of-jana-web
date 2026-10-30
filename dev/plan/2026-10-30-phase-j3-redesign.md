# Plan: Phase J3, a simpler, calmer design inspired by two reference sites

**Status: Approved (2026-10-30, "start building"), built the same day (see status).** Question 3 (photos): built with the existing photos, cleaned up (white backgrounds); new photos can replace them later.

## Context

**What the owner asked for** (2026-10-30): look at two reference sites, pick the features and design ideas that suit Jana best, and rebuild the site with them, **simple and aesthetic**, keeping **Jana's own colours**.

- **Milk & Blush** (milkandblush.com): a hair-extension shop
- **Raeya Hair** (raeyahair.com): a hair-extension rental brand

We take **ideas and patterns**, not their text, photos, logos or exact layouts. Everything stays Jana's own.

### What the two references do well

**Milk & Blush: a calm, product-first shop**

| Idea | What it looks like there |
|---|---|
| Thin **announcement bar** | One line, three short messages ("Award-winning", "10% off", "Pay later") |
| **Quiet header** | Text links on the left, logo in the middle, small text links on the right (Search, Help, Sign in, Cart) |
| **"Shop by type" tiles** | A grid of square photos of the hair on a plain light background, each with a small capital label and a thin underline |
| **Big two-up category blocks** | Large photo, light serif title, one line of text, a small underlined "SHOP NOW" |
| **Simple product cards** | Square photo, name, price (old price struck through), a small "+17 shades" note, a "SALE" tag |
| **Trade banner** | "Unlock trade discounts", for professionals |
| **Trust strip** | Payment logos under the hero |
| **Explainer text** | A short "What is Remy hair" block (helps Google too) |
| **Look** | Lots of white space, light serif headings, small-capital labels, almost square corners, hair photographed on stone/cream |

**Raeya Hair: a warm, personal brand**

| Idea | What it looks like there |
|---|---|
| **Full-width photo hero** | A real person with beautiful hair, the words on the left, two thin outline buttons |
| **Founder "Welcome" section** | Photo on the left, a few centred paragraphs, one outline button |
| **"Our standard" block** | A deep-coloured band: a short checklist of promises next to one large hair photo |
| **Numbered steps** | "A seamless 4-step experience", four short numbered steps |
| **"Work with us"** | A closing invitation for clients and professionals, with a form |
| **Look** | Elegant thin serif, thin outline buttons, soft rounded photos, a warm two-colour scheme |

### How the Jana site looks today

- A bright, busy hero: carved-wood photo, a large frosted panel, heavy serif title, two pill buttons, counters
- **The contact form opens by itself** and covers a third of the screen on the home page
- Very rounded cards (2 rem corners), soft shadows, many hover motions
- The shop shows "Our online shop opens soon" until products are added

## The idea in one line

**Milk & Blush's calm shop layout + Raeya's warm storytelling, in Jana's blues.**

## Colours (unchanged)

| Token | Colour | Use |
|---|---|---|
| `--jh-light` | `#E9F1FA` light blue | page background, soft bands |
| white | `#FFFFFF` | header, cards, product photo backgrounds |
| `--jh-bright` | `#00ABE4` bright blue | thin rules, small accents, the main button |
| `--jh-deep` | `#006A96` deeper blue | links, small blue text |
| `--jh-navy` | `#0B2545` navy | text, the announcement bar, the "Jana standard" band, footer |

Only **how much** of each colour is used changes: more white and light blue, navy for the bold bands, bright blue as a **thin accent** instead of large filled buttons.

## Scope

### J3.1 Header and announcement bar (whole site)

- **Announcement bar** (navy, white text, one line). Three short messages that fade between each other on a phone and sit side by side on a computer, for example:
  - "Natural human hair from Midnapore: five decades of craft"
  - "Bulk price from 25 pieces"
  - "We ship worldwide"
- **Quieter header** (white): logo on the left (or centred, open question 4), menu in plain text, and on the right small **Search**, **Sign in** and **Bag (count)**. The bright-blue "Contact us" pill becomes a plain text link.
- Sticky, slimmer when scrolled (as today).

### J3.2 Home page, new order

```
┌──────────────────────────────────────────────────────────┐
│ Announcement bar (navy)                                  │
│ Header (white)                                           │
├──────────────────────────────────────────────────────────┤
│ 1 HERO: full-width photo, words on the left,             │
│   two thin outline buttons: Shop hair · Bulk enquiry     │
├──────────────────────────────────────────────────────────┤
│ 2 TRUST STRIP: Worldwide shipping · Razorpay & UPI ·     │
│   Bank transfer · Made in Midnapore                      │
├──────────────────────────────────────────────────────────┤
│ 3 SHOP BY TYPE: square tiles with small capital labels   │
│   NON-REMY · VIRGIN REMY · WEFTS · EXTENSIONS · WIGS     │
├──────────────────────────────────────────────────────────┤
│ 4 BEST SELLERS: 4 simple product cards (from the shop)   │
├──────────────────────────────────────────────────────────┤
│ 5 A WORD FROM OUR CEO: photo left, centred text right,   │
│   one outline button "Our story"                         │
├──────────────────────────────────────────────────────────┤
│ 6 THE JANA STANDARD (navy band): checklist + big photo   │
├──────────────────────────────────────────────────────────┤
│ 7 HOW ORDERING WORKS: 4 numbered steps                   │
├──────────────────────────────────────────────────────────┤
│ 8 BULK & TRADE banner: "Buying 25+ pieces?"              │
├──────────────────────────────────────────────────────────┤
│ 9 WHAT OUR CUSTOMERS SAY (existing testimonials, calmer) │
├──────────────────────────────────────────────────────────┤
│ 10 ABOUT JANA HAIR (short explainer: Remy vs Non-Remy,   │
│    single vs double drawn)                               │
├──────────────────────────────────────────────────────────┤
│ Footer (navy)                                            │
└──────────────────────────────────────────────────────────┘
```

1. **Hero** (from Raeya): one full-width photo of hair, with a soft navy shade on the left so white text reads. A light serif title, one line of text, **two thin outline buttons**: "Shop hair" (to `/shop`) and "Bulk enquiry" (opens the contact form). The frosted panel and the counters go; the counters move to the CEO section.
2. **Trust strip** (from Milk & Blush): one thin light-blue line with four small icons and words.
3. **Shop by type** (from Milk & Blush): square photo tiles, **small spaced capitals with a thin underline**. Each goes to that category in the shop. Before the shop opens, each goes to the matching section of `/products`.
4. **Best sellers** (from Milk & Blush): up to 4 products from the API, as simple cards (J3.4). Hidden until the shop has products.
5. **CEO welcome** (from Raeya): Sritanu Jana's photo on the left, his words centred on the right, the two numbers (50+ years, 4 continents) under the text, one outline button "Our story" (to `/about`).
6. **The Jana standard** (from Raeya): a **navy band** with a short checklist (for example: temple hair, ethically collected; hand-sorted and drawn in Midnapore; no chemical processing; consistent thickness; exported to 4 continents) and one large hair photo. Thin outline button "Learn more".
7. **How ordering works** (from Raeya): 4 numbered steps: **Choose** your hair and length → **Bulk price** applies automatically from 25 pieces → **Pay** by Razorpay, UPI or bank transfer → **We ship** to you, in India or abroad.
8. **Bulk & trade** (from Milk & Blush's trade banner): a light band, "Buying for a salon or wig business?" with "Get a bulk quote".
9. **Testimonials:** the existing ones, as simple quote cards, no carousel motion.
10. **About Jana hair** (from Milk & Blush's explainer): two short paragraphs explaining Remy vs Non-Remy and single vs double drawn, written for customers and Google.

### J3.3 Look and feel (whole site)

- **Corners:** from 2 rem to **small** (about 6 px on cards, square photos), for a cleaner, more expensive look.
- **Buttons:** **thin outline buttons** with small spaced capitals for most actions. One **filled** bright-blue button only where it matters most (Add to bag, Checkout).
- **Links like "SHOP NOW"**: small capitals with a thin underline.
- **Headings:** a lighter, more elegant serif (open question 2). Smaller and with more space around them.
- **Shadows:** almost none. Thin light borders instead.
- **Motion:** calmer. Keep the gentle fade-in on scroll. Drop the moving strip, the button shine and the card tilts.
- **White space:** more, everywhere.

### J3.4 Shop pages

- **Product card:** square photo on white, name, "from ₹…", a small "Bulk ₹… from 25 pcs" line, and a small tag ("Best seller", "New", "Sold out"). On a computer, the second photo shows on hover.
- **Category page:** a simple title, a short line of text, a clean grid of cards (4 across on a computer, 2 on a phone).
- **Product page:** large photos on the left, details on the right. Length and texture as simple buttons, the bulk price shown clearly, one filled "Add to bag" button, and short folding sections (Details, Care, Shipping).
- **"Opens soon" box:** the same calm style.

### J3.5 The contact form

The reference sites **never open a form by themselves**. They use a "Work with us" section and a contact link. Today Jana's form opens by itself and covers part of the home page. **Open question 1.**

### J3.6 Footer

Navy, four simple columns: **Shop** (types), **Company** (About, Community), **Help** (Contact, Shipping, Returns, Terms, Privacy), **Visit** (addresses, phones, WhatsApp). Payment icons and "© House of Jana Ventures Pvt. Ltd." at the bottom.

## Not in scope

- New colours or a new logo
- A newsletter sign-up (needs an email service; can be added later)
- Product reviews, a shade-match tool or a quiz
- New photos (we use what exists; see open question 3)
- The admin panel's design

## Files

```
src/app/globals.css                       corners, buttons, type scale (colours unchanged)
src/app/layout.tsx                        fonts (if changed), announcement bar
src/app/page.tsx                          the new home order
src/components/site/                      header, announcement bar, footer, section
src/components/home/                      hero, trust strip, shop-by-type, CEO, standard, steps, trade, explainer
src/components/shop/                      product card, category and product pages
src/components/contact/                   auto-open rules (open question 1)
src/content/home.ts                       new texts (standard, steps, trust, explainer)
```

## Testing

- `npm run check` (types, lint, unit tests) and the browser tests (`npm run test:e2e`), updated for the new layout
- Accessibility check (axe) on every page; text contrast stays at least 4.5:1
- Phone (390 px), tablet and computer widths, checked in the browser
- Lighthouse on the home page: no worse than today
- Then deployed to `shop.janahumanhair.com` for the owner to review

## Risks

- **Photos make or break this style.** Both references use calm, professional hair photos on plain backgrounds. With busy or dark photos, the simple layout looks empty.
- **Less colour on buttons** can make actions less obvious. The one filled button per page and the underlined links keep the main action clear.

## Open questions

**Owner's answers (2026-10-30):** 1 → **once per visit, after 30 seconds** (no longer every 15 s); 2 → **Cormorant Garamond**, a thin elegant serif; 4 → **logo on the left**, as today; 5 → **small, clean corners**. Question 3 (photos) is still open.

1. **Contact form popping up:** stop it opening by itself (recommended, like both references; it stays one click away in the header, the floating button and the "Bulk enquiry" buttons), or keep it, but less often (once per visit, after 30 s)?
2. **Heading font:** keep **Playfair Display** but lighter, or switch to a thinner elegant serif like **Cormorant Garamond** (closer to both references)?
3. **Photos:** do you have (or can you take) **square photos of each hair type on a plain white or light background**, plus **one wide photo of a model's hair** for the hero? If not, I'll use the best existing photos.
4. **Logo position:** **left** (as today) or **centred** like Milk & Blush?
5. **Corners:** small and clean (recommended), or keep them rounded as today?
