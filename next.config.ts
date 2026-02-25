import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: "",
  experimental: {
    optimizePackageImports: ["recharts"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;