import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  turbopack: {},
};

export default nextConfig;
