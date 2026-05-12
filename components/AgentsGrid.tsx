"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import TrackedFocusRegion from "@/components/TrackedFocusRegion";
import { analyticsSlugFromLabel } from "@/lib/analyticsIds";
import { ds } from "@/lib/design-system";
import { IoLogoWhatsapp } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import {
  FiPhone,
  FiTable,
  FiTruck,
  FiPackage,
  FiSettings,
  FiUsers,
  FiBookOpen,
  FiDatabase,
  FiBriefcase,
  FiShoppingCart,
  FiShoppingBag,
  FiTool,
  FiSend,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

/* ── data ─────────────────────────────────────────────────────────── */

const INPUT_CHANNELS = [
  { label: "WhatsApp", icon: IoLogoWhatsapp, color: "text-green-600 dark:text-green-400" },
  { label: "Gmail", icon: SiGmail, color: "text-red-500 dark:text-red-400" },
  { label: "Excel / Sheets", icon: FiTable, color: "text-green-700 dark:text-green-500" },
  { label: "Phone", icon: FiPhone, color: "text-neutral-600 dark:text-neutral-400" },
] as const;

const STACK_ITEMS = [
  { label: "Tally", icon: FiBookOpen, color: "text-amber-600 dark:text-amber-500" },
  { label: "SAP", icon: FiDatabase, color: "text-blue-600 dark:text-blue-400" },
  { label: "Zoho", icon: FiBriefcase, color: "text-red-500 dark:text-red-400" },
  { label: "Excel", icon: FiTable, color: "text-green-700 dark:text-green-500" },
] as const;

const FIELD_ITEMS = [
  { label: "Drivers", icon: FiTruck, color: "text-neutral-600 dark:text-white/60" },
  { label: "Warehouse", icon: FiPackage, color: "text-neutral-600 dark:text-white/60" },
  { label: "Factory", icon: FiSettings, color: "text-neutral-600 dark:text-white/60" },
  { label: "Sales reps", icon: FiUsers, color: "text-neutral-600 dark:text-white/60" },
] as const;

const OUTCOMES = [
  "Faster turnaround",
  "Fewer errors",
  "On-time dispatch",
  "Lower working capital",
] as const;

const MECHANISM_OPS = [
  { label: "Order capture", icon: FiShoppingCart },
  { label: "Procurement", icon: FiShoppingBag },
  { label: "Production planning", icon: FiTool },
  { label: "Dispatch & logistics", icon: FiSend },
  { label: "Credit & compliance", icon: FiShield },
  { label: "Demand forecasting", icon: FiTrendingUp },
] as const;

/* ── pills ────────────────────────────────────────────────────────── */

function IconPill({
  label,
  icon: Icon,
  color,
  index,
  inView,
  fromLeft = true,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  index: number;
  inView: boolean;
  fromLeft?: boolean;
}) {
  return (
    <TrackedFocusRegion
      focusRegion="agents"
      focusItemId={analyticsSlugFromLabel(label)}
      focusItemLabel={label}
    >
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -12 : 12 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: fromLeft ? -12 : 12 }}
        transition={{ duration: 0.4, delay: 0.06 * index }}
        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 ${ds.border.color} bg-white dark:bg-white/[0.03]`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${color ?? "text-neutral-500 dark:text-white/55"}`} />
        <span className="truncate text-sm font-medium text-neutral-800 dark:text-white/85">
          {label}
        </span>
      </motion.div>
    </TrackedFocusRegion>
  );
}

function DotPill({
  label,
  index,
  inView,
}: {
  label: string;
  index: number;
  inView: boolean;
}) {
  return (
    <TrackedFocusRegion
      focusRegion="agents"
      focusItemId={analyticsSlugFromLabel(label)}
      focusItemLabel={label}
    >
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
        transition={{ duration: 0.4, delay: 0.06 * index }}
        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 ${ds.border.color} bg-white dark:bg-white/[0.03]`}
      >
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70 dark:bg-emerald-400/60" />
        <span className="text-sm font-medium leading-snug text-neutral-800 dark:text-white/85">
          {label}
        </span>
      </motion.div>
    </TrackedFocusRegion>
  );
}

/* ── connectors ───────────────────────────────────────────────────── */

function HorizontalArrow({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden shrink-0 items-center px-1 lg:flex"
      aria-hidden
    >
      <div className="flex items-center gap-1">
        <div className="w-7 border-t border-dashed border-neutral-500 dark:border-white/40" />
        <svg width="8" height="10" viewBox="0 0 8 10" className="text-neutral-500 dark:text-white/45">
          <path d="M8 5L0 0v10z" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}

function VerticalArrow({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center py-1"
      aria-hidden
    >
      <div className="flex flex-col items-center gap-1">
        <div className="h-6 w-px border-l border-dashed border-neutral-500 dark:border-white/40" />
        <svg width="10" height="8" viewBox="0 0 10 8" className="text-neutral-500 dark:text-white/45">
          <path d="M5 8L0 0h10z" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── mechanism (side-arrow into Our AI) ───────────────────────────── */

function MechanismBlock({ inView, compact = false }: { inView: boolean; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center"
    >
      <p className={`mb-2 whitespace-nowrap ${ds.text.mono} tracking-[0.14em]`}>AI ops team</p>
      <div
        className={`rounded-lg border border-dashed ${ds.border.color} bg-white/40 dark:bg-white/[0.02] ${
          compact ? "px-3.5 py-2.5" : "px-5 py-3"
        }`}
      >
        <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-2">
          {MECHANISM_OPS.map(({ label, icon: Icon }) => (
            <TrackedFocusRegion
              key={label}
              focusRegion="agents"
              focusItemId={analyticsSlugFromLabel(label)}
              focusItemLabel={label}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-white/55" />
                <span className="whitespace-nowrap text-[13px] leading-tight text-neutral-700 dark:text-white/70">
                  {label}
                </span>
              </div>
            </TrackedFocusRegion>
          ))}
        </div>
      </div>

      {/* labeled down-arrow into hub */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <div className="h-4 w-px border-l border-dashed border-neutral-500 dark:border-white/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-600 dark:text-white/55">
          mechanism
        </span>
        <div className="h-4 w-px border-l border-dashed border-neutral-500 dark:border-white/40" />
        <svg width="10" height="8" viewBox="0 0 10 8" className="text-neutral-500 dark:text-white/45">
          <path d="M5 8L0 0h10z" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── hub ──────────────────────────────────────────────────────────── */

function Hub({ inView, className = "" }: { inView: boolean; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`flex flex-col items-center justify-center rounded-xl border ${ds.border.color} bg-neutral-50 px-6 py-7 dark:bg-white/[0.03] ${className}`}
    >
      <TrackedFocusRegion
        focusRegion="agents"
        focusItemId="rbd_agents_hub"
        focusItemLabel="RBD Agents Hub"
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`${ds.badge.success} gap-1.5 py-0.5 pl-1.5 pr-2.5`}>
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative inline-block h-7 w-7 shrink-0">
              <Image
                src="/logo.png"
                alt="Rigid Body Dynamics"
                fill
                sizes="28px"
                className="block object-contain dark:hidden"
              />
              <Image
                src="/logowhite.png"
                alt=""
                fill
                sizes="28px"
                className="hidden object-contain dark:block"
                aria-hidden
              />
            </span>
            <h3 className="text-xl font-semibold text-neutral-950 dark:text-white">
              Agents
            </h3>
          </div>
          <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-white/50">
            Always-on AI workforce
          </p>
        </div>
      </TrackedFocusRegion>
    </motion.div>
  );
}

/* ── column wrapper ───────────────────────────────────────────────── */

function Column({
  label,
  width,
  children,
}: {
  label: string;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex shrink-0 flex-col gap-2 ${width}`}>
      <p className={`mb-1 ${ds.text.mono} tracking-[0.14em]`}>{label}</p>
      {children}
    </div>
  );
}

/* ── main component ───────────────────────────────────────────────── */

export default function AgentsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-background pb-16 dark:bg-black sm:pb-24 sm:pt-10">
      <div className={ds.layout.sectionPx}>
        <div >
          <h2 className={`max-w-3xl ${ds.text.sectionHeading}`}>
            One ops team that never sleeps.
          </h2>
          <p className={`mt-3 max-w-xl ${ds.text.sectionDesc}`}>
            Same channels and sheets—agents run the work continuously. Reduce operational load today and unlock rapid growth tomorrow.
          </p>
        </div>

        <div ref={ref} className="mt-10 sm:mt-14">
          {/* ── Desktop: horizontal flow ─────────────────────────── */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:pt-44">
            {/* Channels */}
            <Column label="Channels in" width="w-[168px]">
              {INPUT_CHANNELS.map((ch, i) => (
                <IconPill key={ch.label} {...ch} index={i} inView={inView} fromLeft />
              ))}
            </Column>

            <HorizontalArrow inView={inView} />

            {/* AI column: hub on the row, mechanism floats above it */}
            <div className="relative shrink-0">
              <div className="pointer-events-auto absolute bottom-full left-1/2 z-10 w-max -translate-x-1/2 pb-1">
                <MechanismBlock inView={inView} />
              </div>
              <Hub inView={inView} className="w-[208px]" />
            </div>

            <HorizontalArrow inView={inView} />

            {/* Your stack */}
            <Column label="Your stack" width="w-[140px]">
              {STACK_ITEMS.map((it, i) => (
                <IconPill key={it.label} {...it} index={i} inView={inView} fromLeft={false} />
              ))}
            </Column>

            <HorizontalArrow inView={inView} />

            {/* Field */}
            <Column label="Field" width="w-[150px]">
              {FIELD_ITEMS.map((it, i) => (
                <IconPill key={it.label} {...it} index={i} inView={inView} fromLeft={false} />
              ))}
            </Column>

            <HorizontalArrow inView={inView} />

            {/* Outcomes */}
            <Column label="Outcomes" width="w-[180px]">
              {OUTCOMES.map((o, i) => (
                <DotPill key={o} label={o} index={i} inView={inView} />
              ))}
            </Column>
          </div>

          {/* ── Mobile: vertical flow ────────────────────────────── */}
          <div className="flex flex-col items-center lg:hidden">
            {/* Channels */}
            <div className="w-full max-w-sm">
              <p className={`mb-2 text-center ${ds.text.mono} tracking-[0.14em]`}>Channels in</p>
              <div className="grid grid-cols-2 gap-2">
                {INPUT_CHANNELS.map((ch, i) => (
                  <IconPill key={ch.label} {...ch} index={i} inView={inView} />
                ))}
              </div>
            </div>

            <VerticalArrow inView={inView} />

            {/* Mechanism block (side-arrow into Our AI) */}
            <MechanismBlock inView={inView} compact />

            {/* Hub */}
            <Hub inView={inView} className="w-full max-w-[260px]" />

            <VerticalArrow inView={inView} />

            {/* Your stack */}
            <div className="w-full max-w-sm">
              <p className={`mb-2 text-center ${ds.text.mono} tracking-[0.14em]`}>Your stack</p>
              <div className="grid grid-cols-2 gap-2">
                {STACK_ITEMS.map((it, i) => (
                  <IconPill key={it.label} {...it} index={i} inView={inView} />
                ))}
              </div>
            </div>

            <VerticalArrow inView={inView} />

            {/* Field */}
            <div className="w-full max-w-sm">
              <p className={`mb-2 text-center ${ds.text.mono} tracking-[0.14em]`}>Field</p>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_ITEMS.map((it, i) => (
                  <IconPill key={it.label} {...it} index={i} inView={inView} />
                ))}
              </div>
            </div>

            <VerticalArrow inView={inView} />

            {/* Outcomes */}
            <div className="w-full max-w-sm">
              <p className={`mb-2 text-center ${ds.text.mono} tracking-[0.14em]`}>Outcomes</p>
              <div className="grid grid-cols-2 gap-2">
                {OUTCOMES.map((o, i) => (
                  <DotPill key={o} label={o} index={i} inView={inView} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
