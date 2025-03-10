import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

function Testimonial({ quote, name, role, avatar, initials }: TestimonialProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-6 italic">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Parents Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from families who have transformed their quality time with Kin•Do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial
            quote="Kin•Do has transformed our weekends. The activities are always age-appropriate and my kids absolutely love them!"
            name="Sarah Johnson"
            role="Mother of 2"
            avatar="/testimonials/avatar-1.jpg"
            initials="SJ"
          />
          <Testimonial
            quote="As a busy parent, finding quality activities was always a challenge. Kin•Do makes it effortless and the personalization is spot-on."
            name="Michael Chen"
            role="Father of 3"
            avatar="/testimonials/avatar-2.jpg"
            initials="MC"
          />
          <Testimonial
            quote="We&apos;ve tried so many family apps, but Kin•Do stands out with its thoughtful suggestions and how it brings us closer as a family."
            name="Jessica Rivera"
            role="Mother of 1"
            avatar="/testimonials/avatar-3.jpg"
            initials="JR"
          />
        </div>
      </div>
    </section>
  );
} 