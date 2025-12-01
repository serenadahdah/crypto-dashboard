import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@gemini-wallet/core": false,
      porto: false,
    };
    return config;
  },
};

export default nextConfig;
