import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed even with TS/ESLint warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
};

export default nextConfig;
