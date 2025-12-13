import { Hero } from "@/components/sections/hero";
import { QuickContact } from "@/components/sections/quick-contact";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyUs } from "@/components/sections/why-us";

export default function Home() {
  return (
    <div className="space-y-12 bg-background">
      <Hero />
      <ServicesSection />
      <WhyUs />
      <QuickContact />
    </div>
  );
}
