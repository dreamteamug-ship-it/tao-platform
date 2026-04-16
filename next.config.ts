import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // turbopack moved to top-level in Next.js 16 — remove from experimental
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
};

export default nextConfig;
