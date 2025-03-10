'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
      <div 
        className="text-center max-w-4xl"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Family Activities Made <span className="text-primary">Thoughtful</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Create meaningful family moments with AI-powered daily activities, personalized for your family&apos;s unique needs and interests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/welcome">
            <Button size="lg" className="px-8 py-6 text-lg">
              Try for Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 