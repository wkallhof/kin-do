import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline', // if you want to fallback to a custom page rather than /_offline
  },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  sw: '/sw.js',
})({
  /* config options here */
  experimental: {
    // Turbopack configuration
    turbo: {
      rules: {
        // Include known directories that should be processed
        include: ['app/**/*', 'components/**/*', 'lib/**/*', 'types/**/*'],
      },
    },
  },
});

// Suppress punycode warning
process.env.NODE_NO_WARNINGS = '1';

export default nextConfig;
