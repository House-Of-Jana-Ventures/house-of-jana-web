/**
 * The home page's text (phase J4, from the owner's design, 2026-10-31).
 * Real facts only: the story, CEO's words and testimonials are from
 * janahumanhair.com (2026-10-09); the claims were confirmed by the owner.
 */

/** The opening: words on the left, the hair-type card on the right. */
export const hero = {
  pills: ["Shipped across India & worldwide", "Handcrafted in Midnapore, West Bengal"],
  title: "Crafted for a Natural Finish",
  text: "Explore beautifully crafted hair extensions with realistic textures, premium quality and a seamless finish. Temple-sourced, and drawn by hand across five decades of family craft.",
  metrics: [
    { value: "100%", label: "Natural human hair" },
    { value: "50+", label: "Years of craftsmanship" },
    { value: "4 continents", label: "Direct export" },
  ],
};

/** The hair-type card's tabs: what each kind of hair is, with one of the owner's photos. */
export const specimens = [
  {
    key: "remy",
    tab: "Virgin Remy",
    title: "Virgin Remy Single Drawn",
    subtitle: "Single donor · cuticles intact, one direction",
    image: "/images/hero/more-volume.webp",
    alt: "A woman with long, full, dark hair",
    specs: [
      ["Donor", "Single donor"],
      ["Cuticles", "Intact, one direction"],
      ["Ends", "Natural taper"],
      ["Feel", "Smooth, tangle-free"],
    ],
  },
  {
    key: "nonremy",
    tab: "Non-Remy",
    title: "Non-Remy Double Drawn",
    subtitle: "Several sources · full from root to tip",
    image: "/images/hero/natural-finish.webp",
    alt: "A woman running her hand through her long, dark hair",
    specs: [
      ["Donor", "Several sources"],
      ["Strands", "Aligned in processing"],
      ["Ends", "Full, root to tip"],
      ["Value", "Most affordable"],
    ],
  },
  {
    key: "temple",
    tab: "Raw Temple",
    title: "Raw Temple Hair",
    subtitle: "Temple-sourced · single donor",
    image: "/images/hero/art-of-beautiful-hair.webp",
    alt: "A woman with long, dark, glossy hair, looking back over her shoulder",
    specs: [
      ["Source", "Temple, single donor"],
      ["Hair", "As collected (raw)"],
      ["Colouring", "Bleaching on request"],
      ["For", "Wig and extension makers"],
    ],
  },
] as const;

export const stats = [
  { value: 50, suffix: "+", label: "years of craftsmanship" },
  { value: 4, suffix: "", label: "continents we export to" },
];

export const ceo = {
  quote:
    "Choose us not just for our products, but for a connection to a timeless tradition that honours beauty, craftsmanship, and you.",
  name: "Sritanu Jana",
  role: "CEO, Jana Human Hair, a unit of House of Jana Ventures Pvt. Ltd.",
};

export const story = {
  title: "Story of Jana Human Hair",
  paragraphs: [
    "Jana Human Hair, a unit of House of Jana Ventures Pvt. Ltd., is based in a quaint village in the Midnapore district of West Bengal. The business began nearly five decades ago, on a very humble note, to make ends meet for a small family led by Shri Bishnupada Jana, his wife Smt Manimala Jana, and their two children.",
    "That humble beginning is now one of the most prominent names in the human hair industry in eastern India. We are a leading manufacturer and supplier of natural human hair raw material, double drawn and single drawn, for fashion products such as wigs and extensions, and we export to customers across four continents and beyond.",
    "We are committed to sustainable and responsible sourcing. We work closely with local communities to ensure fair wages and good working conditions for everyone involved, and we invest in programmes that support education and healthcare in the surrounding areas.",
    "We take pride in being one of India's leading exporters of human hair, and we are dedicated to keeping our reputation for excellence in quality and service. With our experience and our commitment to ethical practice, we are confident our products will exceed your expectations.",
  ],
};

/** "The Jana standard": the checklist in the heritage band. */
export const standard = [
  "100% natural human hair, from Non-Remy to Virgin Remy",
  "Hand-sorted and drawn by skilled Purba Midnapore artisans",
  "Temple-sourced, single-donor hair, responsibly collected",
  "Fair wages and good working conditions for everyone",
];

export const steps = {
  title: "How ordering works",
  intro: "Simple and direct from our workshop, whether you need one bundle or a full shipment.",
  items: [
    { title: "Choose your hair", text: "Pick the type, texture and length. Every product shows both its single price and its bulk price." },
    { title: "Bulk price, automatically", text: "From a set number of pieces of one product, the lower bulk price applies on its own, with no haggling." },
    { title: "Pay your way", text: "Pay online with UPI, cards or net banking, or by bank transfer for bulk orders." },
    { title: "We ship to you", text: "Checked and packed in Purba Midnapore, and sent to you anywhere in India or abroad." },
  ],
};

/** "Understanding human hair": the two comparisons. */
export const education = [
  {
    eyebrow: "Classification 01",
    title: "Remy vs. Non-Remy",
    items: [
      {
        name: "Remy human hair",
        badge: "Premium grade",
        text: "Remy hair comes from a single donor, with every cuticle intact and running in one direction, so it stays smooth and tangle-free for longer.",
        points: ["Cuticles in one direction", "Less tangling"],
      },
      {
        name: "Non-Remy human hair",
        badge: "Value grade",
        text: "Non-Remy hair is collected from several sources and processed to align the strands: a more affordable choice with a full, polished finish.",
        points: ["Aligned in processing", "Affordable volume"],
      },
    ],
  },
  {
    eyebrow: "Classification 02",
    title: "Single vs. Double Drawn",
    items: [
      {
        name: "Single drawn hair",
        badge: "Natural taper",
        text: "Single drawn hair keeps its natural mix of lengths, for a soft, tapered look like hair as it grows.",
        bar: "tapered",
      },
      {
        name: "Double drawn hair",
        badge: "Full root to tip",
        text: "In double drawn hair our artisans remove the shorter strands by hand, so the bundle is thick and full from root to tip.",
        bar: "full",
      },
    ],
  },
] as const;

/** The bulk quote form's choices and promises (confirmed by the owner). */
export const rfq = {
  textures: ["Straight", "Wavy", "Curly", "Raw (as collected)", "Bleached / coloured"],
  lengths: ["Up to 16 in", "18 – 24 in", "26 in and longer", "Mixed lengths"],
  quantities: ["Samples (a few pieces)", "Small lot (10 – 50 pieces)", "Salon or wholesale (50 – 250 pieces)", "Importer (250+ pieces)"],
  benefits: [
    "Custom bleaching and colouring on request (e.g. 613 blonde)",
    "Private labelling and branded wraps for your business",
    "Single prices and bulk prices on every product",
    "Shipped across India and worldwide",
  ],
  response: "Quote reply within 2 hours",
};

/** The short line of promises under the testimonials. */
export const trustBadges = [
  "Temple-sourced, single-donor hair",
  "Fair wages and good working conditions",
  "Handcrafted in Purba Midnapore",
];

export const testimonials = [
  {
    quote:
      "I have ordered every month for over five years from Jana Human Hair. They always do a great job with customer service and with making the products. I look forward to many more years of working with them.",
    name: "Mei Ling",
    place: "",
    image: "/images/people/mei-ling.webp",
  },
  {
    quote:
      "Jana Human Hair offers exceptional quality at a great value. The extensions hold curls beautifully and stay smooth even after many washes. Genuine, trustworthy service: a perfect choice for premium human hair.",
    name: "Emily Roberts",
    place: "USA",
  },
  {
    quote:
      "I've ordered extensions and wigs from Jana Human Hair for over a year, and the consistency in quality is outstanding. The strands are silky, tangle-free and perfect for colouring, and their team is extremely helpful and responsive.",
    name: "Isabella Martins",
    place: "Brazil",
  },
  {
    quote:
      "As a salon owner, reliability matters most. Jana Human Hair delivers exactly what they promise: full, durable, 100% natural bundles. My customers appreciate the authenticity, and so do I. The best supplier I've worked with.",
    name: "Sophia Klein",
    place: "Germany",
  },
  {
    quote:
      "Jana Human Hair has transformed my styling business. The hair is unbelievably natural, soft and long-lasting, and my clients keep coming back for the texture and volume. International shipping was fast and hassle-free.",
    name: "Mirella Conti",
    place: "Italy",
  },
] as { quote: string; name: string; place: string; image?: string }[];
