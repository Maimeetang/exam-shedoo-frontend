import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  publicRuntimeConfig: {
    CMU_ENTRAID_URL: process.env.CMU_ENTRAID_URL,
  },
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
