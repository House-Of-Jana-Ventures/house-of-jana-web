# Jana Human Hair website

The new website for **Jana Human Hair**, a unit of House of Jana Ventures Pvt. Ltd., replacing the WordPress site at janahumanhair.com. Built with Next.js 16, Tailwind CSS 4, shadcn/ui and React Bits.

**Status:** phase J1 built (all four pages, the contact button and form, search-engine basics). Plan, status and QC guide: [`dev/`](dev/).

## Getting started

```bash
npm install
cp env.example .env.local   # Windows: copy env.example .env.local
npm run dev                 # http://localhost:3000
```

## Settings (`.env.local`)

| Setting              | Meaning                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `GMAIL_USER`         | The Gmail account that sends the contact-form emails. `jweindia@gmail.com`.                                   |
| `GMAIL_APP_PASSWORD` | A Google app password for that account. Without it, development only logs enquiries; production refuses. |
| `CONTACT_TO`         | Where enquiries go. Default `jweindia@gmail.com`.                                                             |

## Scripts

| Command            | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Development server                               |
| `npm run build`    | Production build                                 |
| `npm run check`    | Typecheck, lint and unit tests                   |
| `npm test`         | Unit tests (Vitest)                              |
| `npm run test:e2e` | Production build, then browser tests (Playwright, with an accessibility scan) |

## How it's put together

- **Pages** (`src/app/`): Home, About, Products, Community Initiatives. There's no Contact page: the round button at the bottom right of every page (and every "Contact us" link) opens a small contact form. Old WordPress addresses redirect (`next.config.ts`); `/contact` opens the form.
- **Text** lives in `src/content/` (one file per page, plus `site.ts` for the contact details), so wording changes don't touch the layout.
- **Contact form:**
  - `src/components/contact/` (button, panel, form)
  - `src/app/actions/contact.ts` (a server action that checks the message and sends it from Gmail)
  - `src/lib/contact-email.ts` (the two emails: the enquiry with all the details to you, and a thank-you with a copy to the visitor)
  - `src/lib/contact-rules.ts` (the checks, shared with the form)
  - spam protection: a hidden field bots fill in, and a limit of 5 messages per visitor in 10 minutes
- **Colours** (`src/app/globals.css`): light blue `#E9F1FA`, bright blue `#00ABE4` and white, with navy `#0B2545` for text and `#006A96` for links and small labels (bright blue is too light for small text).
- **Animations:** React Bits (`src/components/reactbits/`) for the hero heading, scroll fade-ins and counting numbers; Motion for the testimonials. All switch off for visitors who prefer reduced motion, and the content still shows without JavaScript.
- **Images** (`public/images/`): from the old site, converted to WebP and resized.
