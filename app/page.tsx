import AgentsGrid from "@/components/AgentsGrid";
import CapabilityCards from "@/components/CapabilityCards";
import FinalCta from "@/components/FinalCta";
import HomeDarkFooter from "@/components/HomeDarkFooter";
import PlatformShowcase from "@/components/PlatformShowcase";
import SupplyHero from "@/components/SupplyHero";
import TrustStrip from "@/components/TrustStrip";

export default function Home() {
  return (
    <div className="bg-black">
      <SupplyHero />
      <TrustStrip />
      <PlatformShowcase />
      <CapabilityCards />
      <AgentsGrid />
      <FinalCta />
      <HomeDarkFooter />
    </div>
  );
}
