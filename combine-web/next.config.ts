import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,
};

export default nextConfig;