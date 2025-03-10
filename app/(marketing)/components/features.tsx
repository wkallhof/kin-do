import { Calendar, Clock, Heart, Shield } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-background rounded-lg border shadow-sm">
      <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Families Love Kin•Do</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform makes family time more meaningful with personalized activities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            icon={<Calendar className="h-6 w-6" />}
            title="Personalized Activities"
            description="Activities tailored to your family&apos;s ages, interests, and available time."
          />
          <Feature
            icon={<Heart className="h-6 w-6" />}
            title="Strengthen Bonds"
            description="Create lasting memories and deeper connections with your loved ones."
          />
          <Feature
            icon={<Clock className="h-6 w-6" />}
            title="Save Time"
            description="No more searching for ideas. Get instant, relevant activity suggestions."
          />
          <Feature
            icon={<Shield className="h-6 w-6" />}
            title="Family-Friendly"
            description="All content is age-appropriate and focused on healthy development."
          />
        </div>
      </div>
    </section>
  );
} 