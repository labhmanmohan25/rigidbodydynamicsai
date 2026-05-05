"use client";

import { useState } from "react";

type Card = {
  label: string;
  title: string;
  blurb: string;
  bullets: [string, string, string];
  gradient: string;
  mockup: React.ReactNode;
};

const noiseUrl =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")";

function MockPanel({
  title,
  rightTag,
  children,
}: {
  title: string;
  rightTag?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-[78%] max-w-[340px] rounded-md border border-white/10 bg-[#0a0a0a]/95 p-3.5 font-mono text-[11px] leading-[1.45] text-white/85 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="tracking-wider text-white/55">{title}</span>
        {rightTag ? (
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
            {rightTag}
          </span>
        ) : null}
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

const CARDS: Card[] = [
  {
    label: "Unified Visibility",
    title: "See your entire supply chain on one screen",
    blurb:
      "Procurement, production, warehouse, distribution and retail — live, one view. No more 9 PM phone calls. No more Monday Excel dumps.",
    bullets: [
      "Procurement, production and stock — all live",
      "Distribution and retail status by territory",
      "One unified operations layer, ERP-agnostic",
    ],
    gradient:
      "linear-gradient(135deg, #1e40af 0%, #3b82f6 30%, #38bdf8 65%, #67e8f9 100%)",
    mockup: (
      <MockPanel title="OPS_OVERVIEW" rightTag="LIVE">
        <div className="flex justify-between"><span className="text-white/55">Procurement</span><span>on track</span></div>
        <div className="flex justify-between"><span className="text-white/55">Production</span><span>3 lines</span></div>
        <div className="flex justify-between"><span className="text-white/55">Warehouse</span><span>82% util</span></div>
        <div className="flex justify-between"><span className="text-white/55">Dispatch</span><span>14 trucks</span></div>
        <div className="flex justify-between"><span className="text-white/55">Retail</span><span>+12% wk</span></div>
      </MockPanel>
    ),
  },
  {
    label: "Disruption Radar",
    title: "Know what will go wrong before it does",
    blurb:
      "Models monitor every signal in your chain — supplier slips, demand spikes, raw-material gaps — and act before disruptions cascade.",
    bullets: [
      "Supplier delays auto-route to alternates",
      "Demand sensing triggers raw-material orders",
      "Cascade prevention across nodes",
    ],
    gradient:
      "linear-gradient(135deg, #064e3b 0%, #10b981 35%, #2dd4bf 70%, #a7f3d0 100%)",
    mockup: (
      <MockPanel title="DISRUPTION_RADAR" rightTag="3 ACTIVE">
        <div className="flex items-start gap-2"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" /><span>Vendor #4 sugar — 36h delay → routed to Vendor #2</span></div>
        <div className="flex items-start gap-2"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" /><span>SKU-228 demand +18% MH → RM PO triggered</span></div>
        <div className="flex items-start gap-2"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" /><span>Forecast adjusted: +4% Q4 western region</span></div>
      </MockPanel>
    ),
  },
  {
    label: "Agent Ops",
    title: "Replace 10 admin staff with AI agents",
    blurb:
      "Order processing, procurement scheduling, production planning, dispatch — handled by purpose-built agents that work 24/7.",
    bullets: [
      "Six agents, one back-office team",
      "24/7 with human-in-the-loop on strategy",
      "15-person ops now runs with 3 supervisors",
    ],
    gradient:
      "linear-gradient(135deg, #7c2d12 0%, #ea580c 30%, #fb923c 65%, #fed7aa 100%)",
    mockup: (
      <MockPanel title="ACTIVE_AGENTS" rightTag="6 / 6">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            "Procurement",
            "Production",
            "Dispatch",
            "Scheme",
            "Credit",
            "Forecast",
          ].map((a) => (
            <div key={a} className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-1.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="truncate text-white/85">{a}</span>
            </div>
          ))}
        </div>
      </MockPanel>
    ),
  },
  {
    label: "Field Signal",
    title: "Measure scheme impact in hours, not weeks",
    blurb:
      "Salespeople send WhatsApp, voice, photos, Excel. We ingest every channel and pinpoint retailer response — same day.",
    bullets: [
      "WhatsApp, voice, photo and Excel ingestion",
      "Retailer response by territory and SKU",
      "Launch at 9 AM, see uptake by 5 PM",
    ],
    gradient:
      "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 30%, #ec4899 65%, #fbcfe8 100%)",
    mockup: (
      <MockPanel title="SCHEME_S-12" rightTag="1,284 RESP">
        <div className="flex justify-between"><span className="text-white/55">WhatsApp</span><span>642</span></div>
        <div className="flex justify-between"><span className="text-white/55">Voice notes</span><span>318</span></div>
        <div className="flex justify-between"><span className="text-white/55">Photos / OCR</span><span>205</span></div>
        <div className="flex justify-between"><span className="text-white/55">Excel rows</span><span>119</span></div>
        <div className="mt-1 flex justify-between border-t border-white/10 pt-1.5"><span className="text-white/55">Uptake</span><span>41%</span></div>
      </MockPanel>
    ),
  },
  {
    label: "Credit Control",
    title: "Stop chasing payments manually",
    blurb:
      "Outstanding, credit limits and payment behavior — tracked automatically across every distributor and retailer.",
    bullets: [
      "Auto-flag overdue accounts",
      "Enforce limits on new orders",
      "Clear cash-flow exposure, real time",
    ],
    gradient:
      "linear-gradient(135deg, #082f49 0%, #0284c7 30%, #22d3ee 65%, #ecfeff 100%)",
    mockup: (
      <MockPanel title="LEDGER_LIVE" rightTag="₹284 L">
        <div className="flex justify-between"><span className="text-white/55">D-087 Coimbatore</span><span>overdue 12d</span></div>
        <div className="flex justify-between"><span className="text-white/55">D-142 Pune</span><span>at limit</span></div>
        <div className="flex justify-between"><span className="text-white/55">D-031 Indore</span><span>cleared</span></div>
        <div className="flex justify-between"><span className="text-white/55">D-204 Surat</span><span>paid 3.2L</span></div>
      </MockPanel>
    ),
  },
  {
    label: "Scale Without Bloat",
    title: "Scale ₹500 cr to ₹2,000 cr without back-office bloat",
    blurb:
      "Add SKUs, states and distributors without new hires. Your back-office becomes the competitive advantage, not the bottleneck.",
    bullets: [
      "New SKUs onboard in days, not quarters",
      "Geo expansion without coordination cost",
      "Operations scale without headcount",
    ],
    gradient:
      "linear-gradient(135deg, #365314 0%, #84cc16 30%, #facc15 65%, #fef9c3 100%)",
    mockup: (
      <MockPanel title="GROWTH_TRACK" rightTag="FY24→FY27">
        <div className="grid grid-cols-12 items-end gap-1 pt-1">
          {[18, 22, 26, 30, 34, 40, 48, 56, 66, 78, 90, 100].map((h, i) => (
            <div key={i} className="rounded-sm bg-white/85" style={{ height: `${h * 0.42}px` }} />
          ))}
        </div>
        <div className="flex justify-between pt-1 text-white/55"><span>500 cr</span><span>2000 cr</span></div>
      </MockPanel>
    ),
  },
];

export default function CapabilityCards() {
  const [active, setActive] = useState(0);
  const card = CARDS[active];

  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex w-fit items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
          <span className="inline-block h-1.5 w-1.5 bg-white" />
          Why us
        </div>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
          Your operations are critical.
          <br />
          They should run that way.
        </h2>

        <div className="mt-14 overflow-hidden rounded-xl border border-white/10">
          <div className="grid lg:grid-cols-[260px_1fr]">
            {/* Tabs — horizontal scroll on mobile, vertical on desktop */}
            <div className="border-b border-white/10 bg-black lg:border-b-0 lg:border-r">
              <ul
                role="tablist"
                aria-label="Capabilities"
                className="flex overflow-x-auto lg:flex-col lg:overflow-visible"
              >
                {CARDS.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.label} className="flex-shrink-0 lg:flex-shrink lg:w-full">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActive(i)}
                        className={`group flex w-full items-center gap-3 whitespace-nowrap px-4 py-3.5 text-left transition-colors lg:whitespace-normal ${
                          isActive
                            ? "bg-white/[0.04] text-white"
                            : "text-white/55 hover:bg-white/[0.02] hover:text-white/80"
                        }`}
                      >
                        <span
                          className={`inline-flex h-6 w-7 items-center justify-center rounded font-mono text-[10.5px] tracking-wider transition-colors ${
                            isActive
                              ? "bg-white text-black"
                              : "bg-white/[0.06] text-white/55 group-hover:bg-white/10"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[13px] font-medium uppercase tracking-[0.12em]">
                          {c.label}
                        </span>
                        {/* Active rail (desktop only) */}
                        <span
                          className={`ml-auto hidden h-4 w-[2px] rounded-full transition-colors lg:block ${
                            isActive ? "bg-white" : "bg-transparent"
                          }`}
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Active panel */}
            <div className="bg-[#0a0a0a]">
              <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
                {/* Visual */}
                <div
                  key={`visual-${active}`}
                  className="relative h-72 w-full overflow-hidden md:h-full md:min-h-[460px]"
                  style={{ background: card.gradient }}
                >
                  <div
                    className="absolute inset-0 mix-blend-overlay"
                    style={{ backgroundImage: noiseUrl }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "44px 44px",
                    }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 80% at 50% 60%, transparent 35%, rgba(0,0,0,0.5) 100%)",
                    }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex animate-[fadeIn_0.4s_ease-out] items-center justify-center px-5">
                    {card.mockup}
                  </div>
                </div>

                {/* Content */}
                <div
                  key={`content-${active}`}
                  className="flex animate-[fadeIn_0.4s_ease-out] flex-col justify-center p-6 sm:p-9"
                >
                  <span className="inline-flex w-fit items-center rounded border border-white/15 bg-white/[0.04] px-2 py-1 font-mono text-[11px] tracking-wider text-white/70">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-white sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                    {card.blurb}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                    {card.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-sm leading-relaxed text-white/75"
                      >
                        <span className="mt-1.5 inline-block h-3 w-[2px] flex-shrink-0 bg-white/40" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
