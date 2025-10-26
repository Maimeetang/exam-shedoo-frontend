import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.DEV
          ? "http://localhost:8080/:path*"
          : "http://backend:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
