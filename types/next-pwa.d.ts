declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface RuntimeCachingRule {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      networkTimeoutSeconds?: number;
      cachableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }
  
  type PWAConfig = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: RuntimeCachingRule[];
    buildExcludes?: string[];
    scope?: string;
    sw?: string;
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    dynamicStartUrl?: boolean;
  };
  
  export default function withPWA(pwaConfig?: PWAConfig): 
    (nextConfig?: NextConfig) => NextConfig;
} 