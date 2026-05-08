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

export default function Home() {
  return (
    <div className="bg-background dark:bg-black">
      <div className="mx-3 border-x border-neutral-200/90 dark:border-white/10 sm:mx-6 lg:mx-12">
        <SupplyHero />
        <SectionDivider />
        <OutcomesStrip />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <ProductSteps />
        <SectionDivider />
        <PlatformShowcase />
        <SectionDivider />
        <CapabilityCards />
        <SectionDivider />
        <AgentsGrid />
        <SectionDivider />
        <FinalCta />
      </div>
      <HomeDarkFooter />
    </div>
  );
}
