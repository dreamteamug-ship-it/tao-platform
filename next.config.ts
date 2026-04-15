import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'rwcbioegrnmhhbmfiutx.supabase.co' },
    ],
  },
  turbopack: {},
};

export default nextConfig;
