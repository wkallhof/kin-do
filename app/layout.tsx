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
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            {/* Background decorative icons */}
            {/* <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 text-primary/10 opacity-20 select-none pointer-events-none z-[-1]">
              <Puzzle size={180} strokeWidth={.5} className="text-primary" />
            </div>
            <div className="absolute top-0 left-0 -translate-x-1/4 translate-y-1/4 text-primary/10 opacity-20 select-none pointer-events-none z-[-1]">
              <Blocks size={160} strokeWidth={.5} className="text-primary" />
            </div> */}
            <div className="relative z-10">
              {children}
            </div>
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
