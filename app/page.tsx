import { Metadata } from "next";
import { MarketingLayout, Hero, Features, Testimonials, CTA } from "./(marketing)/components";

export const metadata: Metadata = {
  title: "Kin•Do - AI-Powered Family Activities",
  description: "Create meaningful family moments with AI-powered daily activities, personalized for your family&apos;s unique needs and interests.",
};

export default async function HomePage() {

  return (
    <MarketingLayout>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </MarketingLayout>
  );
} 