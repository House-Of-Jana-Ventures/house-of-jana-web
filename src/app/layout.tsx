import type { Metadata, Viewport } from "next";
import { Alexandria, Geist, Lora } from "next/font/google";
import { Suspense } from "react";
import { ContactProvider } from "@/components/contact/contact-context";
import { ContactWidget } from "@/components/contact/contact-widget";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { Footer } from "@/components/site/footer";
import { HeaderFallback, SiteHeader } from "@/components/site/site-header";
import { site } from "@/content/site";
// Redaction 10 (page titles) is self-hosted from @fontsource; the others come from Google Fonts.
import "@fontsource/redaction-10/latin-400.css";
import "@fontsource/redaction-10/latin-700.css";
import "./globals.css";

/**
 * The owner's font mix (2026-11): Redaction 10 for page titles, Lora for
 * section headings and quotes, Geist for reading text, and Alexandria for
 * buttons, menus and small labels.
 */
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const serif = Lora({ variable: "--font-lora", subsets: ["latin"], style: ["normal", "italic"] });
const label = Alexandria({ variable: "--font-alexandria", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Jana Human Hair | Natural Human Hair Manufacturer & Exporter, India",
    template: "%s | Jana Human Hair",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    locale: "en_IN",
    type: "website",
    images: [{ url: "/images/banners/home.webp", width: 1366, height: 768, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#e9f1fa" };

/** The business, for search engines. */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/images/logo.png`,
  description: site.description,
  email: site.email,
  telephone: site.phones[0],
  address: {
    "@type": "PostalAddress",
    streetAddress: "7th Floor, Auto Mall, Unit 709, Action Area IID, Newtown",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700161",
    addressCountry: "IN",
  },
  contactPoint: site.phones.map((phone) => ({
    "@type": "ContactPoint",
    telephone: phone,
    email: site.email,
    contactType: "sales",
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable} ${label.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Without JavaScript, nothing waits for an animation to appear. */}
        <noscript>
          <style>{`[data-reveal]{visibility:visible!important;opacity:1!important;transform:none!important}.blur-text span{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, String.fromCharCode(92) + "u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-jh-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ContactProvider>
          <AnnouncementBar />
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeader />
          </Suspense>
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
            {children}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <ContactWidget />
          </Suspense>
        </ContactProvider>
      </body>
    </html>
  );
}
