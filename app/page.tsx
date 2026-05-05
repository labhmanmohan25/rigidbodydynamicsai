import AgentsGrid from "@/components/AgentsGrid";
import CapabilityCards from "@/components/CapabilityCards";
import FinalCta from "@/components/FinalCta";
import HomeDarkFooter from "@/components/HomeDarkFooter";
import HowItWorks from "@/components/HowItWorks";
import OutcomesStrip from "@/components/OutcomesStrip";
import PlatformShowcase from "@/components/PlatformShowcase";
import SupplyHero from "@/components/SupplyHero";

export default function Home() {
  return (
    <div className="bg-black">
      <SupplyHero />
      <OutcomesStrip />
      <HowItWorks />
      <PlatformShowcase />
      <CapabilityCards />
      <AgentsGrid />
      <FinalCta />
      <HomeDarkFooter />
    </div>
  );
}
