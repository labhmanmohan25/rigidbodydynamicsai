"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import TrackedFocusRegion from "@/components/TrackedFocusRegion";

/* ────────────────────────────────────────────────────────────────────────────
 *  Scroll-triggered product walkthrough — LaneSurf-inspired.
 *  • Progress ring linked to scroll position of corresponding right-side card
 *  • Outline cards (no shadows) for right-side visuals
 *  • Polished UI-mockup illustrations
 * ──────────────────────────────────────────────────────────────────────────── */

type Step = { title: string; description: string };
type Phase = {
  id: string;
  icon: React.ReactNode;
  label: string;
  heading: string;
  steps: Step[];
};

const PHASES: Phase[] = [
  {
    id: "capture",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Capture",
    heading: "Capture Orders",
    steps: [
      {
        title: "Orders arrive on WhatsApp, calls & emails",
        description:
          "Salespeople, distributors, and retailers send orders the way they always have — voice notes, typed messages, spreadsheets, even missed calls. Nothing changes for them.",
      },
      {
        title: "AI reads every format and language",
        description:
          "Hindi, Marathi, Gujarati, English — mixed in one sentence. Voice or text. Our agents parse it all into structured order data: SKU, quantity, delivery date.",
      },
    ],
  },
  {
    id: "process",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
    label: "Process",
    heading: "Process Intelligently",
    steps: [
      {
        title: "SKU matching & inventory check",
        description:
          '"50 cartons Glucose-D" becomes SKU-228, checked against live warehouse stock. Partial matches are flagged, not lost.',
      },
      {
        title: "Credit & pricing validation",
        description:
          "Distributor credit limits, territory pricing, and scheme eligibility — all verified before the order is accepted. No bad debt surprises.",
      },
    ],
  },
  {
    id: "execute",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 18h2M17 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-2.457-3.074a1 1 0 0 0-.78-.391H14" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
      </svg>
    ),
    label: "Execute",
    heading: "Execute Automatically",
    steps: [
      {
        title: "Procurement triggers fire automatically",
        description:
          "When raw-material stock dips below the safety threshold, purchase orders are drafted, vendor quotes compared, and the best option is queued for approval.",
      },
      {
        title: "Production schedules rebalance",
        description:
          "Buyer orders are confirmed, confirmations go out, stock is adjusted on the books, and manufacturing slots move to match what you actually need to make next.",
      },
      {
        title: "Delivery scheduled",
        description:
          "Freight and carrier conversations happen in the same flow as the order. Empty times, locations, and rates are extracted from calls and messages — then locked into the schedule.",
      },
    ],
  },
  {
    id: "analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
        <path d="M4 19h16" strokeLinecap="round" />
        <path d="M7 15l3-3 2 2 5-6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="15" r="1.1" />
        <circle cx="10" cy="12" r="1.1" />
        <circle cx="12" cy="14" r="1.1" />
        <circle cx="17" cy="8" r="1.1" />
      </svg>
    ),
    label: "Analytics",
    heading: "Analyze, Adapt, Forecast",
    steps: [
      {
        title: "Analyze ops",
        description:
          "Live metrics from orders, fulfillment, and production are unified into one operations view so teams can spot bottlenecks before they spread.",
      },
      {
        title: "Handle disruptions",
        description:
          "When delays, stockouts, or route exceptions appear, the platform flags impact and suggests the fastest recovery action for each affected order.",
      },
      {
        title: "Forecast demand",
        description:
          "Rolling demand signals and historical seasonality predict what to buy, make, and ship next so planning stays ahead of real-world changes.",
      },
    ],
  },
];

const ALL_STEPS: { phaseIdx: number; stepIdx: number }[] = [];
PHASES.forEach((phase, pi) =>
  phase.steps.forEach((_, si) => ALL_STEPS.push({ phaseIdx: pi, stepIdx: si })),
);

const STEP_COUNT = ALL_STEPS.length;

/* ── SVG progress ring ──────────────────────────────────────────────────── */
const CIRCUMFERENCE = 2 * Math.PI * 18;

function StepNumber({ num, progress }: { num: number; progress: number }) {
  const isActive = progress > 0;
  const offset = CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      {/* Background circle */}
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1"
          className="text-neutral-200 dark:text-white/10" />
      </svg>
      {/* Progress ring — directly driven by scroll */}
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{ willChange: "stroke-dashoffset", transition: "stroke-dashoffset 80ms linear" }}
          className={isActive ? "text-neutral-900 dark:text-white" : "text-transparent"}
        />
      </svg>
      <span className={`relative text-[13px] font-medium tabular-nums transition-colors duration-300 ${
        isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-white/30"
      }`}>
        {String(num).padStart(2, "0")}
      </span>
    </div>
  );
}

/** RBD mark on dark chips (light UI) / white chips (dark UI). */
function RbdMark({ sizePx, className = "" }: { sizePx: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <Image src="/logowhite.png" alt="" width={sizePx} height={sizePx} className="h-full w-full object-contain p-[15%] dark:hidden" />
      <Image src="/logo.png" alt="" width={sizePx} height={sizePx} className="hidden h-full w-full object-contain p-[15%] dark:block" />
    </span>
  );
}

/** RBD mark on light chips (light UI) / dark chips (dark UI). */
function RbdMarkInverted({ sizePx, className = "" }: { sizePx: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <Image src="/logo.png" alt="" width={sizePx} height={sizePx} className="h-full w-full object-contain p-[15%] dark:hidden" />
      <Image src="/logowhite.png" alt="" width={sizePx} height={sizePx} className="hidden h-full w-full object-contain p-[15%] dark:block" />
    </span>
  );
}

function LogoBadge({ size = "md", animated = false }: { size?: "sm" | "md"; animated?: boolean }) {
  const reduceMotion = useReducedMotion();
  const dim = size === "sm" ? 28 : 36;
  const shell = (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 dark:bg-white ${
        size === "sm" ? "h-7 w-7" : "h-9 w-9"
      }`}
    >
      <RbdMark sizePx={dim} />
    </div>
  );
  if (animated && !reduceMotion) {
    return (
      <motion.div
        className="inline-flex shrink-0"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {shell}
      </motion.div>
    );
  }
  return shell;
}

/* ── Right-side visuals — realistic app UIs ────────────────────────────── */

function ConnectorPill({
  children,
  borderClassName = "border-neutral-200 dark:border-white/10",
  animatedBorder = false,
}: {
  children: React.ReactNode;
  borderClassName?: string;
  animatedBorder?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  const content = (
    <div className={`inline-flex items-center gap-2 rounded-full border ${borderClassName} bg-neutral-50 px-3.5 py-1.5 dark:bg-white/5`}>
      <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 dark:bg-white">
        <RbdMark sizePx={20} />
      </div>
      <span className="text-[10px] font-semibold tracking-wide text-neutral-600 dark:text-white/70">{children}</span>
    </div>
  );

  return (
    <div className="flex justify-center py-2">
      {animatedBorder && !reduceMotion ? (
        <div className="relative inline-flex rounded-full p-[1.5px] bg-[conic-gradient(from_0deg_at_50%_50%,#fbbf24_0deg,#fde68a_80deg,#34d399_160deg,#22d3ee_240deg,#f59e0b_320deg,#fbbf24_360deg)]">
          <motion.div
            className="absolute inset-0 rounded-full blur-[3px] opacity-70"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 50% 50%, #fbbf24 0deg, #fde68a 80deg, #34d399 160deg, #22d3ee 240deg, #f59e0b 320deg, #fbbf24 360deg)",
              backgroundSize: "220% 220%",
            }}
          />
          <motion.div
            className="relative rounded-full"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 50% 50%, #fbbf24 0deg, #fde68a 80deg, #34d399 160deg, #22d3ee 240deg, #f59e0b 320deg, #fbbf24 360deg)",
              backgroundSize: "220% 220%",
            }}
          >
            <div className="rounded-full bg-white dark:bg-neutral-950">{content}</div>
          </motion.div>
        </div>
      ) : (
        content
      )}
    </div>
  );
}

function MiniSpinner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 animate-spin ${className}`} fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" className="text-neutral-200 dark:text-white/15" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-500 dark:text-white/50" />
    </svg>
  );
}

/* Waveform bars — seeded so they don't re-render */
const WAVE_HEIGHTS = [4,12,6,15,8,11,5,14,9,7,13,6,10,15,4,12,8,11,6,14,9,7,5,13,10,8,12,6];

function Waveform({ active = true }: { active?: boolean }) {
  const cls = active ? "bg-emerald-500/80" : "bg-neutral-300 dark:bg-white/20";
  return (
    <div className="flex items-center gap-[1.5px] flex-1">
      {WAVE_HEIGHTS.map((h, i) => (
        <div key={i} className={`w-[2px] rounded-full ${cls}`} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

/* ── CAPTURE VISUAL 1 — Real WhatsApp + Call + Email + Excel UIs ──────── */
function ChannelPill({ label, tone = "neutral" }: { label: string; tone?: "wa" | "voice" | "email" | "excel" | "neutral" }) {
  const palette =
    tone === "wa"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
      : tone === "voice"
        ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        : tone === "email"
          ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300"
          : tone === "excel"
            ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
            : "border-neutral-200 bg-white text-neutral-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${palette}`}>
      <span className="h-1 w-1 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

/* ── Per-channel cards (constant height each) ─────────────────────────── */
const CARD_DURATION_MS = 5200;

function WhatsAppChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => !cancelled && setStage(1), 600));
    timers.push(setTimeout(() => !cancelled && setStage(2), 1800));
    timers.push(setTimeout(() => !cancelled && setStage(3), 2900));
    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [reduceMotion]);

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-[0_14px_36px_rgba(0,0,0,0.10)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
      <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2.5">
        <svg viewBox="0 0 16 16" fill="white" className="h-3 w-3 opacity-80"><path d="M10 3L6 8l4 5" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">MD</div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white leading-tight">Mumbai Distributor</p>
          <p className="text-[9px] text-white/60 leading-tight">online</p>
        </div>
        <svg viewBox="0 0 20 20" fill="white" className="h-3.5 w-3.5 opacity-60"><path d="M15 3H5c-1.1 0-2 .9-2 2v14l4-4h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
      </div>
      <div className="bg-[#ECE5DD] dark:bg-[#0B141A] px-3 py-3 h-[200px] overflow-hidden flex flex-col justify-end gap-2">
        {stage === 0 && (
          <div className="flex justify-start">
            <div className="relative bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse [animation-delay:180ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse [animation-delay:360ms]" />
              </div>
            </div>
          </div>
        )}

        {stage >= 1 && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex justify-start"
          >
            <div className="relative bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 max-w-[88%] shadow-sm">
              <p className="text-[13px] text-neutral-800 dark:text-white/90 leading-relaxed">Bhai 50 carton Glucose-D bhejo aur 20 carton Mango Bite kal tak chahiye</p>
              <p className="text-[10px] text-neutral-400 text-right mt-1 tabular-nums">10:32 AM</p>
            </div>
          </motion.div>
        )}

        {stage === 2 && (
          <div className="flex justify-start">
            <div className="relative bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse [animation-delay:180ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 animate-pulse [animation-delay:360ms]" />
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex justify-start"
          >
            <div className="relative bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 max-w-[82%] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><polygon points="8,5 19,12 8,19" fill="#22c55e"/></svg>
                </div>
                <div className="flex items-center gap-[1px] flex-1">
                  {WAVE_HEIGHTS.slice(0, 22).map((h, i) => (
                    <div key={i} className="w-[2.5px] rounded-full bg-[#22c55e]/60" style={{ height: `${h * 0.8}px` }} />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400 tabular-nums shrink-0">0:12</span>
              </div>
              <p className="text-[10px] text-neutral-400 text-right mt-1 tabular-nums">10:33 AM</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function VoiceChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="rounded-[22px] overflow-hidden border border-neutral-200/90 dark:border-white/10 bg-[#f6f6f6] dark:bg-neutral-900 shadow-[0_16px_34px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_34px_rgba(0,0,0,0.38)]">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-[12px] font-bold text-neutral-700 dark:text-white">PW</div>
            <div>
              <p className="text-[14px] font-semibold text-neutral-800 dark:text-white leading-tight">Pune Wholesaler</p>
              <p className="text-[10px] text-neutral-500 dark:text-white/60 tabular-nums leading-tight mt-0.5">00:24</p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-500/90 px-2.5 py-1 shadow-[0_0_18px_rgba(34,197,94,0.45)]">
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-lime-200 animate-pulse" />
              <span className="text-[9px] tracking-[0.22em] font-semibold text-white">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#cf1111] flex items-center justify-center shadow-[0_6px_14px_rgba(207,17,17,0.4)]">
          <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4"><path d="M3.5 8.5c2-3.5 11-3.5 13 0l.5 2.5-3.5 1.5L12 10.5H8l-1.5 2L3 11l.5-2.5z"/></svg>
        </div>

        <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center border border-neutral-300/60 dark:border-white/15">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M7 4v12M13 4v12" stroke="currentColor" className="text-neutral-700 dark:text-white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>

        <div className="flex-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-white/10 px-3 py-2 overflow-hidden">
          <div className="flex items-center gap-[4px]">
            {WAVE_HEIGHTS.slice(0, 26).map((h, i) => (
              <motion.div
                key={i}
                className={`w-[2px] rounded-full ${i < 13 ? "bg-emerald-600/80" : "bg-neutral-500/40 dark:bg-white/25"}`}
                style={{ height: `${Math.max(4, h * 0.78)}px`, transformOrigin: "50% 100%" }}
                animate={reduceMotion ? undefined : { scaleY: [0.55, 1.05, 0.65, 1] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.95 + (i % 5) * 0.12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (i % 7) * 0.08,
                      }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const rows = [
    { initials: "NV", name: "Nashik Vendor", subject: "May Orders - 48 SKUs · orders_may.xlsx", time: "10:42" },
    { initials: "AT", name: "Akola Trader", subject: "RE: Reorder request — Glucose-D + Mango Bite", time: "10:38" },
    { initials: "SS", name: "Solapur Stockist", subject: "PO #2287 attached — please confirm", time: "10:21" },
  ];
  const [count, setCount] = useState(reduceMotion ? rows.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    rows.forEach((_, i) => {
      timers.push(setTimeout(() => !cancelled && setCount(i + 1), 350 + i * 520));
    });
    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [reduceMotion]);

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_14px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_14px_32px_rgba(0,0,0,0.36)]">
      <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-white/5 flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5"><path d="M3 5h14M3 10h14M3 15h7" stroke="#a3a3a3" strokeWidth="1.3" strokeLinecap="round"/></svg>
        <span className="text-[11px] text-neutral-500 dark:text-white/60">Inbox</span>
        <span className="ml-auto rounded-full bg-neutral-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:text-white/70 tabular-nums">{count}</span>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-white/5">
        {rows.slice(0, count).map((r, i) => (
          <motion.div
            key={r.initials}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-2.5 flex items-center gap-2.5"
          >
            <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-500 shrink-0">{r.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white truncate leading-tight">{r.name}</p>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-white/55 truncate leading-tight mt-0.5">{r.subject}</p>
            </div>
            <span className="text-[10px] text-neutral-400 tabular-nums shrink-0">{r.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExcelChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const rows = [
    { i: 1, name: "Glucose-D 200ml", qty: "50", date: "May 8" },
    { i: 2, name: "Mango Bite 5g", qty: "20", date: "May 8" },
    { i: 3, name: "Parle-G 100g", qty: "120", date: "May 9" },
    { i: 4, name: "Frooti 250ml", qty: "75", date: "May 9" },
  ];
  const [count, setCount] = useState(reduceMotion ? rows.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    rows.forEach((_, i) => {
      timers.push(setTimeout(() => !cancelled && setCount(i + 1), 280 + i * 380));
    });
    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [reduceMotion]);

  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_14px_32px_rgba(0,0,0,0.10)] dark:shadow-[0_14px_32px_rgba(0,0,0,0.36)]">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 bg-[#107C41] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-0.5">
            <Image src="/icons/excel.png" alt="" width={20} height={20} className="h-full w-full object-contain" />
          </div>
          <span className="text-[11px] font-semibold text-white">orders_may.xlsx</span>
        </div>
        <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-white">Nagpur Retailer · 32 SKUs</span>
      </div>
      <div className="grid grid-cols-[28px_1fr_56px_56px] text-[9px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-white/5">
        <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-1 text-center dark:border-white/5 dark:bg-white/[0.03]">#</span>
        <span className="border-r border-neutral-100 px-2 py-1 dark:border-white/5">SKU / Product</span>
        <span className="border-r border-neutral-100 px-2 py-1 text-right dark:border-white/5">Qty</span>
        <span className="px-2 py-1 text-right">Date</span>
      </div>
      {rows.slice(0, count).map((r) => (
        <motion.div
          key={r.i}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-[28px_1fr_56px_56px] border-b border-neutral-100 text-[11px] text-neutral-700 last:border-b-0 dark:border-white/5 dark:text-white/80"
        >
          <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-1.5 text-center font-mono text-neutral-400 dark:border-white/5 dark:bg-white/[0.03]">{r.i}</span>
          <span className="border-r border-neutral-100 px-2 py-1.5 dark:border-white/5">{r.name}</span>
          <span className="border-r border-neutral-100 px-2 py-1.5 text-right tabular-nums dark:border-white/5">{r.qty}</span>
          <span className="px-2 py-1.5 text-right tabular-nums text-neutral-500 dark:text-white/60">{r.date}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CaptureVisual1() {
  const reduceMotion = useReducedMotion();
  const channels = useMemo(
    () => [
      { key: "wa", tone: "wa" as const, label: "Incoming WhatsApp Order", Card: WhatsAppChannelCard },
      { key: "voice", tone: "voice" as const, label: "Incoming Voice Order", Card: VoiceChannelCard },
      { key: "email", tone: "email" as const, label: "Incoming Email Order", Card: EmailChannelCard },
      { key: "excel", tone: "excel" as const, label: "Incoming Excel Sheet Order", Card: ExcelChannelCard },
    ],
    [],
  );
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % channels.length;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, CARD_DURATION_MS);
    return () => clearInterval(id);
  }, [reduceMotion, channels.length]);

  const active = channels[idx];
  const ActiveCard = active.Card;

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-4">
          <h4 className="mt-1.5 text-[18px] font-medium leading-snug text-neutral-900 dark:text-white">
            Captures inbound from all sources
          </h4>
        </div>

        <div className="mb-3 flex items-center gap-1.5">
          {channels.map((c, i) => {
            const isActive = i === idx;
            const isPast = i < idx;
            return (
              <div
                key={c.key}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10"
              >
                <motion.div
                  key={`${c.key}-${cycle}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-neutral-800 dark:bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: isActive || isPast ? "100%" : "0%" }}
                  transition={{
                    duration: isActive && !reduceMotion ? CARD_DURATION_MS / 1000 : 0,
                    ease: "linear",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="relative h-[268px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 space-y-2"
            >
              <div className="flex justify-start">
                <ChannelPill tone={active.tone} label={active.label} />
              </div>
              <ActiveCard reduceMotion={!!reduceMotion} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── CAPTURE VISUAL 2 — AI parsing (our dashboard UI) ─────────────────── */
function CaptureVisual2() {
  const reduceMotion = useReducedMotion();
  const [loadedRows, setLoadedRows] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setLoadedRows(3);
      return;
    }

    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setLoadedRows(0);
        await wait(500);
        if (cancelled) break;
        setLoadedRows(1);
        await wait(450);
        if (cancelled) break;
        setLoadedRows(2);
        await wait(450);
        if (cancelled) break;
        setLoadedRows(3);
        await wait(2200);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] space-y-2.5">
        {/* Raw input — WhatsApp message snippet */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10">
          <div className="bg-[#075E54] px-4 py-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold text-white">MD</div>
            <p className="text-[11px] font-semibold text-white">Mumbai distributor</p>
          </div>
          <div className="bg-[#ECE5DD] dark:bg-[#0B141A] px-3 py-2.5">
            <div className="bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[90%]">
              <p className="text-[12px] text-neutral-700 dark:text-white/80 leading-relaxed">Bhai 50 carton Glucose-D bhejo aur 20 carton Mango Bite kal tak chahiye</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="rounded px-1.5 py-0.5 text-[8px] font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-400">HI</span>
                <span className="rounded px-1.5 py-0.5 text-[8px] font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-400">EN</span>
                <span className="ml-auto text-[10px] text-neutral-400 tabular-nums">10:32 AM</span>
              </div>
            </div>
          </div>
        </div>

        <ConnectorPill animatedBorder borderClassName="border-amber-400 dark:border-amber-300">RBD Matches with inventory</ConnectorPill>

        {/* Parsed output — our platform dashboard style */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900">
          {/* Dashboard header */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoBadge size="sm" animated />
              <div>
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">Order Parser</p>
                <p className="text-[10px] text-neutral-400">Auto-extracted from WhatsApp</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-semibold text-white tracking-wider">2 MATCHED</span>
          </div>

          {/* Structured items */}
          <div className="p-4 space-y-2">
            {[
              { sku: "SKU-228", name: "Glucose-D 200ml", qty: "50 ctns" },
              { sku: "SKU-445", name: "Mango Bite", qty: "20 ctns" },
            ].map((item, idx) => {
              const isLoaded = loadedRows > idx;
              return (
                <motion.div
                  key={item.sku}
                  className="flex min-h-[70px] items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/[0.03] px-4 py-3"
                  animate={
                    isLoaded
                      ? {
                          opacity: 1,
                          y: 0,
                        }
                      : { opacity: 0.72, y: 4 }
                  }
                  transition={{ duration: isLoaded ? 0.55 : 0.25, ease: "easeOut" }}
                >
                  {isLoaded ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-500 border border-neutral-200/60 dark:border-white/10 font-mono">{item.sku.split("-")[1]}</div>
                        <div>
                          <p className="text-[13px] font-semibold text-neutral-800 dark:text-white">{item.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-neutral-900 dark:text-white tabular-nums">{item.qty}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" fill="#22c55e"/><path d="M3 5l1.5 1.5 3-3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span className="text-[9px] text-emerald-600 font-semibold">Matched</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-200/80 dark:bg-white/10 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-24 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                          <div className="h-2 w-14 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                        <div className="h-2 w-12 rounded bg-neutral-200 dark:bg-white/10 animate-pulse ml-auto" />
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
            {/* Delivery row */}
            <motion.div
              className="flex min-h-[58px] items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/[0.03] px-4 py-3"
              animate={
                loadedRows > 2
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : { opacity: 0.72, y: 4 }
              }
              transition={{ duration: loadedRows > 2 ? 0.55 : 0.25, ease: "easeOut" }}
            >
              {loadedRows > 2 ? (
                <>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-neutral-400"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6h12" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="10" r="1" fill="currentColor"/></svg>
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">Delivery</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold text-neutral-900 dark:text-white tabular-nums">Tomorrow, May 8</p>
                    <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5 shrink-0"><circle cx="5" cy="5" r="5" fill="#22c55e"/><path d="M3 5l1.5 1.5 3-3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                    <div className="h-2.5 w-16 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                  </div>
                  <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-white/10 animate-pulse" />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROCESS VISUAL 1 — SKU grid + zoom loop + overlapping pills ──────── */
const SKU_TABLE_ROWS: { sku: string; name: string; ord: number; stock: number; tag?: "glucose" | "mango" }[] = [
  { sku: "SKU-104", name: "Mineral Pouch 1L", ord: 8, stock: 90 },
  { sku: "SKU-118", name: "Energy Bar Mix", ord: 24, stock: 156 },
  { sku: "SKU-156", name: "Lime Soda 500ml", ord: 30, stock: 210 },
  { sku: "SKU-189", name: "Orange Crush 200ml", ord: 15, stock: 88 },
  { sku: "SKU-201", name: "Choco Bar 40g", ord: 12, stock: 240 },
  { sku: "SKU-215", name: "Jeera Masala 500g", ord: 6, stock: 42 },
  { sku: "SKU-228", name: "Glucose-D 200ml", ord: 50, stock: 324, tag: "glucose" },
  { sku: "SKU-445", name: "Mango Bite", ord: 20, stock: 18, tag: "mango" },
  { sku: "SKU-467", name: "Lassi Classic 200ml", ord: 40, stock: 200 },
  { sku: "SKU-502", name: "Butter Cookie Tin", ord: 10, stock: 64 },
  { sku: "SKU-533", name: "Namkeen Mix 400g", ord: 18, stock: 55 },
  { sku: "SKU-601", name: "Rose Syrup 750ml", ord: 14, stock: 72 },
  { sku: "SKU-640", name: "Toffee Assorted 1kg", ord: 22, stock: 130 },
  { sku: "SKU-702", name: "Nimbu Pani 250ml", ord: 36, stock: 95 },
];

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function ProcessVisual1() {
  const reduceMotion = useReducedMotion();
  const [focus, setFocus] = useState<"none" | "glucose" | "mango">("none");
  const [tickGlu, setTickGlu] = useState(false);
  const [tickMan, setTickMan] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      queueMicrotask(() => {
        setTickGlu(true);
        setTickMan(true);
        setFocus("none");
      });
      return;
    }
    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setFocus("none");
        setTickGlu(false);
        setTickMan(false);
        await wait(450);
        if (cancelled) break;
        setFocus("glucose");
        await wait(850);
        if (cancelled) break;
        setTickGlu(true);
        await wait(650);
        if (cancelled) break;
        setFocus("mango");
        await wait(850);
        if (cancelled) break;
        setTickMan(true);
        await wait(650);
        if (cancelled) break;
        setFocus("none");
        await wait(550);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  const scale = focus === "none" ? (reduceMotion ? 1 : 0.9) : 1.16;
  // Move the grid upward while zoomed so focus tags land on the intended rows.
  const y = focus === "glucose" ? -48 : focus === "mango" ? -66 : 10;

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="relative w-full max-w-[440px]">
        {/* Excel source data — sits behind, peeking from top-right with partial overlap */}
        <div className="pointer-events-none absolute -right-8 -top-16 z-0 w-[230px] opacity-90 dark:opacity-70">
          <div className="rounded-xl border border-neutral-200/80 bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.30)] dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center justify-between rounded-t-xl bg-[#107C41] px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-[1px]">
                  <Image src="/icons/excel.png" alt="" width={16} height={16} className="h-full w-full object-contain" />
                </div>
                <span className="text-[9px] font-semibold text-white">distributor_orders.xlsx</span>
              </div>
              <span className="text-[7px] font-semibold uppercase tracking-wider text-white/80">Source</span>
            </div>
            <div className="grid grid-cols-[20px_1fr_36px_30px] text-[7px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-white/5">
              <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-0.5 text-center dark:border-white/5 dark:bg-white/[0.03]">#</span>
              <span className="border-r border-neutral-100 px-1 py-0.5 dark:border-white/5">Item</span>
              <span className="border-r border-neutral-100 px-1 py-0.5 text-right dark:border-white/5">Qty</span>
              <span className="px-1 py-0.5 text-right">Unit</span>
            </div>
            {[
              { i: 1, name: "Glucose-D 200ml", qty: "50", u: "ctn" },
              { i: 2, name: "Mango Bite", qty: "20", u: "ctn" },
              { i: 3, name: "Lassi 200ml", qty: "40", u: "ctn" },
              { i: 4, name: "Nimbu Pani 250ml", qty: "36", u: "ctn" },
              { i: 5, name: "Rose Syrup 750ml", qty: "14", u: "ctn" },
            ].map((r) => (
              <div key={r.i} className="grid grid-cols-[20px_1fr_36px_30px] border-b border-neutral-100 text-[8px] text-neutral-700 last:border-b-0 dark:border-white/5 dark:text-white/70">
                <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-0.5 text-center font-mono text-neutral-400 dark:border-white/5 dark:bg-white/[0.03]">{r.i}</span>
                <span className="border-r border-neutral-100 px-1 py-0.5 dark:border-white/5 truncate">{r.name}</span>
                <span className="border-r border-neutral-100 px-1 py-0.5 text-right tabular-nums dark:border-white/5">{r.qty}</span>
                <span className="px-1 py-0.5 text-right tabular-nums text-neutral-500 dark:text-white/55">{r.u}</span>
              </div>
            ))}
          </div>
          <span className="mt-1.5 ml-auto block w-fit rounded-full border border-neutral-200/70 bg-white/90 px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.14em] text-neutral-500 shadow-sm dark:border-white/10 dark:bg-neutral-900/80 dark:text-white/55">
            From your Excel
          </span>
        </div>

        <div className="relative">
          <div className="relative z-10 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LogoBadge size="sm" animated />
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">SKU Match Engine</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 px-2.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-white/40 animate-pulse" />
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-white/50">Live</span>
              </div>
            </div>

            <div className="relative h-[200px] overflow-hidden bg-neutral-50/80 dark:bg-black/20">
              <motion.div
                className="origin-top px-2 pt-1"
                animate={{ scale, y }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
              >
                <div className="grid grid-cols-[minmax(0,0.9fr)_1.1fr_0.5fr_0.55fr_0.52fr] gap-0 text-[9px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-white/10 py-1.5 px-1">
                  <span className="pl-1">SKU</span>
                  <span>Product</span>
                  <span className="text-right pr-1">Ord</span>
                  <span className="text-right pr-1">WH</span>
                  <span className="text-center">OK</span>
                </div>
                {SKU_TABLE_ROWS.map((row, i) => {
                  const isG = row.tag === "glucose";
                  const isM = row.tag === "mango";
                  const hilite = (isG && focus === "glucose") || (isM && focus === "mango");
                  const resolved = (isG && tickGlu) || (isM && tickMan);
                  const stockOk = row.stock >= row.ord;
                  return (
                    <div
                      key={row.sku}
                      className={`grid grid-cols-[minmax(0,0.9fr)_1.1fr_0.5fr_0.55fr_0.52fr] gap-0 items-center border-b border-neutral-100/90 dark:border-white/[0.06] py-1 px-1 font-mono text-[10px] ${
                        hilite ? "bg-white dark:bg-neutral-800 ring-1 ring-neutral-300 dark:ring-white/20 z-10 rounded-sm" : i % 2 === 0 ? "bg-white/60 dark:bg-white/[0.03]" : ""
                      }`}
                    >
                      <span className="text-neutral-500 dark:text-white/45 pl-1 truncate">{row.sku}</span>
                      <span className={`truncate font-sans font-medium ${isG || isM ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-white/70"}`}>{row.name}</span>
                      <span className="text-right text-neutral-700 dark:text-white/80 tabular-nums pr-1">{row.ord}</span>
                      <span className={`text-right tabular-nums pr-1 ${stockOk ? "text-neutral-600 dark:text-white/60" : "text-red-500"}`}>{row.stock}</span>
                      <span className="flex justify-center">
                        {resolved ? (
                          stockOk ? (
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                              <circle cx="6" cy="6" r="6" fill="#22c55e" />
                              <path d="M3.5 6L5 7.5 8.5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                              <circle cx="6" cy="6" r="6" fill="#ef4444" />
                              <path d="M4 4l4 4M8 4l-4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                          )
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-200 dark:bg-white/15" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type RowStatus = "pending" | "loading" | "done";

const CREDIT_ROWS = [
  { label: "Credit limit", detail: "₹50,900 within available balance" },
  { label: "Territory pricing", detail: "West Maharashtra rate card applied" },
  { label: "Scheme eligibility", detail: "Summer push — 2% extra margin" },
];

/* ── PROCESS VISUAL 2 — ERP-style corner + staggered validation ───────── */
function ProcessVisual2() {
  const reduceMotion = useReducedMotion();
  const [rowStatus, setRowStatus] = useState<RowStatus[]>(() => CREDIT_ROWS.map(() => "pending"));
  const [summary, setSummary] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (reduceMotion) {
      queueMicrotask(() => {
        setRowStatus(CREDIT_ROWS.map(() => "done"));
        setSummary("done");
      });
      return;
    }
    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setRowStatus(CREDIT_ROWS.map(() => "pending"));
        setSummary("idle");
        await wait(600);
        if (cancelled) break;
        for (let i = 0; i < CREDIT_ROWS.length; i++) {
          setRowStatus((prev) => {
            const n = [...prev];
            n[i] = "loading";
            return n;
          });
          await wait(550);
          if (cancelled) break;
          setRowStatus((prev) => {
            const n = [...prev];
            n[i] = "done";
            return n;
          });
          await wait(220);
        }
        if (cancelled) break;
        setSummary("loading");
        await wait(650);
        if (cancelled) break;
        setSummary("done");
        await wait(900);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  function RowIcon({ s }: { s: RowStatus }) {
    if (s === "loading") return <MiniSpinner className="shrink-0" />;
    if (s === "done") {
      return (
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0">
          <circle cx="8" cy="8" r="8" fill="#22c55e" />
          <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return <div className="h-4 w-4 shrink-0 rounded-full border border-neutral-200 dark:border-white/15" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-neutral-200 bg-[#f4f4f3] p-2 dark:border-white/10 dark:bg-neutral-950">
        <div className="min-w-0 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">

            <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <LogoBadge size="sm" animated={summary !== "done"} />
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">Order validation</p>
              </div>
              {summary === "done" ? (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-semibold text-white tracking-wider">ALL CLEAR</span>
              ) : summary === "loading" ? (
                <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[9px] font-semibold text-neutral-500 dark:border-white/10 dark:bg-white/5">
                  <MiniSpinner />
                  Final check
                </span>
              ) : (
                <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[9px] font-semibold text-neutral-400 dark:border-white/10">Running…</span>
              )}
            </div>

            <div className="p-3">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-[12px] font-bold text-neutral-500 dark:border-white/10 dark:bg-white/5">
                  MD
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-neutral-800 dark:text-white">Mumbai distributor</p>
                  <p className="text-[10px] text-neutral-400">ORD-4821 · Pune West</p>
                </div>
              </div>

              <div className="mb-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 dark:border-white/5 dark:bg-white/[0.03]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-500">Credit limit</span>
                  <span className="font-semibold tabular-nums text-neutral-800 dark:text-white">₹15,00,000</span>
                </div>
                <div className="mt-1 flex justify-between text-[11px]">
                  <span className="text-neutral-500">Available</span>
                  <span className="font-semibold tabular-nums text-neutral-800 dark:text-white">₹6,58,000</span>
                </div>
                <div className="mt-2 h-px w-full bg-neutral-200 dark:bg-white/10" />
                <p className="mt-2 text-[10px] text-neutral-400">Order value ₹50,900 — utilization shown as text (no progress tint).</p>
              </div>

              <div className="space-y-1.5">
                {CREDIT_ROWS.map((c, i) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 px-3 py-2 dark:border-white/5 dark:bg-white/[0.03]"
                  >
                    <RowIcon s={rowStatus[i] ?? "pending"} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-neutral-800 dark:text-white">{c.label}</p>
                      <p className="text-[10px] text-neutral-400">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

/* ── EXECUTE VISUAL 1 — Vendor metrics cards with status + channels ────── */
function ExecuteVisual1() {
  const reduceMotion = useReducedMotion();

  const vendors = [
    {
      vendor: "Shree Ganesh Sugar Co.",
      badge: "SG",
      rating: 4.6,
      orders: 142,
      pricePerUnit: "₹38.20 / kg",
      delivery: "36 hrs",
      onTime: "94%",
      status: "In negotiation",
      statusTone: "amber" as const,
      channels: ["wa", "call"] as const,
    },
    {
      vendor: "Metro Raw Materials",
      badge: "MR",
      rating: 4.8,
      orders: 218,
      pricePerUnit: "₹37.50 / kg",
      delivery: "28 hrs",
      onTime: "97%",
      status: "Final quote",
      statusTone: "emerald" as const,
      channels: ["email", "wa"] as const,
    },
  ];

  function ChannelIcon({ kind }: { kind: "wa" | "call" | "email" }) {
    const cls = "flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white dark:border-white/15 dark:bg-white/5";
    if (kind === "wa") {
      return (
        <span className={cls} aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#22c55e"><path d="M20.5 3.5A11 11 0 0 0 3.4 17.7L2 22l4.4-1.4A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.8.9-2.5-.2-.3A9 9 0 1 1 12 20.5Zm5-6.7c-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.2-.6.1l-.8 1c-.2.2-.3.3-.6.1a7.4 7.4 0 0 1-3.6-3.2c-.3-.5.3-.5.7-1.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.7.2.2 1.8 2.7 4.4 3.8 1.6.6 2.3.7 3.1.6.5 0 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.6-.4Z"/></svg>
        </span>
      );
    }
    if (kind === "call") {
      return (
        <span className={cls} aria-label="Call">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
        </span>
      );
    }
    return (
      <span className={cls} aria-label="Email">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
      </span>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] space-y-3">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Negotiates with all suppliers</p>

        {vendors.map((v, idx) => {
          const isFinal = v.statusTone === "emerald";
          const cardCls = isFinal
            ? "border-emerald-300/70 bg-white dark:border-emerald-500/40 dark:bg-neutral-900"
            : "border-amber-300/70 bg-white dark:border-amber-500/40 dark:bg-neutral-900";
          const statusCls = isFinal
            ? "border-emerald-300 bg-emerald-500 text-white shadow-[0_0_14px_rgba(34,197,94,0.45)] dark:border-emerald-500/60"
            : "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200";

          return (
            <motion.div
              key={v.vendor}
              className={`rounded-2xl border px-4 py-3.5 ${cardCls}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reduceMotion ? undefined : { duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
            >
              {/* Top: vendor + comm channels (top-right) */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isFinal
                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/40"
                      : "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/40"
                  }`}>
                    {v.badge}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-neutral-900 dark:text-white">{v.vendor}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-white/55">
                      <span className="inline-flex items-center gap-0.5">
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-amber-500" fill="currentColor"><path d="M6 1l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.8 2.9 10.4l.7-3.4L1 4.6l3.5-.4z"/></svg>
                        <span className="font-semibold tabular-nums text-neutral-700 dark:text-white/75">{v.rating}</span>
                      </span>
                      <span className="text-neutral-300 dark:text-white/20">·</span>
                      <span className="tabular-nums">{v.orders} past orders</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {v.channels.map((c) => <ChannelIcon key={c} kind={c} />)}
                </div>
              </div>

              {/* Vendor metrics grid */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-2 py-1.5 dark:border-white/5 dark:bg-white/[0.03]">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Price / unit</p>
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-white">{v.pricePerUnit}</p>
                </div>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-2 py-1.5 dark:border-white/5 dark:bg-white/[0.03]">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Delivery</p>
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-white">{v.delivery}</p>
                </div>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-2 py-1.5 dark:border-white/5 dark:bg-white/[0.03]">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">On-time</p>
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-white">{v.onTime}</p>
                </div>
              </div>

              {/* Status pill */}
              <div className="mt-3 flex items-center justify-end">
                <motion.span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusCls}`}
                  animate={reduceMotion || !isFinal ? undefined : { scale: [1, 1.04, 1] }}
                  transition={reduceMotion || !isFinal ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isFinal ? "bg-white" : "bg-amber-500"}`} />
                  {v.status}
                </motion.span>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          className="rounded-full border border-emerald-300 bg-emerald-500/90 px-4 py-2 text-center text-[12px] font-semibold text-white shadow-[0_0_24px_rgba(34,197,94,0.55)]"
          animate={reduceMotion ? undefined : { boxShadow: ["0 0 10px rgba(34,197,94,0.2)", "0 0 24px rgba(34,197,94,0.55)", "0 0 10px rgba(34,197,94,0.2)"] }}
          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          PO sent to Metro Raw Materials · ₹37.50/kg
        </motion.div>
      </div>
    </div>
  );
}

/* ── EXECUTE VISUAL 2 — Distributor + Manufacturer rebalance variants ──── */
function PlantSyncCard({
  variant,
  steps,
  totalSteps,
  activeStep,
  showNextSlot,
}: {
  variant: "distributor" | "manufacturer";
  steps: { title: string; sub: string; channelIcons?: boolean }[];
  totalSteps: number;
  activeStep: number;
  showNextSlot: boolean;
}) {
  const plannedPct = Math.round((Math.min(activeStep, totalSteps - 1) / (totalSteps - 1)) * 50);
  const tagLabel = variant === "distributor" ? "Distributor / Wholesaler" : "Manufacturer";
  const tagCls =
    variant === "distributor"
      ? "bg-sky-500/[0.09] text-sky-950/88 dark:bg-sky-400/[0.12] dark:text-sky-100/88"
      : "bg-violet-500/[0.09] text-violet-950/88 dark:bg-violet-400/[0.12] dark:text-violet-100/88";
  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
      {/* Category chip — half outside / half on card top edge */}
      <span
        className={`pointer-events-none absolute left-4 top-0 z-30 max-w-[calc(100%-8.5rem)] -translate-y-1/2 truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-snug shadow-sm ring-1 ring-black/[0.04] dark:ring-white/10 ${tagCls}`}
      >
        {tagLabel}
      </span>
      {/* Status chip — same half-overlap on top-right */}
      <span className="pointer-events-none absolute right-4 top-0 z-30 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 shadow-sm ring-1 ring-black/[0.04] dark:bg-white/[0.06] dark:text-white/55 dark:ring-white/10">
        <span className="inline-flex items-center gap-1">
          <span className="h-1 w-1 rounded-sm bg-emerald-500/90" />
          Synced
        </span>
      </span>
      <div className="border-b border-neutral-100 px-4 pt-4 pb-2.5 dark:border-white/5">
        <div className="flex items-start gap-2 pr-14">
          <LogoBadge size="sm" animated />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-neutral-800 dark:text-white">
              Order → {variant === "distributor" ? "warehouse" : "plant"} sync
            </p>
            <p className="text-[9px] text-neutral-400">Live runbook</p>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={`${s.title}-${i}`} className="flex gap-3">
              <div className="flex w-4 shrink-0 flex-col items-center self-stretch pt-[3px]">
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    i <= activeStep
                      ? "scale-100 border-emerald-500 bg-emerald-500"
                      : "scale-95 border-neutral-300 bg-white dark:border-white/20 dark:bg-neutral-800"
                  } ${i === activeStep ? "shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" : ""}`}
                >
                  <svg
                    viewBox="0 0 8 8"
                    className={`h-2 w-2 transition-opacity duration-300 ${i <= activeStep ? "opacity-100" : "opacity-0"}`}
                    fill="none"
                  >
                    <path d="M1.5 4l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {i < steps.length - 1 ? (
                  <div
                    className={`mx-auto mt-1 min-h-[18px] w-px flex-1 rounded-full transition-colors duration-500 ${
                      i < activeStep ? "bg-emerald-300 dark:bg-emerald-400/70" : "bg-neutral-200 dark:bg-white/10"
                    }`}
                  />
                ) : null}
              </div>
              <div className={`min-w-0 flex-1 leading-snug ${i < steps.length - 1 ? "pb-2.5" : ""}`}>
                <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-neutral-900 dark:text-white">
                  <span>{s.title}</span>
                  {s.channelIcons ? (
                    <span
                      className="inline-flex items-center gap-0.5"
                      aria-label="WhatsApp, phone call, and email"
                    >
                      <img src="/icons/whatsapp.png" alt="" className="h-3.5 w-3.5 object-contain" />
                      <img src="/icons/mobile.png" alt="" className="h-3.5 w-3.5 object-contain" />
                      <img src="/icons/gmail.png" alt="" className="h-3.5 w-3.5 object-contain" />
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[9px] text-neutral-400">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {showNextSlot ? (
          <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-2.5 dark:border-white/5 dark:bg-white/[0.03]">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Next production slot</p>
            <p className="mt-1 text-[10px] font-medium text-neutral-700 dark:text-white/80">Line A — Glucose-D 200ml · WO-9921</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-neutral-900 transition-all duration-700 dark:bg-white" style={{ width: `${plannedPct}%` }} />
              </div>
              <span className="text-[9px] tabular-nums text-neutral-500">{plannedPct}% planned</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-2.5 dark:border-white/5 dark:bg-white/[0.03]">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-400">Outbound dispatch</p>
            <p className="mt-1 text-[10px] font-medium text-neutral-700 dark:text-white/80">WH-Pune → Mumbai Distributor · Tomorrow 8 AM</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExecuteVisual2() {
  const distributorSteps = [
    { title: "Buyer order confirmed", sub: "ORD-4821 · Mumbai Distributor" },
    { title: "Confirmation sent", sub: "WhatsApp, call & email receipt", channelIcons: true },
    { title: "Stock adjusted in WMS", sub: "Glucose-D −50 ctns · Mango Bite −20" },
  ];
  const manufacturerSteps = [
    { title: "Buyer order confirmed", sub: "ORD-4821 · Mumbai Distributor" },
    { title: "Confirmation sent", sub: "WhatsApp, call & email receipt", channelIcons: true },
    { title: "Stock adjusted in WMS", sub: "Glucose-D −50 ctns · Mango Bite −20" },
    { title: "Manufacturing rescheduled", sub: "Line A · Glucose-D batch starts May 9, 6 AM" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % manufacturerSteps.length);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [manufacturerSteps.length]);

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="relative w-full max-w-[460px] pb-14 pt-6">
        <div className="relative z-10 w-[min(100%,93%)] -translate-x-3 sm:-translate-x-5">
          <PlantSyncCard
            variant="distributor"
            steps={distributorSteps}
            totalSteps={distributorSteps.length}
            activeStep={Math.min(activeStep, distributorSteps.length - 1)}
            showNextSlot={false}
          />
        </div>
        <div className="relative z-20 -mt-14 ml-auto w-[min(100%,84%)] translate-x-2 sm:w-[min(100%,82%)] sm:translate-x-4 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.5)]">
          <PlantSyncCard
            variant="manufacturer"
            steps={manufacturerSteps}
            totalSteps={manufacturerSteps.length}
            activeStep={activeStep}
            showNextSlot
          />
        </div>
      </div>
    </div>
  );
}

/* ── EXECUTE VISUAL 3 — Delivery scheduled / negotiating rates (ref UI) ── */
function ExecuteVisual3() {
  const reduceMotion = useReducedMotion();
  const [detailsReady, setDetailsReady] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setDetailsReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setDetailsReady(false);
        await wait(1600);
        if (cancelled) break;
        setDetailsReady(true);
        await wait(2400);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  return (
    <div className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[400px] space-y-0">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoBadge size="sm" animated={!detailsReady} />
              <span className="text-[11px] font-semibold tracking-tight text-neutral-800 dark:text-white">RBD Logistics</span>
            </div>
            <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white dark:bg-neutral-700">00:24</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400">Negotiating with Sharma Logistics · Pune → Mumbai</p>
          <div className="mt-2 flex flex-row-reverse gap-2">
            <motion.div
              className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 dark:bg-white"
              animate={
                !reduceMotion && !detailsReady ? { scale: [1, 1.07, 1] } : { scale: 1 }
              }
              transition={
                !reduceMotion && !detailsReady
                  ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <RbdMark sizePx={26} />
            </motion.div>
            <div className="min-w-0 rounded-2xl bg-neutral-100 px-3 py-1.5 dark:bg-white/5">
              <p className="text-[11px] font-medium leading-snug text-neutral-800 dark:text-white/90">
                Hi Sharma — need a 32ft from{" "}
                <span className="rounded-md bg-white px-1.5 py-0.5 font-semibold dark:bg-neutral-800">Pune WH-A</span>{" "}
                to Mumbai Thu morning, 70 ctns. What&apos;s your rate?
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-white/10">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-neutral-500 dark:text-white/70">
                <circle cx="8" cy="5.2" r="2.3" fill="currentColor" />
                <path d="M3.2 13.6c.5-2.2 2.3-3.4 4.8-3.4s4.3 1.2 4.8 3.4" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0 rounded-2xl bg-neutral-100 px-3 py-1.5 dark:bg-white/5">
              <p className="text-[11px] font-medium leading-snug text-neutral-800 dark:text-white/90">
                Thu 10 AM works.{" "}
                <span className="rounded-md bg-white px-1.5 py-0.5 font-semibold dark:bg-neutral-800">₹15,200</span>{" "}
                — diesel rates are up this week.
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex flex-row-reverse gap-2">
            <motion.div
              className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 dark:bg-white"
              animate={
                !reduceMotion && !detailsReady ? { scale: [1, 1.07, 1] } : { scale: 1 }
              }
              transition={
                !reduceMotion && !detailsReady
                  ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <RbdMark sizePx={26} />
            </motion.div>
            <div className="min-w-0 rounded-2xl bg-neutral-100 px-3 py-1.5 dark:bg-white/5">
              <p className="text-[11px] font-medium leading-snug text-neutral-800 dark:text-white/90">
                Last run was ₹14,500. Can we close at{" "}
                <span className="rounded-md bg-white px-1.5 py-0.5 font-semibold dark:bg-neutral-800">₹14,800</span>?
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-white/10">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-neutral-500 dark:text-white/70">
                <circle cx="8" cy="5.2" r="2.3" fill="currentColor" />
                <path d="M3.2 13.6c.5-2.2 2.3-3.4 4.8-3.4s4.3 1.2 4.8 3.4" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-50 px-3 py-1.5 dark:bg-emerald-500/10">
              <p className="text-[11px] font-medium leading-snug text-neutral-800 dark:text-white/90">
                Done at ₹14,800. Pickup Thu 10:45 AM — sending vehicle details.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500">
              <img src="/logowhite.png" alt="RBD" className="h-5 w-5 object-contain" />
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-800">
              <svg viewBox="0 0 18 18" fill="none" className="h-4 w-4 text-neutral-500 dark:text-white/70">
                <path d="M5 6v6M9 4v10M13 7v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <Waveform active />
          </div>
        </div>

        <div className="flex flex-col items-center py-1">
          <div className="h-5 w-0 border-l-2 border-dashed border-neutral-300 dark:border-white/20" />
          <motion.div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900"
            animate={!reduceMotion && !detailsReady ? { y: [0, -3, 0] } : { y: 0 }}
            transition={
              !reduceMotion && !detailsReady
                ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.25 }
            }
          >
            <RbdMarkInverted sizePx={28} />
          </motion.div>
          <div className="h-5 w-0 border-l-2 border-dashed border-neutral-300 dark:border-white/20" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <div className="grid grid-cols-2 gap-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            <span>Details</span>
            <span>Timings</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-medium text-neutral-400">Empty location</p>
              <div className="mt-1 flex items-start justify-between gap-2">
                <p className="text-[20px] font-black leading-none tracking-tight text-neutral-900 dark:text-white">PUNE WH-A</p>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
                    <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-medium text-neutral-400">Vehicle ID</p>
                {detailsReady ? (
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
                    <circle cx="6" cy="6" r="6" fill="#22c55e" />
                    <path d="M3 6l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <MiniSpinner />
                )}
              </div>
              {detailsReady ? (
                <div className="mt-2 space-y-1.5">
                  <div className="h-7 box-border rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 dark:border-white/10 dark:bg-white/10">
                    <p className="text-[11px] font-semibold tracking-[0.03em] text-neutral-800 dark:text-white">MH12AB4578</p>
                  </div>
                  <div className="h-6 box-border flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-0 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="text-[9px] text-neutral-400">Departure</span>
                    <span className="text-[10px] font-semibold text-neutral-700 dark:text-white/85">Thu 10:45 AM</span>
                  </div>
                  <div className="h-6 box-border flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-0 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="text-[9px] text-neutral-400">Arrival</span>
                    <span className="text-[10px] font-semibold text-neutral-700 dark:text-white/85">Thu 1:20 PM</span>
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  <div className="h-7 box-border rounded-full border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/10 animate-pulse" />
                  <div className="h-6 box-border rounded-lg border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/10 animate-pulse" />
                  <div className="h-6 box-border rounded-lg border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/10 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics helpers (PlatformShowcase-style dashboard, monochrome only) ─ */
const ANALYTICS_LOOP_GAP_S = 0.45;
/** Forecast + actual line use the same pathLength timing so draw cycles stay in phase. */
const ANALYTICS_DEMAND_LINE_DRAW_S = 1.35;

function AnalyticsSparkline({
  values,
  w = 60,
  h = 18,
  drawDelay = 0,
}: {
  values: number[];
  w?: number;
  h?: number;
  drawDelay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="block h-4 w-16 text-neutral-700 dark:text-white"
      preserveAspectRatio="none"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.65 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 0.3, delay: drawDelay },
                pathLength: {
                  duration: 0.75,
                  delay: drawDelay,
                  ease: [0.42, 0, 0.58, 1],
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: ANALYTICS_LOOP_GAP_S,
                },
              }
        }
      />
    </svg>
  );
}

function analyticsChartPoints(
  values: number[],
  w: number,
  h: number,
  pad: number,
  minV: number,
  maxV: number
): [number, number][] {
  const range = maxV - minV || 1;
  const stepX = (w - pad * 2) / (values.length - 1);
  return values.map((v, i) => [
    pad + i * stepX,
    pad + (h - pad * 2) * (1 - (v - minV) / range),
  ]);
}

/** Cubic Béziers through knots (Catmull-Rom-style tangents) — smooth, not polyline corners. */
function smoothPathThrough(points: [number, number][]): string {
  if (points.length === 0) return "";
  const [x0, y0] = points[0]!;
  if (points.length === 1) return `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  if (points.length === 2) {
    const [x1, y1] = points[1]!;
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} L ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2 >= n ? n - 1 : i + 2]!;
    const cx1 = p1[0] + (p2[0] - p0[0]) / 6;
    const cy1 = p1[1] + (p2[1] - p0[1]) / 6;
    const cx2 = p2[0] - (p3[0] - p1[0]) / 6;
    const cy2 = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cx1.toFixed(2)} ${cy1.toFixed(2)}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

function analyticsSmoothLinePath(values: number[], w: number, h: number, pad: number, minV: number, maxV: number) {
  return smoothPathThrough(analyticsChartPoints(values, w, h, pad, minV, maxV));
}

/** Wavy forecast (model revisions / seasonality), actual hugs it with small misses. Y zoom 88–102 for readable ripple. */
const ANALYTICS_FORECAST_SERIES = [93, 95, 94, 96, 95, 97, 96, 99, 97, 100, 99];
const ANALYTICS_ACTUAL_SERIES = [92, 94, 94, 96, 95, 98, 95, 99, 98, 99, 100];

const ANALYTICS_DEMAND_CHART_Y_MIN = 88;
const ANALYTICS_DEMAND_CHART_Y_MAX = 102;

function AnalyticsDemandChart() {
  const reduceMotion = useReducedMotion();

  const w = 400;
  const h = 168;
  const pad = 8;
  const minV = ANALYTICS_DEMAND_CHART_Y_MIN;
  const maxV = ANALYTICS_DEMAND_CHART_Y_MAX;
  const forecastPath = analyticsSmoothLinePath(ANALYTICS_FORECAST_SERIES, w, h, pad, minV, maxV);
  const actualPath = analyticsSmoothLinePath(ANALYTICS_ACTUAL_SERIES, w, h, pad, minV, maxV);
  const areaPath = `${actualPath} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
  const calloutIdx = 5;
  const divergeX = pad + ((w - pad * 2) / (ANALYTICS_ACTUAL_SERIES.length - 1)) * calloutIdx;
  const divergeY =
    pad + (h - pad * 2) * (1 - (ANALYTICS_ACTUAL_SERIES[calloutIdx]! - minV) / (maxV - minV));

  const linePathTransition = reduceMotion
    ? { duration: 0 }
    : {
        pathLength: {
          duration: ANALYTICS_DEMAND_LINE_DRAW_S,
          repeat: Infinity,
          repeatType: "reverse" as const,
          repeatDelay: ANALYTICS_LOOP_GAP_S,
          /** Linear so both lines advance at the same rate in time (matched duration + easing). */
          ease: "linear",
        },
      };

  const linePathInitial = reduceMotion ? false : { pathLength: 0 };
  const linePathAnimate = reduceMotion ? { pathLength: 1 } : { pathLength: [0, 1] };

  const chartBody = (
    <>
      {[0.25, 0.5, 0.75].map((t, i) => (
        <motion.line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + (h - pad * 2) * t}
          y2={pad + (h - pad * 2) * t}
          className="stroke-neutral-200/90 dark:stroke-white/10"
          strokeWidth={1}
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0.65 }}
          animate={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.75, 1] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  pathLength: {
                    duration: 0.55 + i * 0.04,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: ANALYTICS_LOOP_GAP_S,
                    ease: [0.42, 0, 0.58, 1],
                  },
                  opacity: {
                    duration: 0.55,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: ANALYTICS_LOOP_GAP_S,
                    ease: "easeInOut",
                  },
                }
          }
        />
      ))}
      <motion.path
        d={areaPath}
        className="fill-neutral-900/[0.07] dark:fill-white/[0.09]"
        initial={reduceMotion ? false : { opacity: 0.4 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: [0.42, 0.85, 0.42] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.05, repeat: Infinity, ease: "easeInOut", repeatDelay: ANALYTICS_LOOP_GAP_S }
        }
      />
      <motion.path
        d={forecastPath}
        fill="none"
        className="stroke-neutral-500/55 dark:stroke-white/40"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
        initial={linePathInitial}
        animate={linePathAnimate}
        transition={linePathTransition}
      />
      <motion.path
        d={actualPath}
        fill="none"
        stroke="currentColor"
        className="text-neutral-900 dark:text-white"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={linePathInitial}
        animate={linePathAnimate}
        transition={linePathTransition}
      />
      <motion.circle
        cx={divergeX}
        cy={divergeY}
        r={3.5}
        className="fill-neutral-900 dark:fill-white"
        initial={reduceMotion ? false : { scale: 0.92, opacity: 0.5 }}
        animate={reduceMotion ? { scale: 1, opacity: 1 } : { scale: [0.88, 1.06, 0.88], opacity: [0.65, 1, 0.65] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.75, repeat: Infinity, ease: "easeInOut", repeatDelay: ANALYTICS_LOOP_GAP_S }
        }
      />
      <motion.circle
        cx={divergeX}
        cy={divergeY}
        r={7}
        fill="none"
        className="stroke-neutral-400/80 dark:stroke-white/35"
        strokeWidth={1}
        initial={reduceMotion ? false : { scale: 0.96, opacity: 0.4 }}
        animate={reduceMotion ? { scale: 1, opacity: 1 } : { scale: [0.94, 1.08, 0.94], opacity: [0.45, 0.95, 0.45] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.85, repeat: Infinity, ease: "easeInOut", repeatDelay: ANALYTICS_LOOP_GAP_S }
        }
      />
      <motion.line
        x1={divergeX}
        y1={divergeY}
        x2={divergeX}
        y2={h - pad}
        className="stroke-neutral-400/60 dark:stroke-white/30"
        strokeWidth={1}
        strokeDasharray="2 3"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.5 }}
        animate={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.55, 1, 0.55] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                pathLength: {
                  duration: 0.9,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: ANALYTICS_LOOP_GAP_S,
                  ease: [0.42, 0, 0.58, 1],
                },
                opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: ANALYTICS_LOOP_GAP_S },
              }
        }
      />
    </>
  );

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="block w-full overflow-visible" preserveAspectRatio="none">
        {chartBody}
      </svg>
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 rounded border border-neutral-200/90 bg-[#fffefb] px-2 py-1 font-mono text-[9px] text-neutral-700 shadow-sm dark:border-white/15 dark:bg-neutral-950 dark:text-white/85"
        style={{ left: `${(divergeX / w) * 100}%`, top: `${(divergeY / h) * 100 - 18}%` }}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: [0.88, 1, 0.88], y: [3, 0, 3], scale: [0.97, 1, 0.97] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.95, repeat: Infinity, ease: "easeInOut", repeatDelay: ANALYTICS_LOOP_GAP_S }
        }
      >
        Demand edges above forecast (mid-window)
      </motion.div>
    </div>
  );
}

const ANALYTICS_KPIS = [
  { k: "Orders processed", v: "12,840", d: "+12%", trend: [40, 42, 38, 50, 55, 52, 60, 64], up: true as const },
  { k: "On-time fulfilment", v: "94.2%", d: "+1.4 pts", trend: [88, 89, 90, 91, 92, 93, 93, 94], up: true as const },
  { k: "Outstanding (₹ Cr)", v: "28.4", d: "-6%", trend: [34, 33, 32, 31, 30, 30, 29, 28], up: false as const },
] as const;

const ANALYTICS_DISRUPTION_LINES = [
  "Sugar — Vendor #4 delayed 36h → stock rerouted to Vendor #2",
  "SKU-228 demand +18% in MH → procurement queue updated",
  "Distributor D-087 over limit → orders held pending approval",
] as const;

/* ── ANALYTICS VISUAL 1 — Operations KPI strip (Platform-style shell) ─── */
function AnalyticsVisual1() {
  const reduceMotion = useReducedMotion();

  const chromeHidden = reduceMotion ? false : { opacity: 0, y: -4 };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-200/90 bg-[#fffefb] shadow-sm ring-1 ring-black/[0.04] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none dark:ring-0">
        <motion.div
          className="flex min-h-[2.5rem] flex-wrap items-center gap-2 border-b border-neutral-200/80 bg-neutral-100/55 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.02]"
          initial={chromeHidden}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-white/35" />
            <span className="h-2 w-2 rounded-full bg-neutral-300/80 dark:bg-white/22" />
            <span className="h-2 w-2 rounded-full bg-neutral-200 dark:bg-white/15" />
          </div>
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-neutral-500 dark:text-white/45">
            ops.rigidbody.ai · operations
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            live
          </span>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-1 border-b border-neutral-200/80 bg-[#fffefb] px-2 dark:border-white/10 dark:bg-[#0a0a0a]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: 0.08 }}
        >
          {(["Operations", "Demand", "Inventory"] as const).map((t, i) => (
            <span
              key={t}
              className={`relative whitespace-nowrap px-2.5 py-2 text-[11px] ${
                i === 0 ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-white/45"
              }`}
            >
              {t}
              {i === 0 ? (
                <span className="absolute inset-x-1 -bottom-px h-px bg-neutral-900 dark:bg-white" />
              ) : null}
            </span>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-px bg-neutral-200/70 dark:bg-white/5">
          {ANALYTICS_KPIS.map((item, idx) => (
            <motion.div
              key={item.k}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : 0.1 + idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-[#fffefb] p-3 dark:bg-[#0a0a0a]"
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-white/45">{item.k}</p>
                <AnalyticsSparkline values={[...item.trend]} drawDelay={0.22 + idx * 0.14} />
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-1">
                <motion.span
                  className="text-lg font-semibold leading-none text-neutral-900 dark:text-white"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: 0.35 + idx * 0.1 }}
                >
                  {item.v}
                </motion.span>
                <span
                  className={`font-mono text-[10px] ${
                    item.up ? "text-neutral-800 dark:text-white/80" : "text-neutral-600 dark:text-white/50"
                  }`}
                >
                  {item.d}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="border-t border-neutral-200/80 bg-[#fffefb] px-3 py-2.5 dark:border-white/10 dark:bg-[#0a0a0a]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.55 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-neutral-600 dark:text-white/55">
            <span>Unified ingest · WA + voice + email</span>
            <span className="text-neutral-500 dark:text-white/45">Refreshed 2m ago</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── ANALYTICS VISUAL 2 — Disruption radar (Platform list pattern) ───── */
function AnalyticsVisual2() {
  const reduceMotion = useReducedMotion();
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setFocus(1);
      return;
    }
    const id = window.setInterval(() => {
      setFocus((prev) => (prev + 1) % ANALYTICS_DISRUPTION_LINES.length);
    }, 1550);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-200/90 bg-[#fffefb] shadow-sm ring-1 ring-black/[0.04] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none dark:ring-0">
        <motion.div
          className="flex min-h-[2.5rem] items-center gap-2 border-b border-neutral-200/80 bg-neutral-100/55 px-3 py-2 dark:border-white/10 dark:bg-white/[0.02]"
          initial={reduceMotion ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoBadge size="sm" animated />
          <span className="font-mono text-[10px] text-neutral-500 dark:text-white/45">ops.rigidbody.ai</span>
        </motion.div>

        <div className="bg-[#fffefb] p-5 dark:bg-[#0a0a0a]">
          <motion.div
            className="flex items-center justify-between gap-3"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: 0.08 }}
          >
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Disruption radar</p>
            <motion.span
              className="rounded border border-neutral-200/90 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70"
              animate={reduceMotion ? {} : { scale: [1, 1.03, 1] }}
              transition={reduceMotion ? {} : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {ANALYTICS_DISRUPTION_LINES.length} active
            </motion.span>
          </motion.div>
          <ul className="mt-4 space-y-2.5">
            {ANALYTICS_DISRUPTION_LINES.map((item, idx) => (
              <motion.li
                key={item}
                className={`rounded border p-3 dark:bg-white/[0.02] ${
                  focus === idx
                    ? "border-neutral-400/90 bg-neutral-50/90 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:border-white/25 dark:bg-white/[0.05]"
                    : "border-neutral-200/80 bg-neutral-50/80 dark:border-white/8"
                }`}
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                animate={{
                  opacity: focus === idx ? 1 : reduceMotion ? 1 : 0.78,
                  x: 0,
                  scale: reduceMotion ? 1 : focus === idx ? 1.012 : 1,
                }}
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34, mass: 0.85 }
                }
              >
                <p className="font-mono text-[11px] leading-relaxed text-neutral-700 dark:text-white/72">{item}</p>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200/80 pt-3 font-mono text-[10px] text-neutral-600 dark:border-white/10 dark:text-white/55"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.35, duration: 0.35 }}
          >
            <span>MTTR · 6m 22s</span>
            <span>Auto-resolved · 87%</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── ANALYTICS VISUAL 3 — Demand vs forecast (Platform chart pattern) ── */
function AnalyticsVisual3() {
  const reduceMotion = useReducedMotion();
  const metrics = [
    { label: "Next 7d · SKU-228", qty: "1,240 ctns" },
    { label: "Next 7d · Mango", qty: "860 ctns" },
    { label: "Model confidence", qty: "90%" },
  ] as const;

  return (
    <div className="flex h-full w-full items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-200/90 bg-[#fffefb] shadow-sm ring-1 ring-black/[0.04] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none dark:ring-0">
        <motion.div
          className="border-b border-neutral-200/80 bg-[#fffefb] px-4 py-3 dark:border-white/10 dark:bg-[#0a0a0a]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.38 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Demand vs Forecast</p>
              <p className="mt-0.5 font-mono text-[10px] text-neutral-500 dark:text-white/45">SKU-228 · Maharashtra · 14d</p>
            </motion.div>
            <motion.div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-neutral-600 dark:text-white/55"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.42, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-3 shrink-0 bg-neutral-900 dark:bg-white" />
                Actual
              </span>
              <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-white/45">
                <span
                  className="inline-block h-0.5 w-3 shrink-0"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px)",
                  }}
                />
                Forecast
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="bg-[#fffefb] p-4 pt-3 dark:bg-[#0a0a0a]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnalyticsDemandChart />
          </motion.div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-neutral-200/80 pt-3 dark:border-white/10">
            {metrics.map((item, idx) => (
              <motion.div
                key={item.label}
                className="rounded border border-neutral-200/80 bg-neutral-50/70 px-2 py-2 dark:border-white/8 dark:bg-white/[0.03]"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.38, delay: 0.55 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <p className="truncate text-[9px] text-neutral-500 dark:text-white/50">{item.label}</p>
                <motion.p
                  className="mt-1 font-mono text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-white"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.72 + idx * 0.06 }
                  }
                >
                  {item.qty}
                </motion.p>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-3 flex flex-wrap justify-between gap-2 border-t border-neutral-200/80 pt-2.5 font-mono text-[10px] text-neutral-600 dark:border-white/10 dark:text-white/55"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.95, duration: 0.35 }}
          >
            <span>Forecast accuracy · 91%</span>
            <span>Auto-corrections · 4</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const VISUALS: React.FC[] = [
  CaptureVisual1, CaptureVisual2,
  ProcessVisual1, ProcessVisual2,
  ExecuteVisual1, ExecuteVisual2, ExecuteVisual3,
  AnalyticsVisual1, AnalyticsVisual2, AnalyticsVisual3,
];

/* ── Main component ─────────────────────────────────────────────────────── */

export default function ProductSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftStepsScrollRef = useRef<HTMLDivElement>(null);
  const prevPhaseIdxRef = useRef<number | null>(null);
  const reduceMotionSteps = useReducedMotion();
  const [activeGlobal, setActiveGlobal] = useState(0);
  const [stepProgress, setStepProgress] = useState<number[]>(() => new Array(STEP_COUNT).fill(0));
  const rafRef = useRef<number>(0);

  const scrollLeftStepsToTop = useCallback(() => {
    const el = leftStepsScrollRef.current;
    if (!el) return;
    const behavior = reduceMotionSteps ? "auto" : "smooth";
    el.scrollTo({ top: 0, behavior });
  }, [reduceMotionSteps]);

  /* Scroll-linked progress: each panel's progress is based on its position
     relative to the viewport. When the panel's center is at the bottom of
     the viewport (just entered) → 0%, at center of viewport → 50%,
     scrolled up so center is at the top → 100%. */
  useEffect(() => {
    function update() {
      const panels = panelRefs.current;
      const vh = window.innerHeight;
      const newProgress: number[] = [];
      let closest = 0;
      let closestDist = Infinity;
      const target = vh * 0.42;

      for (let i = 0; i < panels.length; i++) {
        const el = panels[i];
        if (!el) {
          newProgress.push(0);
          continue;
        }
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;

        // Progress: 0 when center is at bottom of viewport, 1 when center is at top
        // Map center from vh (bottom) → 0 (top) to progress 0 → 1
        const raw = 1 - center / vh;
        const clamped = Math.min(1, Math.max(0, raw));
        newProgress.push(clamped);

        // Track closest to 42% of viewport for active step
        const dist = Math.abs(center - target);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }

      setStepProgress(newProgress);
      setActiveGlobal((prev) => {
        if (prev === closest) return prev;
        const prevEl = panels[prev];
        if (prevEl) {
          const prevRect = prevEl.getBoundingClientRect();
          const prevDist = Math.abs(prevRect.top + prevRect.height / 2 - target);
          if (prevDist - closestDist < 40) return prev;
        }
        return closest;
      });
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const activePhaseIdx = ALL_STEPS[activeGlobal]?.phaseIdx ?? 0;
  const activeStepIdx = ALL_STEPS[activeGlobal]?.stepIdx ?? 0;

  /* When the phase (tab) changes — from scroll or tab click — scroll the left
     steps column to the top so the new phase reads as a fresh block, in sync
     with the right panel moving to that phase’s first card. */
  useEffect(() => {
    if (prevPhaseIdxRef.current === null) {
      prevPhaseIdxRef.current = activePhaseIdx;
      return;
    }
    if (prevPhaseIdxRef.current !== activePhaseIdx) {
      prevPhaseIdxRef.current = activePhaseIdx;
      scrollLeftStepsToTop();
    }
  }, [activePhaseIdx, scrollLeftStepsToTop]);

  const setPanelRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => {
      panelRefs.current[idx] = el;
    },
    [],
  );

  const scrollToPanel = useCallback((idx: number) => {
    panelRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* Slide direction for left column: forward → incoming from bottom; backward → from top */
  const phaseSlidePrevRef = useRef<number | null>(null);
  let phaseSlideDirection = 1;
  if (phaseSlidePrevRef.current !== null && phaseSlidePrevRef.current !== activePhaseIdx) {
    phaseSlideDirection = activePhaseIdx > phaseSlidePrevRef.current ? 1 : -1;
  }
  phaseSlidePrevRef.current = activePhaseIdx;

  let globalIdx = 0;

  return (
    <section id="product-steps" className="relative bg-background dark:bg-black">
      <div ref={containerRef} className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-0 lg:gap-12 xl:gap-16">

          {/* ── LEFT: sticky panel ────────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
              {/* Phase tabs */}
              <div className="flex mb-10">
                {PHASES.map((phase, i) => (
                  <button
                    key={phase.id}
                    onClick={() => {
                      const firstIdx = ALL_STEPS.findIndex((s) => s.phaseIdx === i);
                      scrollLeftStepsToTop();
                      scrollToPanel(firstIdx);
                    }}
                    className="relative flex-1 group cursor-pointer"
                  >
                    <div className="h-[2px] mb-4 rounded-full overflow-hidden bg-neutral-200/70 dark:bg-white/10">
                      <div
                        className={`h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-700 ease-out ${
                          activePhaseIdx === i ? "w-full" : activePhaseIdx > i ? "w-full opacity-30" : "w-0"
                        }`}
                      />
                    </div>
                    <div className={`flex items-center gap-2 transition-all duration-500 ${
                      activePhaseIdx === i
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-400 group-hover:text-neutral-500 dark:text-white/30 dark:group-hover:text-white/50"
                    }`}>
                      {phase.icon}
                      <span className="text-[14px] font-medium">{phase.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Heading + steps: vertical slide — forward steps enter from bottom; back tab enters from top */}
              <div ref={leftStepsScrollRef} className="relative min-h-0 flex-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false} custom={phaseSlideDirection}>
                  <motion.div
                    key={PHASES[activePhaseIdx].id}
                    custom={phaseSlideDirection}
                    {...(reduceMotionSteps
                      ? {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          exit: { opacity: 0 },
                          transition: { duration: 0.12 },
                        }
                      : {
                          variants: {
                            initial: (dir: number) => ({
                              y: dir >= 0 ? "100%" : "-100%",
                              opacity: 0,
                            }),
                            animate: { y: 0, opacity: 1 },
                            exit: (dir: number) => ({
                              y: dir >= 0 ? "-35%" : "35%",
                              opacity: 0,
                            }),
                          },
                          initial: "initial",
                          animate: "animate",
                          exit: "exit",
                          transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                        })}
                    className="flex min-h-0 flex-col will-change-transform"
                  >
                    <h3 className="mb-10 text-[36px] font-normal leading-[1.1] tracking-tight text-neutral-950 dark:text-white">
                      {PHASES[activePhaseIdx].heading}
                    </h3>
                    <div className="min-h-0 flex-1">
                      {PHASES[activePhaseIdx].steps.map((step, si) => {
                        const phaseOffset = ALL_STEPS.findIndex((s) => s.phaseIdx === activePhaseIdx);
                        const gi = phaseOffset + si;
                        const isActive = activeStepIdx === si;
                        let ringProgress = 0;
                        if (si < activeStepIdx) ringProgress = 1;
                        else if (si === activeStepIdx) ringProgress = stepProgress[gi] ?? 0;
                        else ringProgress = 0;

                        return (
                          <button
                            key={step.title}
                            onClick={() => scrollToPanel(gi)}
                            className={`flex w-full cursor-pointer gap-5 py-5 text-left transition-all duration-500 ${
                              si > 0 ? "border-t border-neutral-100 dark:border-white/5" : ""
                            }`}
                          >
                            <StepNumber num={si + 1} progress={ringProgress} />
                            <div className="min-w-0 pt-1.5">
                              <p
                                className={`text-[16px] font-semibold leading-snug transition-colors duration-500 ${
                                  isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-white/30"
                                }`}
                              >
                                {step.title}
                              </p>
                              <div
                                className={`overflow-hidden transition-all duration-500 ease-out ${
                                  isActive ? "mt-2 max-h-28 opacity-100" : "mt-0 max-h-0 opacity-0"
                                }`}
                              >
                                <p className="text-[14px] leading-relaxed text-neutral-500 dark:text-white/45">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Book a Demo — pinned at bottom of sticky panel */}
              <div className="mt-auto pb-10">
                <p className="mb-3 text-[13px] text-neutral-600 dark:text-white/60">
                  To customize according to your needs
                </p>
                <Link
                  href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-neutral-900 px-6 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>

          {/* ── RIGHT: scrollable panels ──────────────────────────── */}
          <div>
            {/* Mobile: phase sections with true scroll-stacked cards */}
            <div className="space-y-10 lg:hidden">
              {PHASES.map((phase, phaseIdx) => (
                <section key={`mobile-phase-stack-${phase.id}`} className="relative">
                  <div className="sticky top-16 z-30 mb-4 bg-background/95 py-3 backdrop-blur-sm dark:bg-black/95">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                        {phase.icon}
                      </div>
                      <h3 className="text-[26px] font-normal leading-tight tracking-tight text-neutral-950 dark:text-white">
                        {phase.label.split(" ")[0]}
                      </h3>
                    </div>
                  </div>

                  <div className="relative">
                    {phase.steps.map((step, si) => {
                      const gi = ALL_STEPS.findIndex((s) => s.phaseIdx === phaseIdx && s.stepIdx === si);
                      const Visual = VISUALS[gi];
                      const isActive = gi === activeGlobal;
                      const stickyTop = 124 + si * 18;
                      return (
                        <div
                          key={`mobile-stack-card-${phase.id}-${step.title}`}
                          ref={setPanelRef(gi)}
                          data-idx={gi}
                          className={`sticky mb-4 block w-full rounded-2xl border p-4 text-left ${
                            isActive
                              ? "border-neutral-900 bg-white dark:border-white dark:bg-neutral-950"
                              : "border-neutral-200 bg-white dark:border-white/15 dark:bg-neutral-950"
                          }`}
                          style={{ top: `${stickyTop}px`, zIndex: 20 + si }}
                        >
                          <TrackedFocusRegion
                            focusRegion="product_steps"
                            focusItemId={`${phase.id}_${si}`}
                            focusItemLabel={step.title}
                          >
                            <button onClick={() => scrollToPanel(gi)} className="block w-full text-left">
                              <div className="mb-3 flex items-center gap-3">
                                <StepNumber num={si + 1} progress={stepProgress[gi] ?? 0} />
                                <p className="min-w-0 text-[17px] font-semibold leading-snug text-neutral-900 dark:text-white">
                                  {step.title}
                                </p>
                              </div>
                              <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-white/55">{step.description}</p>
                              <div className="mt-4 h-[320px] select-none overflow-hidden rounded-xl border border-neutral-200 bg-[#fafaf9] dark:border-white/10 dark:bg-neutral-900/50">
                                <div className="flex h-full w-full items-start justify-center pt-2">
                                  <div className="origin-top scale-[0.58]">
                                    <Visual />
                                  </div>
                                </div>
                              </div>
                            </button>
                          </TrackedFocusRegion>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            {/* Desktop: original right-side visual panels */}
            <div className="hidden lg:block">
              {PHASES.map((phase) =>
                phase.steps.map((step, si) => {
                  const idx = globalIdx++;
                  const Visual = VISUALS[idx];
                  return (
                    <div
                      key={`${phase.id}-${si}`}
                      ref={setPanelRef(idx)}
                      data-idx={idx}
                      className="flex flex-col py-10"
                    >
                      <TrackedFocusRegion
                        focusRegion="product_steps"
                        focusItemId={`${phase.id}_${si}`}
                        focusItemLabel={step.title}
                      >
                        <div className="select-none overflow-hidden rounded-2xl border border-neutral-200 bg-[#fafaf9] dark:border-white/10 dark:bg-neutral-900/50 lg:flex lg:h-[660px] lg:items-center lg:justify-center">
                          <Visual />
                        </div>
                      </TrackedFocusRegion>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
