/** The home page's text, from janahumanhair.com (2026-10-09), lightly tidied. */
/**
 * The home page's banner slides (phase J3, owner's text and photos,
 * 2026-10-30). `side` is where the words sit on a large screen: on the
 * photo's empty side (the photo goes to the other side).
 */
export interface Slide {
  title: string;
  text: string;
  image: string;
  alt: string;
  side: "left" | "right";
}

export const slides: Slide[] = [
  {
    title: "The Art of Beautiful Hair",
    text: "Experience exceptional hair quality with extensions designed for a flawless, natural-looking finish.",
    image: "/images/hero/art-of-beautiful-hair.webp",
    alt: "A woman with long, dark, glossy hair in a blue dress, looking back over her shoulder",
    side: "right",
  },
  {
    title: "More Volume. More Confidence.",
    text: "Enhance your natural beauty with premium hair extensions made for a seamless blend and beautiful transformation.",
    image: "/images/hero/more-volume.webp",
    alt: "A smiling woman with long, full, dark hair in a blue dress",
    side: "left",
  },
  {
    title: "Crafted for a Natural Finish",
    text: "Explore beautifully crafted hair extensions with realistic textures, premium quality and a seamless finish.",
    image: "/images/hero/natural-finish.webp",
    alt: "A woman running her hand through her long, dark hair",
    side: "left",
  },
  {
    title: "Experience the Beauty of Premium Hair",
    text: "Discover exceptional hair extensions that bring together natural movement, beautiful volume and uncompromising quality.",
    image: "/images/hero/premium-hair.webp",
    alt: "Three women with long, flowing dark hair in green, blue and cream dresses",
    side: "left",
  },
];


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

/** The thin line under the hero: short reasons to trust the shop (phase J3). */
export const trust = [
  { icon: "globe", text: "Shipped across India and worldwide" },
  { icon: "card", text: "UPI, cards and net banking" },
  { icon: "bank", text: "Bank transfer for bulk orders" },
  { icon: "hand", text: "Handcrafted in Midnapore" },
] as const;

/** "The Jana standard": the navy band with a short checklist. */
export const standard = {
  title: "The Jana standard",
  intro: "Natural human hair, sorted and drawn by hand, the way our family has done it for five decades.",
  points: [
    "100% natural human hair, from Non-Remy double drawn to Virgin Remy single drawn",
    "Hand-sorted and drawn by skilled artisans in Purba Midnapore",
    "Sustainable, responsible sourcing",
    "Fair wages and good working conditions for everyone involved",
    "Trusted by wig makers, extension brands and salons on four continents",
  ],
};

/** How ordering works, in four numbered steps. */
export const steps = {
  title: "How ordering works",
  intro: "Simple, whether you need one bundle or a full shipment.",
  items: [
    { title: "Choose your hair", text: "Pick the type, texture and length. Every product shows both of its prices." },
    { title: "Bulk price, automatically", text: "From a set number of pieces of one product, the lower bulk price applies on its own." },
    { title: "Pay your way", text: "Pay online with UPI, cards or net banking, or by bank transfer." },
    { title: "We ship to you", text: "Packed in Midnapore and sent to you, anywhere in India or abroad." },
  ],
};

/** The trade banner, for businesses buying in quantity. */
export const trade = {
  title: "Buying for a salon or a wig business?",
  text: "Tell us the textures, lengths, colours and quantities you need, and we'll send you a quote.",
};

/** "About Jana hair": a short explainer for customers (and search engines). */
export const explainer = {
  title: "Understanding human hair",
  parts: [
    {
      title: "Remy and Non-Remy",
      text: "Remy hair comes from a single donor, with every cuticle intact and running in one direction, so it stays smooth and tangle-free for longer. Non-Remy hair is collected from several sources and processed to align the strands: a more affordable choice with a full, polished finish.",
    },
    {
      title: "Single drawn and double drawn",
      text: "Single drawn hair keeps its natural mix of lengths, for a soft, tapered look. In double drawn hair the shorter strands are removed, so it's thick and full from root to tip.",
    },
  ],
};

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
