import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: `${process.env.DOMAIN}`,
      },
    ],
  },
};

export default nextConfig;
