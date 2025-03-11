import './globals.css';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to initialize theme preferences before page renders to avoid flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Check for vibrant mode preference
                const vibrantMode = localStorage.getItem('kindo-vibrant-mode');
                if (vibrantMode === 'true') {
                  document.documentElement.classList.add('theme-vibrant');
                } else if (vibrantMode === 'false') {
                  document.documentElement.classList.remove('theme-vibrant');
                } else {
                  // Default to vibrant mode for new users
                  document.documentElement.classList.add('theme-vibrant');
                }
              } catch (e) {
                // If localStorage is not available, default to vibrant mode
                document.documentElement.classList.add('theme-vibrant');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
