'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
        },
        (err) => {
          console.log('Service Worker registration failed: ', err);
        }
      );
    } else if (window.location.protocol !== 'https:') {
      console.log('Service Worker registration skipped: not using HTTPS');
    } else {
      console.log('Service Worker is not supported by this browser');
    }
  }, []);

  return null;
} 