import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
