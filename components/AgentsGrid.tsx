const AGENTS = [
  {
    name: "Procurement Agent",
    purpose: "Auto-routes raw material orders across vendors based on price, lead time and quality history.",
    chips: ["Vendor scoring", "Auto re-order", "PO generation"],
  },
  {
    name: "Production Planner",
    purpose: "Rebalances line schedules in real time as demand and inventory shift across SKUs.",
    chips: ["MRP", "Line allocation", "Yield tracking"],
  },
  {
    name: "Dispatch Coordinator",
    purpose: "Plans truck loads, route assignments and depot transfers — and tells the warehouse team.",
    chips: ["Load planning", "Route opt.", "ETA alerts"],
  },
  {
    name: "Scheme Listener",
    purpose: "Reads WhatsApp, calls, photos and Excel from the field. Tells you what retailers actually said.",
    chips: ["WhatsApp", "Voice", "OCR"],
  },
  {
    name: "Credit Watchdog",
    purpose: "Tracks distributor outstanding, enforces limits and flags risky behavior — before sales does.",
    chips: ["Limits", "Aging", "Holds"],
  },
  {
    name: "Forecast Engine",
    purpose: "Demand sensing across regions and SKUs — pushes signals back into procurement and planning.",
    chips: ["Regional", "SKU-level", "Backtest"],
  },
];

export default function AgentsGrid() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex w-fit items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
          <span className="inline-block h-1.5 w-1.5 bg-white" />
          The agents
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Six agents.
            <br />
            One ops team that never sleeps.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Each agent owns a node of your supply chain — and they coordinate
            with each other the way your best ops people would, only faster
            and around the clock.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => (
            <div
              key={a.name}
              className="bg-[#0a0a0a] p-7 transition-colors hover:bg-[#0f0f0f]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/40">
                  /{(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
                  <span className="h-1 w-1 rounded-full bg-white/80" />
                  active
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {a.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {a.purpose}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {a.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
