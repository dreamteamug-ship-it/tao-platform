import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: '.',
    },
  },
  // Ensure we allow Supabase and external images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' }
    ],
  },
};

export default nextConfig;
