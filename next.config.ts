import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep a running dev server from replacing the production build artifacts.
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",
  poweredByHeader: false,
  experimental: {
    // Reuse visited pages for the lifetime of the browser query cache.
    staleTimes: { dynamic: 300 },
  },
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
