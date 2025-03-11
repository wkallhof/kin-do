'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function MarketingNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/90 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-lg font-bold">Kin•Do</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center space-x-6">
          <Link 
            href="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/features' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>
          <ThemeToggle />
          <Link href="/welcome">
            <Button>Try for Free</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/features" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/features' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="py-2">
              <ThemeToggle />
            </div>
            <Link href="/welcome" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Try for Free</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <span className="text-lg font-bold">Kin•Do</span>
            </Link>
            <p className="mt-2 text-muted-foreground">
              Creating meaningful family moments with AI-powered activities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kin•Do. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
} 