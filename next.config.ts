import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ optional, but recommended for catching React issues
  eslint: {
    ignoreDuringBuilds: true, // 🚀 allows build even if ESLint errors exist
  },
  swcMinify: true, // ✅ optional, faster minification
};

export default nextConfig;
