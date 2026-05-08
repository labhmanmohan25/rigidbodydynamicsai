"use client";

import { useRef, useState } from "react";

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
    title: "The system acts on disruptions - not just alerts you",
    blurb:
      "Vendor delayed? Auto-routed to backup. Demand spike? Procurement triggered. Distributor over credit limit? Orders held. You get a summary, not a fire to fight.",
    bullets: [
      "Vendor delays auto-route to alternates",
      "Demand spikes trigger raw-material orders",
      "87% of disruptions resolved without human action",
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
      "Order processing, procurement scheduling, production planning, dispatch coordination - all handled by AI agents that read WhatsApp, parse Excel, and act 24/7. Your back-office team supervises instead of re-typing.",
    bullets: [
      "WhatsApp orders processed end-to-end, no human re-typing",
      "Procurement POs generated automatically from demand signals",
      "₹48-60L/year saved in admin salary alone",
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
    title: "Know what's selling at kirana stores before your distributor does",
    blurb:
      "Every WhatsApp order from a salesperson is a demand signal. We capture it, aggregate it, and push it into your procurement and production - in real time. No ERP gives you this.",
    bullets: [
      "Retail-edge demand via WhatsApp - seconds, not weeks",
      "Salesperson sends order -> system detects demand pattern",
      "Forecast improves with every message that flows through",
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
    title: "Credit limits enforced automatically - before bad debt happens",
    blurb:
      "Outstanding tracked across every distributor. Limits enforced on new orders. Risky behavior flagged before your accounts team even opens Tally.",
    bullets: [
      "Auto-flag overdue accounts",
      "New orders blocked when limit breached",
      "Clear cash-flow exposure across 100+ distributors",
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
    label: "Grow Without Hiring",
    title: "Add SKUs, states, and distributors - without new back-office hires",
    blurb:
      "Go from ₹500 Cr to ₹2,000 Cr revenue without proportional headcount. Your operations become the competitive advantage, not the bottleneck.",
    bullets: [
      "New SKUs onboard in days, not quarters",
      "New states added without coordination cost",
      "Operations scale - headcount stays flat",
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

function CapabilityCardPanel({
  card,
  visualKey,
  showIndexChip,
  layout,
}: {
  card: Card;
  visualKey: string;
  showIndexChip: boolean;
  layout: "stack" | "split";
}) {
  const stack = layout === "stack";

  return (
    <div className="bg-background dark:bg-[#0a0a0a]">
      <div
        className={
          stack
            ? "grid grid-cols-1 gap-0"
            : "grid gap-0 md:grid-cols-[1.15fr_1fr]"
        }
      >
        <div
          key={`visual-${visualKey}`}
          className={
            stack
              ? "relative h-56 w-full overflow-hidden sm:h-64"
              : "relative h-72 w-full overflow-hidden md:h-full md:min-h-[460px]"
          }
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
          <div className="absolute inset-0 flex items-center justify-center px-5">
            {card.mockup}
          </div>
        </div>

        <div
          key={`content-${visualKey}`}
          className={`flex flex-col justify-center p-6 sm:p-9 ${stack ? "animate-[fadeIn_0.4s_ease-out]" : ""}`}
        >
          {showIndexChip ? (
            <span className="inline-flex w-fit items-center rounded border border-neutral-200 bg-neutral-100/90 px-2 py-1 font-mono text-[11px] tracking-wider text-neutral-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70">
              {visualKey}
            </span>
          ) : null}
          <h3
            className={`text-xl font-semibold leading-snug text-neutral-950 sm:text-2xl dark:text-white ${showIndexChip ? "mt-4" : "mt-0"}`}
          >
            {card.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px] dark:text-white/55">
            {card.blurb}
          </p>
          <ul className="mt-6 space-y-2.5 border-t border-neutral-200 pt-5 dark:border-white/10">
            {card.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-3 text-sm leading-relaxed text-neutral-800 dark:text-white/75"
              >
                <span className="mt-1.5 inline-block h-3 w-[2px] flex-shrink-0 bg-neutral-400 dark:bg-white/40" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CapabilityCards() {
  const [active, setActive] = useState(0);
  const [slideDir, setSlideDir] = useState<"up" | "down" | null>(null);
  const prevActiveRef = useRef(0);
  const card = CARDS[active];

  function selectTab(index: number) {
    if (index === active) return;
    const prev = prevActiveRef.current;
    setSlideDir(index > prev ? "down" : "up");
    prevActiveRef.current = index;
    setActive(index);
  }

  return (
    <section className="bg-background pb-16 pt-8 dark:bg-black sm:pb-24 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="sticky top-16 z-30 -mx-1 mt-6 max-w-3xl bg-background px-1 py-3 text-3xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:bg-black sm:text-5xl md:text-6xl dark:text-white lg:static lg:top-auto lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 dark:lg:bg-transparent">
          Grow without hiring.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/55">
          Doubling orders shouldn't mean doubling headcount. Your agents absorb
          the volume - taking calls, chasing payments, and running the floor -
          so the team you have today scales with the business.
        </p>

        <div className="mt-14">
          {/* Phone / tablet: sticky scroll-stack cards */}
          <div className="px-0 pb-4 pt-5 lg:hidden">
            {CARDS.map((c, i) => {
              const stickyTop = 120 + i * 14;
              return (
                <article
                  key={c.label}
                  aria-labelledby={`cap-mobile-${i}`}
                  className="sticky mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a]"
                  style={{ top: `${stickyTop}px`, zIndex: 20 + i }}
                >
                  <div className="border-b border-neutral-200/90 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0a0a0a] sm:px-5">
                    <h3
                      id={`cap-mobile-${i}`}
                      className="text-[13px] font-medium uppercase tracking-[0.12em] text-neutral-900 dark:text-white"
                    >
                      {c.label}
                    </h3>
                  </div>
                  <CapabilityCardPanel
                    card={c}
                    visualKey={`m-${i}`}
                    showIndexChip={false}
                    layout="stack"
                  />
                </article>
              );
            })}
          </div>

          {/* Large screens: tab rail + numbered index */}
          <div className="hidden overflow-hidden rounded-xl border border-neutral-200/90 dark:border-white/10 lg:grid lg:grid-cols-[280px_1fr]">
            <div className="border-b border-neutral-200/90 bg-background lg:border-b-0 lg:border-r lg:border-neutral-200/90 dark:border-white/10 dark:bg-[#050505] dark:lg:border-white/10">
              <p className="border-b border-neutral-200/90 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:border-white/10 dark:text-white/40">
                Select a capability
              </p>
              <ul
                role="tablist"
                aria-label="Capabilities"
                className="flex flex-col"
              >
                {CARDS.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li
                      key={c.label}
                      className="border-b border-neutral-200/90 last:border-b-0 dark:border-white/10"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="capability-panel"
                        id={`cap-tab-${i}`}
                        onClick={() => selectTab(i)}
                        className={`group flex w-full cursor-pointer items-center gap-3.5 text-left transition-[background-color,border-color,box-shadow,margin,padding,border-radius] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/90 ${
                          isActive
                            ? "mx-2 my-2.5 rounded-sm border border-neutral-300 bg-white px-4 py-4 shadow-inner dark:border-white/25 dark:bg-[#12161c] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                            : "border border-transparent px-4 py-4 hover:bg-neutral-100/90 dark:hover:bg-white/[0.025]"
                        }`}
                      >
                        <span
                          className={`inline-flex h-8 w-9 flex-shrink-0 items-center justify-center font-mono text-[11px] font-semibold tabular-nums tracking-wide transition-colors ${
                            isActive
                              ? "rounded-[2px] bg-sky-600 text-white dark:bg-sky-500 dark:text-[#07090d]"
                              : "rounded-[2px] text-neutral-400 group-hover:text-neutral-700 dark:text-white/30 dark:group-hover:text-white/45"
                          }`}
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`min-w-0 flex-1 text-[12px] font-medium uppercase leading-snug tracking-[0.14em] ${
                            isActive
                              ? "text-neutral-950 dark:text-white"
                              : "text-neutral-600 group-hover:text-neutral-950 dark:text-white/75 dark:group-hover:text-white/90"
                          }`}
                        >
                          {c.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              id="capability-panel"
              role="tabpanel"
              aria-labelledby={`cap-tab-${active}`}
              className="min-h-0 overflow-hidden bg-background dark:bg-[#0a0a0a]"
            >
              <div
                key={active}
                className={
                  slideDir === "down"
                    ? "cap-slide-from-bottom"
                    : slideDir === "up"
                      ? "cap-slide-from-top"
                      : ""
                }
              >
                <CapabilityCardPanel
                  card={card}
                  visualKey={String(active + 1).padStart(2, "0")}
                  showIndexChip
                  layout="split"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
