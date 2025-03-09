import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        include: ['app/**/*', 'components/**/*', 'lib/**/*', 'types/**/*'],
      },
    },
  },
};

// Suppress punycode warning
process.env.NODE_NO_WARNINGS = '1';

export default nextConfig;
