import { FiberStage } from "@/components/motion/fiber-stage";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Strategy } from "@/components/sections/strategy";
import { QuickContact } from "@/components/sections/quick-contact";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyUs } from "@/components/sections/why-us";
import { FaqSection } from "@/components/sections/faq-section";
import { faqItems } from "@/lib/faq-data";
import Link from "next/link";

export default function Home() {
  return (
    <FiberStage>
      <div className="space-y-12">
        <Hero />
        <Manifesto />
        <Strategy />
        <div data-ambient="">
          <ServicesSection />
        </div>
        <div data-ambient="">
          <WhyUs />
        </div>
        <div data-ambient="" className="space-y-6">
          <FaqSection
            className="py-8"
            items={faqItems.slice(0, 5)}
            title="FAQ express"
            subtitle="Les réponses clés pour comprendre l’ERP PME et le SaaS Next.js clé en main."
          />
          <div className="container flex items-center justify-end">
            <Link
              href="/faqs"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Consulter toutes les FAQ
            </Link>
          </div>
        </div>
        <div data-ambient="">
          <QuickContact />
        </div>
      </div>
    </FiberStage>
  );
}
