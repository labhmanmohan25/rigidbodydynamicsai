import AgentsGrid from "@/components/AgentsGrid";
import FinalCta from "@/components/FinalCta";
import HomeDarkFooter from "@/components/HomeDarkFooter";
import HowItWorks from "@/components/HowItWorks";
import LeadersCarousel from "@/components/LeadersCarousel";
import OutcomesStrip from "@/components/OutcomesStrip";
import PlatformShowcase from "@/components/PlatformShowcase";
import ProductSteps from "@/components/ProductSteps";
import SectionDivider from "@/components/SectionDivider";
import SupplyHero from "@/components/SupplyHero";
import TrackedHomeSection from "@/components/TrackedHomeSection";

export default function Home() {
  return (
    <div className="bg-background dark:bg-black">
      <div className="mx-3 border-x border-neutral-200 dark:border-white/10 sm:mx-6 lg:mx-12">
        <TrackedHomeSection sectionId="hero">
          <SupplyHero />
        </TrackedHomeSection>     
        <TrackedHomeSection sectionId="outcomes">
          <OutcomesStrip />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="pt-24 pb-12 sm:pt-32 sm:pb-16">   
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="how_it_works">
          <HowItWorks />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="py-24 sm:py-36">
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="agents">
          <AgentsGrid />
        </TrackedHomeSection>
        <div className="pt-24 pb-12 sm:pt-32 sm:pb-16">   
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="product_steps">
          <ProductSteps />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="pt-24 pb-12 sm:pt-32 sm:pb-16">   
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="platform">
          <PlatformShowcase />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="pt-24 pb-12 sm:pt-32 sm:pb-16">   
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="cta">
          <FinalCta />
        </TrackedHomeSection>
        <TrackedHomeSection sectionId="leaders_carousel">
          <LeadersCarousel />
        </TrackedHomeSection>
        <div className="py-12 sm:pt-32 sm:pb-16">   
          <SectionDivider />
        </div>
      </div>
      <TrackedHomeSection sectionId="footer">
        <HomeDarkFooter />
      </TrackedHomeSection>
    </div>
  );
}
