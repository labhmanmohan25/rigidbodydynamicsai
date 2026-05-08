const FEATURES = [
  {
    title: "Predictive, not reactive",
    body: "Models monitor every signal — supplier delays, demand spikes, raw-material shortages — and adjust your operations before disruptions cascade.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
        <path d="M3 17l4-6 4 3 5-8 5 6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "End-to-end agents",
    body: "Purpose-built AI agents handle order processing, procurement, production planning, dispatch and credit — 24/7, with a human in the loop only for strategy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
        <path d="M10 7h4M10 17h4M7 10v4M17 10v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Any input, any channel",
    body: "WhatsApp, phone calls, Excel uploads, photos of handwritten tally sheets — we ingest every channel your distributors and salespeople actually use.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
        <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
        <circle cx="18" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Scale without headcount",
    body: "Go from ₹500cr to ₹2,000cr without adding back-office staff. New SKUs, new states, new distributors — the platform absorbs the load.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
        <path d="M4 20V8M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function WhyGrid() {
  return (
    <section className="bg-[#070707] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-300/80">
            Why us
          </p>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-white sm:text-5xl">
            Built for how Indian manufacturing actually works.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/65">
            Not another dashboard. A live operations layer that reads the
            ground truth of your supply chain and acts on it.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div
                className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(249,115,22,0.4), transparent)",
                }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-300">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-base font-normal text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
