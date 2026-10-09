# Plan: Phase J1, the Jana Human Hair website in Next.js

**Status: Approved (2026-10-09)** with all the recommended options: Resend to shirsha@janahumanhair.com; deep navy text and a deeper blue for links; fix the slips; 50+ years and 4 continents; Vercel at launch; build in house-of-jana-web; remove the footer credit.

## Context

**The site today:** janahumanhair.com is a WordPress (Elementor) site for **Jana Human Hair**, a unit of House of Jana Ventures Pvt. Ltd.: a B2B manufacturer and exporter of human hair from Purba Midnapore, West Bengal.

**What the owner asked for:**

- rebuild it in **Next.js with Tailwind CSS, shadcn/ui and React Bits**
- colours: light blue `#E9F1FA`, bright blue `#00ABE4` and white
- simple, with small animations and a smooth feel
- **no Contact page:** instead, a round button at the bottom right of every page opens a small contact form

**Where it's built:** in `Documents/house-of-jana-web`, the Next.js 16 project created on 2026-10-09 (Tailwind 4, shadcn/ui "base-nova", lucide icons; GitHub `House-Of-Jana-Ventures/house-of-jana-web`, one commit). Open question 6.

**Content taken from the current site** (all six real pages read on 2026-10-09):

| Page                  | Content                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                  | "From the heart of Midnapore to the world"; the CEO's quote (Sritanu Jana); the story (founded nearly five decades ago by Shri Bishnupada Jana and Smt Manimala Jana; exporting to 4 continents); four products; why choose us; five testimonials |
| About                 | Our mission; our team (artisans of Medinipur); what we do (domestic and B2B export; China, Africa, Europe, America); sourcing, supply chain, compliance                                                                          |
| Products              | Non-Remy double drawn, Virgin Remy single drawn, weft, extensions, wigs (each with three points); our commitment to quality (handcrafted excellence, tradition and beauty, custom fitting)                                       |
| Community Initiatives | The Wings of Hope Charitable Trust partnership; the livelihoods project for displaced people in Manipur; 13 photos of handcrafted products; "Join us" link                                                                       |
| Contact               | form: Name, Email, Phone, Company, Query (all required)                                                                                                                                                                          |
| Footer                | email `shirsha@janahumanhair.com`; phones +91 80176 79521 and +91 82829 06789; warehouse (Neturia, Atattar, Math Chandipur, Purba Midnapore 721633) and corporate office (Unit 709, Auto Mall, Action Area IID, Newtown, Kolkata 700161) |

**Small slips on the current site,** which the new one fixes:

- **a repeated paragraph** on the home page ("We are committed to sustainable…" appears twice)
- **"Exc ellence"**
- **wigs** described as "human or synthetic hair" in one place, against "natural human hair" everywhere else (the new site says human hair)
- **a stray second "Name" field** on the contact form
- **the copyright year** says 2025

**Not carried over:**

- 12 empty posts with random names (`0xf8d554fb` …) and their tags, which look like leftover test or junk posts
- "Hello world"
- the Elementor header and footer pages
- the separate Contact and Thank-you pages (the popup form replaces them)

## Scope

**In scope**, as small steps:

1. **J1.1 Foundation:**
   - **the colour theme in shadcn's variables:** light blue `#E9F1FA` page background, white cards, bright blue `#00ABE4` for accents and buttons, and a deep navy for text (open question 2)
   - **fonts:** a refined serif for headings (e.g. Cormorant or Playfair) and a clean sans for text
   - **layout:** a header with the logo and menu (a slide-out menu on phones), and a footer with the contact details
   - **tidy-up:** remove the stray `cn` package (shadcn's `cn` helper is already in `src/lib/utils.ts`)
2. **J1.2 Home:**
   - a hero with "From the heart of Midnapore to the world" (animated word by word)
   - **numbers that count up:** 50 years, 4 continents (open question 4)
   - the CEO's quote with his photo
   - the story
   - the four product types as cards
   - "Why we're a preferred choice"
   - the testimonials as a gently moving carousel
3. **J1.3 About:** mission (as a large quote), our team, and what we do (domestic and export, sourcing, supply chain, compliance), as short illustrated sections.
4. **J1.4 Products:**
   - the five product types, each with a photo, a description and its three points (with ticks)
   - "Our commitment to quality" (three cards)
   - an "Enquire about this" button on each product, which opens the contact form with the product filled in
5. **J1.5 Community Initiatives:** the Wings of Hope partnership, the livelihoods project, a gallery of the 13 handcrafted products (tap to view large), and "Join us".
6. **J1.6 The contact button and form:**
   - **the button:** round, bright blue, with a message icon, fixed at the bottom right of every page
   - **the form:** a small panel (on phones, a sheet from the bottom) with Name, Email, Phone, Company and Message
     - checked as people type, with clear messages
     - spam protection (a hidden field and a per-visitor limit)
     - "Thank you, we'll be in touch shortly" when sent
   - **delivery:** messages go to `shirsha@janahumanhair.com` (open question 1)
   - **menus:** the "Contact" items in the header and footer open the same form
   - **old addresses:** `/contact` and `/thankyou` redirect to the home page, with the form opening for `/contact`
7. **J1.7 Animations (React Bits)**, small and purposeful:
   - the hero heading (blur/split text)
   - sections fading up as they scroll in
   - the counting numbers
   - the testimonial carousel
   - a soft hover on cards

   **All of them turn off for people who ask for reduced motion.**
8. **J1.8 Search engines and sharing:**
   - titles and descriptions per page
   - business details for Google (manufacturer, address, phones)
   - a sitemap and robots.txt
   - a share image
   - redirects from old WordPress addresses
9. **J1.9 Images:**
   - the site's photos and logo copied from WordPress into the project
   - served as modern formats (WebP/AVIF), sized for phones
10. **J1.10 Checks:**
    - build, lint
    - Playwright tests: every page, the form (valid, invalid, sent), phones, keyboard
    - an accessibility scan
    - screenshots reviewed on a computer and a phone

**Out of scope:**

- hosting and moving the domain from WordPress (a launch step after this, open question 5)
- a blog
- prices, a shop or a cart (it stays an enquiry site, as now)
- other languages

## Design

- **Colours:**
  - **page background:** light blue `#E9F1FA`
  - **cards and the header:** white
  - **buttons and accents:** bright blue `#00ABE4`
  - **text:** deep navy `#0B2545`
  - **links and small blue text:** a deeper blue `#0077A8`

  White text on `#00ABE4` is too faint for small text (2.6:1), so buttons use navy text on bright blue, or white on the deeper blue. Open question 2.
- **Feel:** airy, with generous white space, rounded cards, soft shadows, and photos of the hair and the craftspeople.
  - **Motion:** short (0.3–0.6 s) and smooth, never blocking reading.
- **The contact button:** 56 px, bright blue with a soft white ring and a chat icon. On a computer, "Contact us" appears beside it on hover. The panel opens with a gentle slide and fade, closes with Escape or ×, and keeps focus inside while open.
- **Phones first:** every section is laid out for a phone, then widened.

## Files

```
src/app/layout.tsx, globals.css               theme, fonts, header, footer, contact button
src/app/page.tsx, about/, products/, community-initiatives/
src/components/site/…                         header, footer, mobile menu, section, product card, testimonial carousel
src/components/contact/…                      contact button, contact form (shadcn: dialog/sheet, input, textarea, button, sonner)
src/components/reactbits/…                    the React Bits pieces used (copied in, as React Bits intends)
src/app/actions/contact.ts                    sends the message (server action)
src/content/…                                 the site's text, in one place per page
public/images/…                               photos and logo from the current site
next.config.ts                                image formats; redirects from old addresses
tests/e2e/…                                   Playwright
dev/plan, dev/status, dev/testing             this plan, then the status and a QC guide
```

## Testing

1. **Build and lint** clean.
2. **Playwright:**
   - every page loads with its content and one main heading
   - menus work on a computer and a phone
   - **the contact form:** opens from the button and from "Contact"; refuses empty or invalid fields with clear messages; sends (to a test inbox, never the real one); shows the thank-you; closes with Escape
   - "Enquire about this" fills in the product
   - old addresses redirect
   - no sideways scrolling on phones
   - reduced motion switches animations off
   - the axe-core accessibility scan passes
3. **By eye:** every page on a computer and a phone, and the form open, sent and with errors.

## Risks

- **Emails landing in spam:** the sending service needs the domain's DNS records (SPF/DKIM), which the launch checklist covers.
- **Animations slowing phones:** React Bits pieces are chosen light (no 3D or WebGL backgrounds), loaded only where used, and switched off for reduced motion.
- **Image quality:** some current images are design exports ("Untitled design…"). They're reused as they are; better photos can replace them later.

## Open questions

1. **How the form's messages reach you.** Recommended: **a Next.js server action that emails `shirsha@janahumanhair.com` through Resend** (free for up to 3,000 emails a month). It needs a Resend account and two DNS records on janahumanhair.com, which I'll list for you. Alternatives:
   - your existing email account's SMTP (needs an app password)
   - a form service like Web3Forms (no server code, but messages pass through a third party)
2. **Text colour.** Recommended: **deep navy `#0B2545` for text, and a deeper blue `#0077A8` for links,** alongside your three colours, so everything is easy to read. The alternative is near-black text.
3. **The current site's slips.** Recommended: **fix them** (the repeated paragraph, "Exc ellence", "human or synthetic", the stray form field, the copyright year). The alternative is copying the text exactly as it is.
4. **The numbers on the home page.** Recommended: **"50+ years" and "4 continents"** (both from your text). If you'd like others (tonnes exported, artisans, countries), send them.
5. **Hosting at launch.** Recommended: **Vercel** (made by Next.js's authors; the Pro plan is needed for a business site), with the domain pointed there when you're happy. The alternative is your current host, if it runs Node.js.
6. **Where to build.** Recommended: **the `house-of-jana-web` project you created today** (already set up with Next.js, Tailwind and shadcn/ui). The alternative is a new folder and repository.
7. **The footer credit** "Maintained with ❤️ by Blueprint Infoserve." Recommended: **remove it.** The alternative is keeping it.
