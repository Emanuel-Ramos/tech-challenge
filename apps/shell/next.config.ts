import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  transpilePackages: [
    "@shipay/design-system",
    "@shipay/payments-module",
    "@shipay/types",
  ],
};

export default nextConfig;
