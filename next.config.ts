import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PROXY
          ? `${process.env.NEXT_PROXY}/:path*`
          : "http://localhost:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
