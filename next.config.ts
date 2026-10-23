import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${new URL(backendUrl).origin}/api/:path*`,
      },
    ];
  },
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
