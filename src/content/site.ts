/**
 * Jana Human Hair: the business details used across the site (header,
 * footer, contact form, search engines). From janahumanhair.com, 2026-10-09.
 */
export const site = {
  name: "Jana Human Hair",
  legalName: "House of Jana Ventures Pvt. Ltd.",
  tagline: "From the heart of Midnapore to the world",
  url: "https://janahumanhair.com",
  description:
    "Jana Human Hair, a unit of House of Jana Ventures Pvt. Ltd., manufactures and exports natural human hair from West Bengal: Non-Remy double drawn, Virgin Remy single drawn, wefts, extensions and wigs.",
  email: "jweindia@gmail.com",
  phones: ["+91 80176 79521", "+91 82829 06789"],
  /** Opens a WhatsApp chat with the business. */
  whatsapp: "https://wa.me/message/5EXU5MQ2N5Y3B1",
  addresses: [
    {
      label: "Warehouse",
      lines: ["Neturia, Atattar, Math Chandipur", "Purba Midnapore, West Bengal 721633"],
    },
    {
      label: "Corporate office",
      lines: [
        "7th Floor, Auto Mall, Unit 709",
        "Action Area IID, Newtown",
        "Kolkata, West Bengal 700161",
      ],
    },
  ],
} as const;

/** The main menu. "Contact" opens the contact form (there's no Contact page). */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Community Initiatives", href: "/community-initiatives" },
] as const;

/** "+91 80176 79521" → "tel:+918017679521". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
