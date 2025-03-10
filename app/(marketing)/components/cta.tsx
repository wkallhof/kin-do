import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Meaningful Family Moments?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join thousands of families who are strengthening their bonds with Kin•Do&apos;s personalized activity suggestions.
          </p>
          <Link href="/welcome">
            <Button size="lg" className="px-8 py-6 text-lg">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 