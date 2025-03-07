import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Suppress punycode warning
process.env.NODE_NO_WARNINGS = '1';

export default nextConfig;
