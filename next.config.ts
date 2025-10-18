import type { NextConfig } from "next";
const API_HOST = process.env.NEXT_PROXY;

const nextConfig: NextConfig = {
  env: {
    CMU_ENTRAID_URL: process.env.CMU_ENTRAID_URL,
  },
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
