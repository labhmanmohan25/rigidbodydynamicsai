import AgentsGrid from "@/components/AgentsGrid";
import CapabilityCards from "@/components/CapabilityCards";
import FinalCta from "@/components/FinalCta";
import HomeDarkFooter from "@/components/HomeDarkFooter";
import HowItWorks from "@/components/HowItWorks";
import OutcomesStrip from "@/components/OutcomesStrip";
import PlatformShowcase from "@/components/PlatformShowcase";
import ProductSteps from "@/components/ProductSteps";
import SectionDivider from "@/components/SectionDivider";
import SupplyHero from "@/components/SupplyHero";
import TrackedHomeSection from "@/components/TrackedHomeSection";

export default function Home() {
  return (
    <div className="bg-background dark:bg-black">
      <div className="mx-3 border-x border-neutral-300/90 dark:border-white/15 sm:mx-6 lg:mx-12">
        <TrackedHomeSection sectionId="hero">
          <SupplyHero />
        </TrackedHomeSection>
        <SectionDivider />
        <TrackedHomeSection sectionId="outcomes">
          <OutcomesStrip />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="py-3 sm:py-4">
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="how_it_works">
          <HowItWorks />
        </TrackedHomeSection>
        <SectionDivider />
        <div className="py-3 sm:py-4">
          <SectionDivider />
        </div>
        <TrackedHomeSection sectionId="product_steps">
          <ProductSteps />
        </TrackedHomeSection>
        <SectionDivider />
        <TrackedHomeSection sectionId="platform">
          <PlatformShowcase />
        </TrackedHomeSection>
        <SectionDivider />
        <TrackedHomeSection sectionId="capabilities">
          <CapabilityCards />
        </TrackedHomeSection>
        <SectionDivider />
        <TrackedHomeSection sectionId="agents">
          <AgentsGrid />
        </TrackedHomeSection>
        <SectionDivider />
        <TrackedHomeSection sectionId="cta">
          <FinalCta />
        </TrackedHomeSection>
      </div>
      <TrackedHomeSection sectionId="footer">
        <HomeDarkFooter />
      </TrackedHomeSection>
    </div>
  );
}
