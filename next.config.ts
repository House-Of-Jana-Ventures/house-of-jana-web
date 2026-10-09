import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Addresses from the old WordPress site.
  async redirects() {
    return [
      // There's no Contact page: the contact form opens on the home page.
      { source: "/contact", destination: "/?contact", permanent: true },
      { source: "/thankyou", destination: "/", permanent: true },
      { source: "/hello-world", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/tag/:path*", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/elementor-hf/:path*", destination: "/", permanent: true },
      { source: "/0x:id", destination: "/", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
