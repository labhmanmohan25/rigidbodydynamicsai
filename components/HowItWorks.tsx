"use client";

import Image from "next/image";

/** Clears fixed `LandingHeader` (top offset + bar + inset) — keep in sync with header layout */
const SECTION_STYLE = {
  ["--how-header-clearance" as string]: "max(6rem, calc(env(safe-area-inset-top, 0px) + 5.25rem))",
} as React.CSSProperties;

const FEATURE_ICONS = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className="h-5 w-5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className="h-5 w-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="3.29 7 12 12 20.71 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="22" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className="h-5 w-5">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 18h2M17 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-2.457-3.074a1 1 0 0 0-.78-.391H14" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
  ),
} satisfies Record<string, React.ReactNode>;

const FEATURES = [
  {
    icon: FEATURE_ICONS.chat,
    title: "Orders from the field",
    description:
      "WhatsApp voice notes and mixed-language messages become confirmed orders — SKU-matched and logged without retyping.",
  },
  {
    icon: FEATURE_ICONS.box,
    title: "Parsed and pushed into your stack",
    description:
      "Inventory checked, orders created, confirmations sent back on chat. Works with how your team already works.",
  },
  {
    icon: FEATURE_ICONS.pulse,
    title: "Demand-aware procurement",
    description:
      "Agents spot pattern shifts early and draft purchase flows before shelves or lines go dry.",
  },
  {
    icon: FEATURE_ICONS.truck,
    title: "Production and dispatch aligned",
    description:
      "Schedules and loads rebalance to meet spikes. Your ops team gets clear updates without chasing status.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={SECTION_STYLE}
      className="scroll-mt-[var(--how-header-clearance)] bg-black text-white"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:min-h-[calc(100svh-var(--how-header-clearance))]">
        <div className="relative aspect-[5/4] w-full min-h-[200px] max-h-[42svh] sm:aspect-[4/3] sm:max-h-[44svh] lg:max-h-none lg:min-h-0 lg:aspect-auto">
          <Image
            src="/fmcg.jpeg"
            alt="FMCG warehouse and distribution — stacked cartons and supply operations"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-col justify-center bg-black px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-3xl lg:mx-0">
            <div className="flex w-fit items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
              <span className="inline-block h-1.5 w-1.5 shrink-0 bg-white" aria-hidden />
              How it works
            </div>

            <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              We plug into what you already do —
              <br />
              no new tools, no migration.
            </h2>


            <ul className="mt-10 space-y-0 sm:mt-12">
              {FEATURES.map((feature, i) => (
                <li
                  key={feature.title}
                  className={`flex gap-4 py-6 sm:gap-5 sm:py-7 ${i > 0 ? "border-t border-white/10" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.035] text-white/85">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
