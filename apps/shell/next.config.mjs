/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@shipay/design-system",
    "@shipay/payments-module",
    "@shipay/types",
  ],
};

export default nextConfig;
