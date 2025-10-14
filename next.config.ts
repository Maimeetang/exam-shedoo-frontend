import type { NextConfig } from "next";
const API_HOST = process.env.NEXT_PROXY;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_HOST}/:path*`,
      },
    ];
  },
};

export default nextConfig;
