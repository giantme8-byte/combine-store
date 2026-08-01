import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],

    formats: [
      "image/avif",
      "image/webp",
    ],

    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;