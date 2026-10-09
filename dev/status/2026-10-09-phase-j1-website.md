# Status: Phase J1, the Jana Human Hair website in Next.js

Tracks progress against [`plan/2026-10-09-phase-j1-website.md`](../plan/2026-10-09-phase-j1-website.md).

## 2026-10-09: implemented and verified

**Result: done** in `Documents/house-of-jana-web`. Nothing is committed, pushed or live; the WordPress site is untouched.

**Verified by:**

- **Checks:** typecheck, lint and the production build clean; every page is pre-rendered as a static page.
- **Tests:** 7 unit tests and 10 Playwright tests, all passing:
  - every page and its heading
  - the contact form (opening, checks, keeping what was typed, sending, the thank-you, Escape)
  - "Enquire about" pre-filling
  - the redirects, the gallery, the testimonials
  - reduced motion
  - phone layout and menu
  - an axe-core accessibility scan of every page and the open form
- **Screenshots reviewed** on a computer and a phone: each page, the form (empty, with problems, from a product) and the phone bottom sheet.

Approved with all the recommended options:

- Gmail (app password, via nodemailer) for messages to `jweindia@gmail.com` (the address everyone contacts), plus a thank-you email to the visitor
- navy text and a deeper blue for links
- fix the slips on the old site
- "50+ years" and "4 continents"
- Vercel at launch
- build in `house-of-jana-web`
- remove the footer credit

---

## What was built

- **Theme:**
  - light blue `#E9F1FA` background, white cards and header, bright blue `#00ABE4` buttons and accents
  - navy `#0B2545` text, deeper blue `#0077A8` links
  - Playfair Display headings, Geist text
- **Header:** the logo and menu, sticky with a soft shadow once you scroll; a slide-out menu on phones; Contact us.
- **Footer:** the email, both phone numbers (tap to call), both addresses, the menu, and "© <year> Jana Human Hair, a unit of House of Jana Ventures Pvt. Ltd.". The year updates itself.
- **Home:**
  - the hero heading appearing word by word (React Bits BlurText)
  - 50+ years and 4 continents counting up (CountUp)
  - the CEO's quote (his photo was removed at the owner's request)
  - the story beside a photo of the team
  - the five products as cards
  - why businesses choose us
  - five testimonials in a cross-fading carousel (pauses on hover, arrows and dots)
  - a closing "Looking for a reliable supplier?" with Contact us
- **About:** mission as a large quote; the team with a photo; "Here's what we do" as five cards (what we make, sourcing, export, supply chain, compliance).
- **Products:** each of the five products large, alternating sides, with its description, three ticked points and **"Enquire about …"**, which opens the form with "I'd like to know more about Weft." already written. Then "Our commitment to quality".
- **Community Initiatives:** the Wings of Hope partnership with "Join us" (opens in a new tab), the livelihoods project with its five steps, and the 12 handcrafted products in a gallery (tap for a large view, arrows or ← →).
- **The contact button and form:**
  - a round bright-blue button at the bottom right of every page, with "Contact us" on hover and a single soft pulse when the page opens
  - the form opens as a small panel above it on computers, and a sheet from the bottom on phones
  - fields: Name, Email, Phone, Company, How can we help?
  - each field is checked when you leave it, and again on the server; the visitor is taken to the first problem
  - what was typed is kept if there's a problem
  - "Thank you!" when sent
  - spam protection: a hidden field bots fill in, and 5 messages per visitor in 10 minutes
- **Moving from WordPress:**
  - `/contact` goes to the home page and opens the form
  - `/thankyou`, the junk `0x…` posts, tags, categories and authors go to the home page
  - unknown addresses get a friendly "page not found"
- **Search engines:**
  - a title and description for each page
  - the business's details for Google (name, legal name, office address, phones, email)
  - a sitemap and robots.txt
  - a share image
  - a new "JH" icon in the brand colours
- **Images:** the 29 images used, copied from the old site and converted to WebP at sensible sizes (33 MB down to 1.6 MB).
  - **Logo:** the empty space around it was trimmed, so it shows at a readable size.
  - **Story photo:** it was half photo, half grey on the old site, so it was cropped to the photo.
  - **Product and quality photos:** they are circles on dark-blue squares, so they're shown as circles only.

## Problems found and fixed

1. **Faint or missing content:**
   - **The hero heading:** React Bits' word animation used a paragraph inside the heading and hid the text until JavaScript ran. It's now a span, screen readers get the sentence once, and it shows without JavaScript.
   - **The fade-in sections:** they started invisible; a no-JavaScript style shows them.
   - **The counting numbers:** they started empty; screen readers and no-JavaScript visitors get the number.
2. **The form forgot what was typed** after the server found a problem (React resets forms after an action); it now starts again from the returned values.
3. **A state update inside an effect** (flagged by the linter) was replaced by starting each form from the server's answer.
4. **The logo was tiny** (wide empty margins in the file), so it was trimmed.
5. **The story photo** was half grey, so it was cropped.
6. **Test-only:** heading checks use the accessible name; `/contact` lands on `/?contact=`; a label that appears twice by design.

## Changed from the plan

- **`cn` stays:** it isn't a stray package but shadcn's own class-name helper (from shadcn's GitHub), used by its components.
- **Four product cards on the old home page became five** (Extensions and Wigs separately, as on the Products page).
- **Testimonials cross-fade one at a time** rather than sliding, which reads better for long quotes and suits "simple".
- **The icon is a "JH" monogram:** the logo's emblem is too small and overlaps its lettering to make a clear icon.
- **There are 12 community photos,** not 13.

## Known and accepted
- **The contact form opens by itself** 10 seconds after a visitor arrives, and again 10 seconds after every time it's closed, in its usual place (above the round button on computers, a sheet from the bottom on phones). It stops once the visitor has sent a message (for that browser tab's visit). Change the delay in `AUTO_OPEN_MS` (`src/components/contact/contact-widget.tsx`).
- **The contact form opens by itself** 10 seconds after a visitor arrives, in its usual place (above the round button on computers, a sheet from the bottom on phones). Only once per visit (browser tab): not again after it's closed, and not if the visitor already opened it. Change the delay in `AUTO_OPEN_MS` (`src/components/contact/contact-widget.tsx`).
- **Email checks:** the form explains format problems in plain words (missing @, spaces, double dots, missing ending like .com) and spots common typos (gmial.com, gmail.con, yahooo.com) with a one-click "Yes, use …" fix. Errors recheck as people type. Before sending, the server checks the domain exists and takes email (DNS mail records, 4-second limit, cached an hour). If DNS itself fails, the message goes through. Typo list: `DOMAIN_TYPOS` in `src/lib/contact-rules.ts`; domain check: `src/lib/email-domain.ts`.
- **The hidden bot trap** is fully hidden (`display: none`, field `jh_trap`), so Chrome autofill and form-filling assistants can't fill it; its earlier "Website" field was being autofilled, which silently dropped real messages. Trap hits and successful sends are now logged.
- **Email sending (Gmail).** Each enquiry sends two emails from jweindia@gmail.com (templates in `src/lib/contact-email.ts`):
  - **to you:** "New enquiry from {name}, {company}", with name, email, phone, company, the page, the time (IST), the message and a Reply button; pressing Reply answers the visitor
  - **to the visitor:** "Thank you for contacting Jana Human Hair", with a copy of what they sent and our phone numbers; replies come to you
  - If the thank-you fails, the enquiry still counts as sent and the failure is logged.
  - Settings: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (in `.env.local`, never committed; on the host's settings at launch), `CONTACT_TO`. The browser tests (`CONTACT_DRY_RUN=true`) never send.
  - Gmail allows about 500 emails a day, which is plenty here. If the site ever needs more, or emails from @janahumanhair.com, switch to a sending service.
- **The rate limit is per server** and resets on restarts. That's enough for a small site; a shared store can come later if spam appears.
- **Banner photos:** the old site's exports had a faded look baked in. Their contrast was restored (sharp), the white veils over them were removed, and the words now sit on a frosted white panel so they stay readable. Better photos can replace them any time (same file names in `public/images/banners/`).
- **The "Join us" link** is the old site's short link (`search.app/…`); a direct link to the Trust's page would be better if you have one.
- **The 12 junk posts** (`0x…`) still exist on WordPress; they disappear when the domain moves here (and their addresses redirect home).

## Not done / follow-ups

- **Launch:**
  - Vercel (Pro for a business site), with `GMAIL_USER`, `GMAIL_APP_PASSWORD` and the DNS records
  - point janahumanhair.com at it
  - check the live form
- **A Hindi or Bengali version,** if wanted.
- **Real photos** of the hair, the workshop and the team.
