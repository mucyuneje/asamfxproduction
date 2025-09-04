import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // 🚀 allow build even with ESLint errors
  },
};

export default nextConfig;
