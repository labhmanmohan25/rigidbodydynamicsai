"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import TrackedFocusRegion from "@/components/TrackedFocusRegion";
import { cn, ds, NESTLE_PRODUCTS } from "@/lib/design-system";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const iconSrc = (file: string) => (basePath ? `${basePath}/icons/${file}` : `/icons/${file}`);

/** Shared hook: returns true once the element is roughly in the center 20% of the viewport. One-shot (stays true). */
function useVisibleInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return isVisible;
}

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
        title: "Captures inbound from all sources",
        description:
          "Your buyers and field teams keep ordering the way they always have — WhatsApp messages, Excel sheets, emails, even phone calls. Nothing changes for them. We capture everything automatically.",
      },
      {
        title: "AI reads every format and language",
        description:
          "Hindi, Marathi, Gujarati, English — mixed in one message or email. Our agents parse it into structured order lines: SKU, quantity, delivery window — before anything hits the plant schedule.",
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
        title: "SKU resolution & live stock snapshot",
        description:
          '"80 cartons Nescafe Sunrise" maps to SKU-302 and your WMS snapshot in one pass. When inventory is running lean, the system triggers procurement automatically.',
     
      },
      {
        title: "Credit & pricing validation",
        description:
          "Buyer credit limits, territory pricing, and scheme eligibility — all verified before the order is accepted.",
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
          "When raw materials or packaging stock drops below safety levels, purchase orders go out automatically. Quotes are compared across your approved vendors, and the best option is selected with full rationale.",
      },
      {
        title: "Production schedules rebalance",
        description:
          "Nestlé demand signals update the MES / packaging lines you already run: committed volumes adjust, slotting tightens on hot SKUs, and materials reserved to orders stay traceable.",
      },
      {
        title: "Delivery scheduled",
        description:
          "Plant dispatch and primary freight timelines align with what buyers were promised — pickup windows, lanes, and negotiated rates stay in one thread so the yard and customer service see the same truth.",
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
      <span className={`${ds.text.bodySmall} font-semibold tracking-wide text-neutral-600 dark:text-white/70`}>{children}</span>
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

/* ── CAPTURE VISUAL 1 — WhatsApp + voice + email + Excel UIs ───────────── */
/* ── Per-channel cards (constant height each) ─────────────────────────── */
/** Time each channel pill stays active; drives the horizontal progress fill. */
const CARD_DURATION_MS = Math.round(6200 / 1.2); // ~5167 — 1.2× faster segment / progress bar

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
        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">PW</div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white leading-tight">Pune wholesaler</p>
          <p className={`${ds.text.caption} text-white/60 leading-tight`}>online</p>
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
              <p className="text-[13px] text-neutral-800 dark:text-white/90 leading-relaxed">Bhai 80 carton Nescafe Sunrise bhejo aur 120 carton Maggi Noodles kal tak chahiye</p>
              <p className={`${ds.text.caption} text-neutral-400 text-right mt-1 tabular-nums`}>10:32 AM</p>
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
            className="flex justify-end"
          >
            <div className="relative bg-[#DCF8C6] dark:bg-[#005C4B] rounded-lg rounded-tr-none px-3 py-2 max-w-[82%] shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 dark:bg-white">
                  <RbdMark sizePx={18} />
                </div>
                <span className={`${ds.text.caption} font-semibold text-emerald-800 dark:text-emerald-200`}>RBD Agent</span>
              </div>
              <p className="text-[13px] text-neutral-800 dark:text-white/90 leading-relaxed">Checking and confirming, will update shortly.</p>
              <p className={`${ds.text.caption} text-neutral-400 text-right mt-1 tabular-nums`}>10:33 AM</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const VOICE_WAVE_BARS = WAVE_HEIGHTS.slice(0, 36);

function VoiceChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const playedCount = 14;
  return (
    <div
      className={cn(
        "overflow-hidden border border-[color:var(--ds-card-border)] bg-[color:var(--ds-card-bg)]",
        "shadow-[var(--ds-shadow-card)] dark:shadow-[var(--ds-shadow-card-dark)]",
        "rounded-[var(--ds-radius-xl)] dark:bg-neutral-900",
      )}
    >
      {/* Header — lane label + timer */}
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--ds-card-border)] px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[11px] font-bold text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
            aria-hidden
          >
            PW
          </div>
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500 dark:text-white/50">
            Pune wholesaler · Nestlé lane
          </p>
        </div>
        <span
          className="shrink-0 rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white dark:bg-neutral-950 dark:text-white/95"
          aria-label="Call duration"
        >
          00:24
        </span>
      </div>

      {/* Body — prompt, sender row, transcript + slot pills */}
      <div className="space-y-3 px-4 pb-4 pt-4">
        <p className={cn(ds.text.bodySmall, "text-neutral-500 dark:text-white/50")}>
          What quantities and delivery window should we lock for this Nestlé pull?
        </p>
        <div className="flex items-center justify-end gap-2">
          <span className={cn(ds.text.caption, "truncate font-semibold uppercase tracking-wide text-neutral-400 dark:text-white/45")}>
            Rajesh Patil
          </span>
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600 dark:bg-white/15 dark:text-white/80"
            aria-hidden
          >
            RP
          </div>
        </div>
        <p className="text-left text-[15px] font-semibold leading-snug text-neutral-900 dark:text-white">
          Eighty cartons Nescafe Sunrise, one-twenty Maggi noodles — need both{" "}
          <span className="inline-block rounded-full bg-neutral-200/95 px-2 py-0.5 align-baseline text-[14px] font-semibold text-neutral-900 dark:bg-white/15 dark:text-white">
            Thursday 6 AM
          </span>{" "}
          at{" "}
          <span className="inline-block rounded-full bg-neutral-200/95 px-2 py-0.5 align-baseline text-[14px] font-semibold text-neutral-900 dark:bg-white/15 dark:text-white">
            Baner DC, Pune
          </span>
          .
        </p>
      </div>

      {/* Footer — controls + single-row waveform */}
      <div className="flex items-center gap-3 border-t border-[color:var(--ds-card-border)] px-4 py-3">
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-card-bg)] dark:bg-red-600/90 dark:focus-visible:ring-offset-neutral-900"
            aria-label="End call"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M3.5 8.5c2-3.5 11-3.5 13 0l.5 2.5-3.5 1.5L12 10.5H8l-1.5 2L3 11l.5-2.5z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300/80 bg-neutral-100 text-neutral-800 transition-colors hover:bg-neutral-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-card-bg)] dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:focus-visible:ring-offset-neutral-900"
            aria-label="Pause recording"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path d="M7 4v12M13 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div
          className="flex min-h-[40px] min-w-0 flex-1 items-center justify-center gap-[2px] rounded-full bg-neutral-100/90 px-2.5 py-2 dark:bg-white/[0.06]"
          role="img"
          aria-label="Live call waveform"
        >
          {VOICE_WAVE_BARS.map((h, i) => {
            const isPlayed = i < playedCount;
            return (
              <motion.div
                key={i}
                className={cn(
                  "w-[2.5px] shrink-0 rounded-sm",
                  isPlayed
                    ? "bg-emerald-600/85 dark:bg-emerald-400/75"
                    : "bg-neutral-300/90 dark:bg-white/25",
                )}
                style={{ height: `${Math.max(5, h * 0.65)}px`, transformOrigin: "50% 100%" }}
                animate={reduceMotion ? undefined : { scaleY: [0.65, 1.05, 0.75, 1] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.9 + (i % 5) * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (i % 6) * 0.06,
                      }
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmailChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const rows = [
    { initials: "NV", name: "Nashik Vendor", subject: "May Orders - 48 SKUs · orders_may.xlsx", time: "10:42" },
    { initials: "AT", name: "Akola Trader", subject: "RE: Reorder request — Nescafe Sunrise + Maggi", time: "10:38" },
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
        <span className={`${ds.text.caption} text-neutral-500 dark:text-white/60`}>Inbox</span>
        <span className={`ml-auto rounded-full bg-neutral-100 dark:bg-white/10 px-2 py-0.5 ${ds.text.caption} font-semibold text-neutral-600 dark:text-white/70 tabular-nums`}>{count}</span>
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
            <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">{r.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white truncate leading-tight">{r.name}</p>
              </div>
              <p className={`${ds.text.caption} text-neutral-500 dark:text-white/55 truncate leading-tight mt-0.5`}>{r.subject}</p>
            </div>
            <span className={`${ds.text.caption} text-neutral-400 tabular-nums shrink-0`}>{r.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExcelChannelCard({ reduceMotion }: { reduceMotion: boolean }) {
  const rows = [
    { i: 1, name: "Nescafe Sunrise 100g", qty: "80", date: "May 8" },
    { i: 2, name: "Maggi Noodles 70g", qty: "120", date: "May 8" },
    { i: 3, name: "KitKat 4-Finger", qty: "200", date: "May 9" },
    { i: 4, name: "Munch 23g", qty: "150", date: "May 9" },
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
            <Image src={iconSrc("excel.png")} alt="" width={20} height={20} className="h-full w-full object-contain" />
          </div>
          <span className={`${ds.text.bodySmall} font-semibold text-white`}>orders_may.xlsx</span>
        </div>
        <span className={`rounded bg-white/15 px-2 py-0.5 ${ds.text.caption} font-semibold text-white`}>Nagpur retailer · 32 SKUs</span>
      </div>
      <div className={`grid grid-cols-[28px_1fr_56px_56px] ${ds.text.caption} font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-white/5`}>
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
          className={`grid grid-cols-[28px_1fr_56px_56px] border-b border-neutral-100 ${ds.text.bodySmall} text-neutral-700 last:border-b-0 dark:border-white/5 dark:text-white/80`}
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
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  const channels = useMemo(
    () =>
      [
        { key: "wa", iconFile: "whatsapp.png" as const, tabLabel: "WhatsApp", Card: WhatsAppChannelCard },
        { key: "voice", iconFile: "mobile.png" as const, tabLabel: "Voice", Card: VoiceChannelCard },
        { key: "email", iconFile: "gmail.png" as const, tabLabel: "Email", Card: EmailChannelCard },
        { key: "excel", iconFile: "excel.png" as const, tabLabel: "Excel", Card: ExcelChannelCard },
      ] as const,
    [],
  );
  const [idx, setIdx] = useState(0);
  const [carouselTick, setCarouselTick] = useState(0);
  const segmentStartRef = useRef(Date.now());

  /** Single clock: repaint progress + roll segment when elapsed ≥ duration (no desync between two timers). */
  useEffect(() => {
    if (reduceMotion || !isVisible) return;
    const TICK_MS = 32;
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = now - segmentStartRef.current;
      if (elapsed >= CARD_DURATION_MS) {
        segmentStartRef.current = now;
        setIdx((i) => (i + 1) % channels.length);
      }
      setCarouselTick((t) => t + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduceMotion, isVisible, channels.length]);

  const selectChannel = useCallback((i: number) => {
    segmentStartRef.current = Date.now();
    setCarouselTick((t) => t + 1);
    setIdx(i);
  }, []);

  const carouselProgress = useMemo(() => {
    if (reduceMotion) return 0;
    const elapsed = Date.now() - segmentStartRef.current;
    return Math.min(1, elapsed / CARD_DURATION_MS);
  }, [carouselTick, idx, reduceMotion]);

  const active = channels[idx];
  const ActiveCard = active.Card;
  const fillPct = carouselProgress * 100;

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px]">

        <div
          className="mb-4 grid grid-cols-2 gap-2 sm:gap-2.5"
          role="group"
          aria-label="Inbound order channels"
        >
          {channels.map((c, i) => {
            const isActive = i === idx;
            return (
              <div key={c.key} className="min-w-0 sm:max-w-none">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${c.tabLabel} channel${isActive ? ", showing preview" : ""}`}
                  onClick={() => selectChannel(i)}
                  className={cn(
                    "relative flex min-h-[44px] w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-2 transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-[#0a0a0a]",
                    isActive && reduceMotion && "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
                    isActive && !reduceMotion && "bg-neutral-100 dark:bg-white/10",
                    !isActive && "bg-neutral-50 text-neutral-800 border border-neutral-200 dark:bg-white/[0.06] dark:text-white/85 dark:border-white/10",
                  )}
                >
                  {isActive && !reduceMotion && (
                    <>
                      <div
                        className="absolute inset-y-0 left-0 bg-neutral-900 dark:bg-white"
                        style={{ width: `${fillPct}%` }}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2"
                        style={{ clipPath: `inset(0 0 0 ${fillPct}%)` }}
                        aria-hidden
                      >
                        <Image
                          src={iconSrc(c.iconFile)}
                          alt=""
                          width={26}
                          height={26}
                          className="h-[26px] w-[26px] shrink-0 object-contain opacity-88 dark:opacity-90"
                          sizes="26px"
                        />
                        <span className="whitespace-nowrap text-[13px] font-medium leading-tight text-neutral-900 dark:text-white/90">
                          {c.tabLabel}
                        </span>
                      </div>
                      <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2"
                        style={{ clipPath: `inset(0 ${100 - fillPct}% 0 0)` }}
                        aria-hidden
                      >
                        <Image
                          src={iconSrc(c.iconFile)}
                          alt=""
                          width={26}
                          height={26}
                          className="h-[26px] w-[26px] shrink-0 object-contain opacity-95 dark:opacity-100"
                          sizes="26px"
                        />
                        <span className="whitespace-nowrap text-[13px] font-medium leading-tight text-white dark:text-neutral-900">
                          {c.tabLabel}
                        </span>
                      </div>
                    </>
                  )}
                  {(!isActive || reduceMotion) && (
                    <>
                      <Image
                        src={iconSrc(c.iconFile)}
                        alt=""
                        width={26}
                        height={26}
                        className={cn(
                          "relative z-10 h-[26px] w-[26px] shrink-0 object-contain",
                          isActive ? "opacity-95 dark:opacity-100" : "opacity-88 dark:opacity-90",
                        )}
                        sizes="26px"
                      />
                      <span
                        className={cn(
                          "relative z-10 whitespace-nowrap text-[13px] font-medium leading-tight",
                          isActive && "text-white dark:text-neutral-900",
                        )}
                      >
                        {c.tabLabel}
                      </span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[268px]">
          <AnimatePresence>
            <motion.div
              key={active.key}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0"
            >
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
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  const [loadedRows, setLoadedRows] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setLoadedRows(3);
      return;
    }
    if (!isVisible) return;

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
  }, [reduceMotion, isVisible]);

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] space-y-2.5">
        {/* Raw input — WhatsApp message snippet */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10">
          <div className="bg-[#075E54] px-4 py-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">PW</div>
            <p className={`${ds.text.bodySmall} font-semibold text-white`}>Pune wholesaler</p>
          </div>
          <div className="bg-[#ECE5DD] dark:bg-[#0B141A] px-3 py-2.5">
            <div className="bg-white dark:bg-[#202C33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[90%]">
              <p className="text-[12px] text-neutral-700 dark:text-white/80 leading-relaxed">Bhai 80 carton Nescafe Sunrise bhejo aur 120 carton Maggi Noodles kal tak chahiye</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`rounded px-1.5 py-0.5 ${ds.text.caption} font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-400`}>HI</span>
                <span className={`rounded px-1.5 py-0.5 ${ds.text.caption} font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-400`}>EN</span>
                <span className={`ml-auto ${ds.text.caption} text-neutral-400 tabular-nums`}>10:32 AM</span>
              </div>
            </div>
          </div>
        </div>

        <ConnectorPill animatedBorder borderClassName="border-amber-400 dark:border-amber-300">RBD extracts order requirements</ConnectorPill>

        {/* Parsed output — our platform dashboard style */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900">
          {/* Dashboard header */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoBadge size="sm" animated />
              <div>
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">Order Interpreter</p>
                <p className={`${ds.text.caption} text-neutral-400`}>Parsed from WhatsApp text (same flow for email)</p>
              </div>
            </div>
            <span className={`rounded-full bg-emerald-500 px-2.5 py-1 ${ds.text.caption} font-semibold text-white tracking-wider`}>2 EXTRACTED</span>
          </div>

          {/* Structured items */}
          <div className="p-4 space-y-2">
            {[
              { sku: "SKU-302", name: "Nescafe Sunrise 100g", qty: "80 ctns" },
              { sku: "SKU-104", name: "Maggi Noodles 70g", qty: "120 ctns" },
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
                        <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200/60 dark:border-white/10 font-mono">{item.sku.split("-")[1]}</div>
                        <div>
                          <p className="text-[13px] font-semibold text-neutral-800 dark:text-white">{item.name}</p>
                          <p className={`${ds.text.caption} text-neutral-400 font-mono`}>{item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-neutral-900 dark:text-white tabular-nums">{item.qty}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5"><circle cx="5" cy="5" r="5" fill="#22c55e"/><path d="M3 5l1.5 1.5 3-3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span className={`${ds.text.caption} text-emerald-600 font-semibold`}>Extracted</span>
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
const SKU_TABLE_ROWS: { sku: string; name: string; ord: number; stock: number; shelf: string; tag?: "sunrise" | "maggi" }[] =
  NESTLE_PRODUCTS.map((p) => ({
    sku: p.sku,
    name: p.name,
    ord: p.sku === "SKU-302" ? 80 : p.qty,
    stock: p.stock,
    shelf: p.shelfLife,
    tag: p.sku === "SKU-104" ? "maggi" : p.sku === "SKU-302" ? "sunrise" : undefined,
  }));

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function ProcessVisual1() {
  const reduceMotion = useReducedMotion();
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  const [focus, setFocus] = useState<"none" | "maggi" | "sunrise">("none");
  const [tickMaggi, setTickMaggi] = useState(false);
  const [tickSunrise, setTickSunrise] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      queueMicrotask(() => {
        setTickMaggi(true);
        setTickSunrise(true);
        setFocus("none");
      });
      return;
    }
    if (!isVisible) return;
    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setFocus("none");
        setTickMaggi(false);
        setTickSunrise(false);
        await wait(450);
        if (cancelled) break;
        setFocus("maggi");
        await wait(850);
        if (cancelled) break;
        setTickMaggi(true);
        await wait(650);
        if (cancelled) break;
        setFocus("sunrise");
        await wait(850);
        if (cancelled) break;
        setTickSunrise(true);
        await wait(650);
        if (cancelled) break;
        setFocus("none");
        await wait(550);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion, isVisible]);

  const scale = focus === "none" ? (reduceMotion ? 1 : 0.9) : 1.16;
  // Pan (translateY px) while zoomed: `NESTLE_PRODUCTS` order puts Maggi at data row 2, low-stock Sunrise at row 3.
  // Linear map matches legacy anchors row0 → +10, row7 → -56 (slope -66/7 per index step).
  const SKU_FOCUS_ROW = { maggi: 2, sunrise: 3 } as const;
  const SKU_PAN_BASE = 10;
  const SKU_PAN_PER_ROW = -66 / 7;
  const y =
    focus === "none"
      ? 10
      : focus === "maggi"
        ? SKU_PAN_BASE + SKU_PAN_PER_ROW * SKU_FOCUS_ROW.maggi
        : SKU_PAN_BASE + SKU_PAN_PER_ROW * SKU_FOCUS_ROW.sunrise;

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="relative w-full max-w-[440px]">
        {/* Excel source data — sits behind, peeking from top-right with partial overlap */}
        <div className="pointer-events-none absolute -right-8 -top-16 z-0 w-[230px] opacity-90 dark:opacity-70">
          <div className="rounded-xl border border-neutral-200/80 bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.30)] dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center justify-between rounded-t-xl bg-[#107C41] px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-[1px]">
                  <Image src="/icons/excel.png" alt="" width={16} height={16} className="h-full w-full object-contain" />
                </div>
                <span className={`${ds.text.bodySmall} font-semibold text-white`}>buyer_orders.xlsx</span>
              </div>
              <span className={`${ds.text.caption} font-semibold uppercase tracking-wider text-white/80`}>Source</span>
            </div>
            <div className={`grid grid-cols-[20px_1fr_36px_30px] ${ds.text.caption} font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-white/5`}>
              <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-0.5 text-center dark:border-white/5 dark:bg-white/[0.03]">#</span>
              <span className="border-r border-neutral-100 px-1 py-0.5 dark:border-white/5">Item</span>
              <span className="border-r border-neutral-100 px-1 py-0.5 text-right dark:border-white/5">Qty</span>
              <span className="px-1 py-0.5 text-right">Unit</span>
            </div>
            {[
              { i: 1, name: "Nescafe Sunrise 100g", qty: "80", u: "ctn" },
              { i: 2, name: "Maggi Noodles 70g", qty: "120", u: "ctn" },
              { i: 3, name: "KitKat 4-Finger", qty: "200", u: "ctn" },
              { i: 4, name: "Munch 23g", qty: "150", u: "ctn" },
              { i: 5, name: "Milkybar 25g", qty: "60", u: "ctn" },
            ].map((r) => (
              <div key={r.i} className={`grid grid-cols-[20px_1fr_36px_30px] border-b border-neutral-100 ${ds.text.caption} text-neutral-700 last:border-b-0 dark:border-white/5 dark:text-white/70`}>
                <span className="border-r border-neutral-100 bg-neutral-50/70 px-1 py-0.5 text-center font-mono text-neutral-400 dark:border-white/5 dark:bg-white/[0.03]">{r.i}</span>
                <span className="border-r border-neutral-100 px-1 py-0.5 dark:border-white/5 truncate">{r.name}</span>
                <span className="border-r border-neutral-100 px-1 py-0.5 text-right tabular-nums dark:border-white/5">{r.qty}</span>
                <span className="px-1 py-0.5 text-right tabular-nums text-neutral-500 dark:text-white/55">{r.u}</span>
              </div>
            ))}
          </div>
          <span className={`mt-1.5 ml-auto block w-fit rounded-full border border-neutral-200/70 bg-white/90 px-2 py-0.5 ${ds.text.caption} font-semibold uppercase tracking-[0.14em] text-neutral-500 shadow-sm dark:border-white/10 dark:bg-neutral-900/80 dark:text-white/55`}>
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
                <span className={`${ds.text.caption} font-semibold text-neutral-500 dark:text-white/50`}>Live</span>
              </div>
            </div>

            <div className="relative h-[200px] overflow-hidden bg-neutral-50/80 dark:bg-black/20">
              <motion.div
                className="origin-top px-2 pt-1"
                animate={{ scale, y }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
              >
                <div className={`grid grid-cols-[minmax(0,0.9fr)_1.1fr_0.5fr_0.55fr_0.5fr_0.52fr] gap-0 ${ds.text.caption} font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-white/10 py-1.5 px-1`}>
                  <span className="pl-1">SKU</span>
                  <span>Product</span>
                  <span className="text-right pr-1">Ord</span>
                  <span className="text-right pr-1">WH</span>
                  <span className="text-right pr-1">Shelf</span>
                  <span className="text-center">OK</span>
                </div>
                {SKU_TABLE_ROWS.map((row, i) => {
                  const isMaggi = row.tag === "maggi";
                  const isSunrise = row.tag === "sunrise";
                  const hilite = (isMaggi && focus === "maggi") || (isSunrise && focus === "sunrise");
                  const resolved = (isMaggi && tickMaggi) || (isSunrise && tickSunrise);
                  const stockOk = row.stock >= row.ord;
                  const isLowConflict = isSunrise && !stockOk;
                  return (
                    <div
                      key={row.sku}
                      className={`grid grid-cols-[minmax(0,0.9fr)_1.1fr_0.5fr_0.55fr_0.5fr_0.52fr] gap-0 items-center border-b border-neutral-100/90 dark:border-white/[0.06] py-1 px-1 font-mono text-[12px] ${
                        hilite
                          ? isLowConflict
                            ? "bg-amber-50 ring-1 ring-amber-300/80 dark:bg-amber-500/10 dark:ring-amber-400/40 z-10 rounded-sm"
                            : "bg-white dark:bg-neutral-800 ring-1 ring-neutral-300 dark:ring-white/20 z-10 rounded-sm"
                          : i % 2 === 0
                            ? "bg-white/60 dark:bg-white/[0.03]"
                            : ""
                      }`}
                    >
                      <span className="text-neutral-500 dark:text-white/45 pl-1 truncate">{row.sku}</span>
                      <span className={`truncate font-sans font-medium ${isMaggi || isSunrise ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-white/70"}`}>{row.name}</span>
                      <span className="text-right text-neutral-700 dark:text-white/80 tabular-nums pr-1">{row.ord}</span>
                      <span className={`text-right tabular-nums pr-1 ${stockOk ? "text-neutral-600 dark:text-white/60" : "font-semibold text-amber-700 dark:text-amber-300"}`}>{row.stock}</span>
                      <span className="text-right text-neutral-500 dark:text-white/45 pr-1">{row.shelf}</span>
                      <span className="flex justify-center">
                        {resolved ? (
                          stockOk ? (
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                              <circle cx="6" cy="6" r="6" fill="#22c55e" />
                              <path d="M3.5 6L5 7.5 8.5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <span
                              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold leading-none text-white shadow-sm"
                              title="Below safety stock"
                            >
                              !
                            </span>
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
  { label: "Credit limit check", detail: "₹50,900 is within ₹6,58,000 available balance" },
  { label: "Territory pricing applied", detail: "West Maharashtra rate card — verified" },
  { label: "Scheme eligibility", detail: "Summer push active — 2% extra margin applied" },
];

/* ── PROCESS VISUAL 2 — ERP-style corner + staggered validation ───────── */
function ProcessVisual2() {
  const reduceMotion = useReducedMotion();
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
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
    if (!isVisible) return;
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
  }, [reduceMotion, isVisible]);

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
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] rounded-2xl border border-neutral-200 bg-[#f4f4f3] p-2 dark:border-white/10 dark:bg-neutral-950">
        <div className="min-w-0 rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">

            <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <LogoBadge size="sm" animated={summary !== "done"} />
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-white">Order validation</p>
              </div>
              {summary === "done" ? (
                <span className={`rounded-full bg-emerald-500 px-2.5 py-1 ${ds.text.caption} font-semibold text-white tracking-wider`}>ALL CLEAR</span>
              ) : summary === "loading" ? (
                <span className={`flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 ${ds.text.caption} font-semibold text-neutral-500 dark:border-white/10 dark:bg-white/5`}>
                  <MiniSpinner />
                  Final check
                </span>
              ) : (
                <span className={`rounded-full border border-neutral-200 px-2.5 py-1 ${ds.text.caption} font-semibold text-neutral-400 dark:border-white/10`}>Running…</span>
              )}
            </div>

            <div className="p-3">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-[12px] font-bold text-neutral-500 dark:border-white/10 dark:bg-white/5">
                  PW
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-white">Pune wholesaler</p>
                  <p className={`${ds.text.caption} text-neutral-500 dark:text-white/45`}>ORD-4821 · Pune Region</p>
                </div>
              </div>

              <div className="mb-3 rounded-lg border border-neutral-200 bg-white p-3.5 dark:border-white/8 dark:bg-white/[0.04]">
                <div className={`flex justify-between ${ds.text.bodySmall}`}>
                  <span className="text-neutral-500 dark:text-white/55">Credit limit</span>
                  <span className="font-semibold tabular-nums text-neutral-800 dark:text-white">₹15,00,000</span>
                </div>
                <div className={`mt-1 flex justify-between ${ds.text.bodySmall}`}>
                  <span className="text-neutral-500 dark:text-white/55">Available</span>
                  <span className="font-semibold tabular-nums text-neutral-800 dark:text-white">₹6,58,000</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-neutral-900 dark:bg-white" style={{ width: "56%" }} />
                </div>
                <p className={`mt-2 ${ds.text.caption} text-neutral-600 dark:text-white/55`}>Order value ₹50,900 — 56% of available limit</p>
              </div>

              <div className="space-y-1.5">
                {CREDIT_ROWS.map((c, i) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 dark:border-white/8 dark:bg-white/[0.03]"
                  >
                    <RowIcon s={rowStatus[i] ?? "pending"} />
                    <div className="min-w-0">
                      <p className={`${ds.text.bodySmall} font-semibold text-neutral-800 dark:text-white`}>{c.label}</p>
                      <p className={`${ds.text.caption} text-neutral-500 dark:text-white/45`}>{c.detail}</p>
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

function BetterMark() {
  return (
    <svg viewBox="0 0 10 10" className="ml-1 inline-block h-2.5 w-2.5 shrink-0" fill="none">
      <circle cx="5" cy="5" r="5" fill="#22c55e" />
      <path d="M3 5l1.5 1.5 3-3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Price / metric cell — two stacked rows: struck original (always present, invisible until
 *  price differs) + current value.  Height never changes so the card never shifts. */
function NegotiationMetricValueCell({
  displayValue,
  showTick,
  reduceMotion,
  struckValue,
}: {
  displayValue: string;
  showTick: boolean;
  reduceMotion: boolean | null;
  struckValue?: string | null;
}) {
  const hasVisibleStruck = struckValue != null && struckValue !== displayValue;

  return (
    <div className="mt-0.5 space-y-0.5">
      <div className="flex items-center gap-1">
        <motion.span
          key={displayValue}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`${ds.text.bodySmall} font-semibold tabular-nums text-neutral-900 dark:text-white`}
        >
          {displayValue}
        </motion.span>
        {showTick && (
          <motion.span
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduceMotion ? undefined : { type: "spring", stiffness: 480, damping: 26, delay: 0.08 }}
            className="inline-flex"
          >
            <BetterMark />
          </motion.span>
        )}
      </div>
      {/* Struck row below — always in DOM when struckValue provided, transparent until price changes */}
      {struckValue != null && (
        <span
          className={`${ds.text.bodySmall} block font-semibold tabular-nums line-through transition-all duration-500 ${
            hasVisibleStruck
              ? "text-neutral-400 decoration-neutral-400/80 dark:text-white/40 dark:decoration-white/35"
              : "select-none text-transparent decoration-transparent"
          }`}
          aria-hidden={!hasVisibleStruck}
        >
          {struckValue}
        </span>
      )}
    </div>
  );
}

function StatusBarLoadingDots({
  reduceMotion,
  className,
}: {
  reduceMotion: boolean;
  className?: string;
}) {
  if (reduceMotion) {
    return (
      <span className={cn("inline text-neutral-500 dark:text-white/45", className)} aria-hidden>
        …
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-0.5 pl-0.5", className)} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full bg-neutral-400 dark:bg-white/45"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.05, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function ExecuteVisual1() {
  const reduceMotion = useReducedMotion();
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  const [phase, setPhase] = useState<"negotiate" | "selected">(reduceMotion ? "selected" : "negotiate");
  const [quoteBeat, setQuoteBeat] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("selected");
      return;
    }
    if (!isVisible) return;
    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setPhase("negotiate");
        setQuoteBeat(0);
        await wait(11_000);
        if (cancelled) break;
        setPhase("selected");
        await wait(6000);
        if (cancelled) break;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion, isVisible]);

  useEffect(() => {
    if (reduceMotion || phase !== "negotiate") return;
    let cancelled = false;
    (async () => {
      setQuoteBeat(0);
      await wait(3000);
      if (cancelled) return;
      setQuoteBeat(1);
      await wait(4200);
      if (cancelled) return;
      setQuoteBeat(2);
    })();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion, phase]);

  const vendors = useMemo(() => {
    const tata = { vendor: "Tata Coffee Plantations", badge: "TC", rating: 4.6, orders: 142, delivery: "22 hrs", onTime: "98.4%", quality: "Grade A+", channels: ["wa", "call"] as const };
    const ccl = { vendor: "CCL Products India", badge: "CC", rating: 4.8, orders: 218, delivery: "30 hrs", onTime: "96.2%", quality: "Grade A", channels: ["email", "wa"] as const };
    const tataOriginal = 285;
    const cclOriginal = 278;
    let tataPrice = tataOriginal;
    let cclPrice = cclOriginal;
    if (phase === "selected" || quoteBeat === 2) {
      tataPrice = 280;
      cclPrice = 268;
    } else if (quoteBeat === 1) {
      cclPrice = 272;
    }
    return [
      { ...tata, pricePerKg: tataPrice, originalPricePerKg: tataOriginal },
      { ...ccl, pricePerKg: cclPrice, originalPricePerKg: cclOriginal },
    ];
  }, [phase, quoteBeat]);

  const betterPrice = vendors[0].pricePerKg <= vendors[1].pricePerKg ? 0 : 1;
  const betterDelivery = 0;
  const betterOnTime = 0;
  const betterQuality = 0;

  const statusBarText =
    phase === "selected"
      ? "CCL Products selected · ₹268/kg · 30hr delivery"
      : quoteBeat >= 2
        ? "Evaluating best match"
        : "Negotiation in progress";

  function ChannelIcon({ kind }: { kind: "wa" | "call" | "email" }) {
    const cls =
      "flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200/80 bg-white dark:border-white/12 dark:bg-white/[0.06]";
    if (kind === "wa") {
      return (
        <span className={cls} aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#22c55e">
            <path d="M20.5 3.5A11 11 0 0 0 3.4 17.7L2 22l4.4-1.4A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.8.9-2.5-.2-.3A9 9 0 1 1 12 20.5Zm5-6.7c-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.2-.6.1l-.8 1c-.2.2-.3.3-.6.1a7.4 7.4 0 0 1-3.6-3.2c-.3-.5.3-.5.7-1.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.7.2.2 1.8 2.7 4.4 3.8 1.6.6 2.3.7 3.1.6.5 0 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.6-.4Z" />
          </svg>
        </span>
      );
    }
    if (kind === "call") {
      return (
        <span className={cls} aria-label="Call">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
        </span>
      );
    }
    return (
      <span className={cls} aria-label="Email">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </span>
    );
  }

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px] space-y-3 pt-0.5">
        {vendors.map((v, idx) => {
          const isSelected = phase === "selected" && idx === 1;
          const cardCls = isSelected
            ? "border-emerald-400/60 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-emerald-500/35 dark:bg-[#0c0c0c]"
            : "border-neutral-200/90 bg-[#fafafa] dark:border-white/10 dark:bg-[#0a0a0a]";
          const inNegotiation = phase === "negotiate";
          const statusLabel = isSelected ? "Selected" : inNegotiation ? "Negotiating" : "Evaluating";
          const statusCls = isSelected
            ? "border-emerald-400/50 bg-emerald-500 text-white dark:border-emerald-500/50"
            : inNegotiation
              ? "border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300"
              : "border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70";

          const priceLabel = `₹${v.pricePerKg} / kg`;
          const struckPrice = `₹${v.originalPricePerKg} / kg`;
          const metrics = [
            { label: "Price / kg", value: priceLabel, struckPrior: struckPrice, isBetter: idx === betterPrice },
            { label: "Delivery", value: v.delivery, struckPrior: null as string | null, isBetter: idx === betterDelivery },
            { label: "On-time", value: v.onTime, struckPrior: null as string | null, isBetter: idx === betterOnTime },
            { label: "Quality", value: v.quality, struckPrior: null as string | null, isBetter: idx === betterQuality },
          ];

          return (
            <motion.div
              key={v.vendor}
              className={`rounded-xl border px-4 py-4 transition-colors duration-500 ${cardCls}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reduceMotion ? undefined : { duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                        : "bg-neutral-100 text-neutral-600 dark:bg-white/[0.06] dark:text-white/75"
                    }`}
                  >
                    {v.badge}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{v.vendor}</p>
                    <div className={`mt-0.5 flex items-center gap-2 ${ds.text.caption} text-neutral-500 dark:text-white/55`}>
                      <span className="inline-flex items-center gap-0.5">
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-amber-500" fill="currentColor">
                          <path d="M6 1l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.8 2.9 10.4l.7-3.4L1 4.6l3.5-.4z" />
                        </svg>
                        <span className="font-semibold tabular-nums text-neutral-700 dark:text-white/75">{v.rating}</span>
                      </span>
                      <span className="text-neutral-300 dark:text-white/20">·</span>
                      <span className="tabular-nums">{v.orders} past orders</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {v.channels.map((c) => (
                    <ChannelIcon key={c} kind={c} />
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {metrics.map((m) => {
                  const showTick = phase === "selected" && m.isBetter;
                  return (
                    <div
                      key={m.label}
                      className="rounded-md border border-neutral-200/80 bg-white px-2 py-1.5 dark:border-white/8 dark:bg-white/[0.03]"
                    >
                      <p className={`${ds.text.caption} font-semibold uppercase tracking-wider text-neutral-400`}>{m.label}</p>
                      <NegotiationMetricValueCell
                        displayValue={m.value}
                        struckValue={m.struckPrior}
                        showTick={showTick}
                        reduceMotion={!!reduceMotion}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-end">
                <motion.span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 ${ds.text.caption} font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${statusCls}`}
                  animate={
                    reduceMotion
                      ? undefined
                      : isSelected
                        ? { scale: [1, 1.03, 1] }
                        : undefined
                  }
                  transition={
                    reduceMotion ? undefined : isSelected ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                      isSelected
                        ? "bg-white"
                        : inNegotiation
                          ? "animate-pulse bg-amber-500 dark:bg-amber-400"
                          : "bg-neutral-400 dark:bg-white/40"
                    }`}
                  />
                  {statusLabel}
                </motion.span>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-busy={phase === "negotiate"}
          className="mt-1 flex items-center gap-2 rounded-lg border border-neutral-200/90 bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#0c0c0c]"
        >
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={statusBarText}
                className={`flex min-w-0 items-center ${ds.text.bodySmall} font-medium text-neutral-800 dark:text-white/90`}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="min-w-0 truncate">{statusBarText}</span>
                {phase === "negotiate" && (
                  <StatusBarLoadingDots reduceMotion={!!reduceMotion} className="shrink-0 translate-y-px" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {phase === "selected" && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                aria-label="Confirm choice"
              >
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="M2.5 6L5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/90 bg-neutral-50 text-neutral-600 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/75 dark:hover:bg-white/[0.1]"
                aria-label="More actions"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <circle cx="8" cy="3.5" r="1.35" />
                  <circle cx="8" cy="8" r="1.35" />
                  <circle cx="8" cy="12.5" r="1.35" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ── EXECUTE VISUAL 2 — Manufacturer production pipeline ──── */
function ExecuteVisual2() {
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  const manufacturerSteps = [
    { title: "Order received", sub: "ORD-4821 · Pune wholesaler · Nescafe + Maggi lines" },
    { title: "Low-stock signal raised", sub: "Nescafe Sunrise (SKU-302) below safety cover for 80 ctns" },
    { title: "Procurement order placed", sub: "Soluble coffee base from CCL Products India — ties to SKU-302 gap" },
    { title: "Inventory reservation posted", sub: "Sunrise −80 ctns · Maggi Noodles −120 ctns allocated" },
    { title: "Manufacturing scheduled", sub: "Line A · Nescafe Sunrise WO-9921 · May 9, 6 AM slot" },
    { title: "Logistics scheduled", sub: "Pune WH-A → Pune wholesaler · Thu 10:45 AM pickup" },
    { title: "ETA calculated", sub: "Arrive Thu 1:20 PM — synced to plant dispatch board" },
    { title: "Confirmation sent", sub: "WhatsApp & email to buyer with committed window", channelIcons: true },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % manufacturerSteps.length);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [isVisible, manufacturerSteps.length]);

  const plannedPct = Math.round((Math.min(activeStep, manufacturerSteps.length - 1) / (manufacturerSteps.length - 1)) * 50);
  const tagCls =
    "bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm ring-0 dark:bg-violet-500";

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[460px]">
        <div className="relative rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
          <span
            className={`pointer-events-none absolute left-4 top-0 z-30 max-w-[calc(100%-8.5rem)] -translate-y-1/2 truncate rounded-full px-2.5 py-1 text-xs font-semibold leading-snug shadow-sm ${tagCls}`}
          >
            Manufacturer view
          </span>
          <span className="pointer-events-none absolute right-4 top-0 z-30 -translate-y-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm dark:bg-emerald-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              Synced
            </span>
          </span>
          <div className="border-b border-neutral-100 px-4 pt-5 pb-2.5 dark:border-white/5">
            <div className="flex items-start gap-2 pr-14">
              <LogoBadge size="sm" animated />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-800 dark:text-white">Production & dispatch timeline</p>
                <p className={`${ds.text.caption} text-neutral-400`}>From order commit through buyer ETA</p>
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="flex flex-col">
              {manufacturerSteps.map((s, i) => (
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
                    {i < manufacturerSteps.length - 1 ? (
                      <div
                        className={`mx-auto mt-1 min-h-[18px] w-px flex-1 rounded-full transition-colors duration-500 ${
                          i < activeStep ? "bg-emerald-300 dark:bg-emerald-400/70" : "bg-neutral-200 dark:bg-white/10"
                        }`}
                      />
                    ) : null}
                  </div>
                  <div className={`min-w-0 flex-1 leading-snug ${i < manufacturerSteps.length - 1 ? "pb-2.5" : ""}`}>
                    <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-neutral-900 dark:text-white">
                      <span>{s.title}</span>
                      {s.channelIcons ? (
                        <span
                          className="inline-flex items-center gap-0.5"
                          aria-label="WhatsApp and email"
                        >
                          <img src="/icons/whatsapp.png" alt="" className="h-3.5 w-3.5 object-contain" />
                          <img src="/icons/gmail.png" alt="" className="h-3.5 w-3.5 object-contain" />
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-600 dark:text-white/55">{s.sub}</p>
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

/* ── EXECUTE VISUAL 3 — Dispatch summary card (staged reveal) ── */
function ExecuteVisual3() {
  const reduceMotion = useReducedMotion();
  const visRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibleInViewport(visRef);
  /* stage: 0 = loading shell, 1 = route, 2 = vehicle+rate, 3 = timeline, 4 = confirmation */
  const [stage, setStage] = useState(reduceMotion ? 4 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setStage(4);
      return;
    }
    if (!isVisible) return;

    let cancelled = false;
    (async () => {
      while (!cancelled) {
        setStage(0);
        await wait(1500);
        if (cancelled) break;
        setStage(1);
        await wait(1500);
        if (cancelled) break;
        setStage(2);
        await wait(2000);
        if (cancelled) break;
        setStage(3);
        await wait(2000);
        if (cancelled) break;
        setStage(4);
        /* Hold final state then loop */
        await wait(4000);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion, isVisible]);

  const stageMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } as const,
      };

  return (
    <div ref={visRef} className="flex h-full w-full items-center justify-center px-6 sm:px-10">
      <div className="w-full max-w-[400px]">
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <LogoBadge size="sm" animated={stage < 4} />
              <span className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-white">
                Dispatch coordination
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`${ds.text.caption} font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400`}>
                Live
              </span>
            </span>
          </div>

          {/* ── Stage 0: Loading state ─────────────────────────────── */}
          {stage === 0 && !reduceMotion && (
            <motion.div
              className="flex items-center justify-center gap-2 px-4 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MiniSpinner className="text-neutral-400 dark:text-white/40" />
              <span className={`${ds.text.bodySmall} text-neutral-500 dark:text-white/50`}>
                Coordinating dispatch...
              </span>
            </motion.div>
          )}

          {/* ── Stage 1+: Route section ────────────────────────────── */}
          {stage >= 1 && (
            <motion.div
              className="border-b border-neutral-200/80 px-4 py-3 dark:border-white/10"
              {...stageMotion}
            >
              <p className={`${ds.text.caption} font-semibold uppercase tracking-[0.1em] text-neutral-400 dark:text-white/35`}>
                Route
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800 dark:text-white">Pune WH-A</span>
                <div className="flex flex-1 items-center gap-0">
                  <div className="h-px flex-1 bg-neutral-300 dark:bg-white/20" />
                  <svg viewBox="0 0 8 8" className="h-2 w-2 shrink-0 text-neutral-400 dark:text-white/30">
                    <path d="M1 1l5 3-5 3" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-neutral-800 dark:text-white">Pune wholesaler</span>
              </div>
              <p className={`mt-1.5 ${ds.text.caption} text-neutral-500 dark:text-white/45`}>
                42 km &middot; Primary freight
              </p>
            </motion.div>
          )}

          {/* ── Stage 2+: Vehicle + Rate ───────────────────────────── */}
          {stage >= 2 && (
            <motion.div
              className="grid grid-cols-2 border-b border-neutral-200/80 dark:border-white/10"
              {...stageMotion}
            >
              <div className="border-r border-neutral-200/80 px-4 py-3 dark:border-white/10">
                <p className={`${ds.text.caption} font-semibold uppercase tracking-[0.1em] text-neutral-400 dark:text-white/35`}>
                  Vehicle
                </p>
                <p className="mt-1.5 text-sm font-bold tracking-wide text-neutral-800 dark:text-white">
                  MH12AB4578
                </p>
                <p className={`mt-0.5 ${ds.text.caption} text-neutral-500 dark:text-white/45`}>
                  32ft container
                </p>
              </div>
              <div className="px-4 py-3">
                <p className={`${ds.text.caption} font-semibold uppercase tracking-[0.1em] text-neutral-400 dark:text-white/35`}>
                  Rate
                </p>
                <p className="mt-1.5 text-sm font-bold text-neutral-800 dark:text-white">
                  ₹14,800
                </p>
                <p className={`mt-0.5 flex items-center gap-1 ${ds.text.caption} text-emerald-600 dark:text-emerald-400`}>
                  Negotiated <BetterMark />
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Stage 3+: Timeline ─────────────────────────────────── */}
          {stage >= 3 && (
            <motion.div
              className="border-b border-neutral-200/80 px-4 py-3 dark:border-white/10"
              {...stageMotion}
            >
              <div className="flex gap-3">
                {/* Vertical timeline track */}
                <div className="flex flex-col items-center pt-0.5">
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-neutral-900" />
                  <div className="w-px flex-1 bg-neutral-300 dark:bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-neutral-300 bg-white dark:border-white/25 dark:bg-neutral-900" />
                </div>
                {/* Timeline content */}
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <p className={`${ds.text.caption} font-medium text-neutral-500 dark:text-white/45`}>Pickup</p>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-white">Thu 10:45 AM</p>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={reduceMotion ? { width: "65%" } : { width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: reduceMotion ? 0 : 1.4, ease: "easeOut", delay: reduceMotion ? 0 : 0.3 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${ds.text.caption} font-medium text-neutral-500 dark:text-white/45`}>Delivery</p>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-white">Thu 1:20 PM</p>
                    </div>
                    <span className={`${ds.text.caption} rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-neutral-500 dark:bg-white/[0.06] dark:text-white/45`}>
                      ~2h 35m
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Stage 4: Confirmation ──────────────────────────────── */}
          {stage >= 4 && (
            <motion.div
              className="flex items-center justify-between px-4 py-3"
              {...stageMotion}
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 14 14" className="h-4 w-4 shrink-0" fill="none">
                  <circle cx="7" cy="7" r="7" fill="#22c55e" />
                  <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Buyer notified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-50 dark:bg-white/[0.06]">
                  <Image src={iconSrc("whatsapp.png")} alt="WhatsApp" width={16} height={16} className="h-4 w-4" />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-50 dark:bg-white/[0.06]">
                  <Image src={iconSrc("gmail.png")} alt="Email" width={16} height={16} className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

const VISUALS: React.FC[] = [
  CaptureVisual1, CaptureVisual2,
  ProcessVisual1, ProcessVisual2,
  ExecuteVisual1, ExecuteVisual2, ExecuteVisual3,
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
                            <div className="block w-full">
                              <button
                                type="button"
                                onClick={() => scrollToPanel(gi)}
                                className="block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-[#0a0a0a]"
                              >
                                <div className="mb-3 flex items-center gap-3">
                                  <StepNumber num={si + 1} progress={stepProgress[gi] ?? 0} />
                                  <p className="min-w-0 text-[17px] font-semibold leading-snug text-neutral-900 dark:text-white">
                                    {step.title}
                                  </p>
                                </div>
                                <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-white/55">
                                  {step.description}
                                </p>
                              </button>
                              <div className="mt-4 h-[320px] select-none overflow-hidden rounded-xl border border-neutral-200 bg-[#fafaf9] dark:border-white/10 dark:bg-neutral-900/50">
                                <div className="flex h-full w-full items-start justify-center pt-2">
                                  <div className="origin-top scale-[0.58]">
                                    <Visual />
                                  </div>
                                </div>
                              </div>
                            </div>
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
