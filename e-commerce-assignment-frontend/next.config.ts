import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
    ],
  },
  // Allow Cloudflare Tunnel for dev server Hot Module Replacement (HMR)
  allowedDevOrigins: ['specialist-gmt-italiano-cradle.trycloudflare.com'],
};

export default nextConfig;
