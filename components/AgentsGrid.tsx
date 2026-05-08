const AGENTS = [
  {
    name: "Procurement Agent",
    purpose:
      "Detects when you're running low, picks the best vendor, and places the order - before your warehouse calls to complain.",
    chips: ["Auto re-order", "Vendor scoring", "PO generation"],
  },
  {
    name: "Production Planner",
    purpose:
      "Shifts your line schedules when demand changes - so you're making what's selling, not what sold last month.",
    chips: ["Real-time MRP", "Line rebalancing", "Yield tracking"],
  },
  {
    name: "Dispatch Coordinator",
    purpose:
      "Fills trucks, assigns routes, and WhatsApps your warehouse team the loading plan. No phone calls needed.",
    chips: ["Load planning", "Route optimization", "WhatsApp alerts"],
  },
  {
    name: "Field Listener",
    purpose:
      "Reads every WhatsApp message, voice note, and photo from your sales team - and turns it into structured data you can act on.",
    chips: ["WhatsApp", "Voice", "Photo OCR", "Hindi-English"],
  },
  {
    name: "Credit Watchdog",
    purpose:
      "Catches distributors going over limit and holds their next order - before your accounts team even knows there's a problem.",
    chips: ["Auto-holds", "Aging alerts", "Limit enforcement"],
  },
  {
    name: "Forecast Engine",
    purpose:
      "Learns demand patterns from every WhatsApp order - and tells procurement and production what's coming next week.",
    chips: ["Regional sensing", "SKU-level", "Feeds procurement"],
  },
];

export default function AgentsGrid() {
  return (
    <section className="bg-background pb-16 pt-8 dark:bg-black sm:pb-24 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-6">
          <h2 className="max-w-3xl text-3xl font-normal leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl md:text-6xl dark:text-white">
            One ops team that never sleeps.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/55">
            Each agent owns a piece of your supply chain. They coordinate with
            each other the way your best ops people would - only faster, around
            the clock, and they never forget.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-neutral-200/90 bg-neutral-200/60 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => (
            <div
              key={a.name}
              className="bg-background p-5 transition-colors hover:bg-card dark:bg-[#0a0a0a] dark:hover:bg-[#0f0f0f] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500 dark:text-white/40">
                  /{(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-neutral-300/90 bg-neutral-100/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70">
                  <span className="h-1 w-1 rounded-full bg-green-600 dark:bg-green-400" />
                  active
                </span>
              </div>
              <h3 className="mt-5 text-lg font-normal text-neutral-950 dark:text-white">
                {a.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/55">
                {a.purpose}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {a.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70"
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
