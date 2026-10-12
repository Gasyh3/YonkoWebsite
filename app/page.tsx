import { FiberStage } from "@/components/motion/fiber-stage";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Expertises } from "@/components/sections/expertises/expertises";
import { Strategy } from "@/components/sections/strategy";
import { Results } from "@/components/sections/results";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyUs } from "@/components/sections/why-us";
import { FaqSection } from "@/components/sections/faq-section";
import { faqItems } from "@/lib/faq-data";
import { DottedLink } from "@/components/motion/dotted-link";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export default function Home() {
  return (
    <FiberStage>
      <div className="space-y-12">
        <Hero />
        <Manifesto />
        <Strategy />
        <Expertises />
        <Results />
        <AboutTeaser />
        <Process />
        <div data-ambient="">
          <ServicesSection />
        </div>
        <div data-ambient="">
          <WhyUs />
        </div>
        <div data-ambient="">
          <FaqSection
            className="md:pr-[calc(2.75rem+1.5rem)]"
            items={faqItems.slice(0, 5)}
            title="FAQ express"
            subtitle="Les réponses clés pour comprendre l’ERP PME et le SaaS Next.js clé en main."
          />
          <div className="container -mt-6 md:-mt-12">
            <DottedLink href="/faqs" className="text-sm text-silver">
              Consulter toutes les FAQ →
            </DottedLink>
          </div>
        </div>
        <Contact />
      </div>
    </FiberStage>
  );
}
