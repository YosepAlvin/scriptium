import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
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
  turbopack: {
    root: 'C:/Users/Admin/Documents/trae_projects/Scriptum',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  devIndicators: {
    buildActivity: false,
  } as any,
};

export default nextConfig;
