import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  cacheLife: {
    page: {
      stale: 3600, // 1 hour
      revalidate: 3600,
      expire: 3600,
    }
  },
  devIndicators: {
    buildActivity: false,
  } as any,
  transpilePackages: ["@prisma/client"],
};

export default nextConfig;
