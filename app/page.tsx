import Link from "next/link";

const COMPANY_NAME = "Rigid Body Dynamics";
const TAGLINE = "Agentic systems are on the horizon, and we're building them.";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image — city skyline */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/backgroundimages/city.png')",
        }}
      />
      {/* Gradient overlay — darker at bottom, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

      {/* Company name — upper-center */}
      <div className="relative flex min-h-screen flex-col items-center justify-start px-6 pt-28 sm:pt-36">
        <h1 className="doto-title text-center text-3xl font-semibold tracking-wide text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
          {COMPANY_NAME}
        </h1>
      </div>

      {/* Bottom-left info card */}
      <div className="absolute bottom-6 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:bottom-12 sm:left-8 sm:right-auto sm:max-w-sm sm:p-6">
        <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
          Agent-as-a-Service, built for what comes next.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          We research and build the orchestration layer for agentic AI — enabling
          agent-first companies to deploy, coordinate, and scale autonomous agents
          as a service.
        </p>
        <Link
          href="/research"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition-colors group"
        >
          See our research
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
