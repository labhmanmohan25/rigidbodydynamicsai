"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { ds, cn } from "@/lib/design-system";
import {
  TbPick,
  TbBuildingFactory2,
  TbTruck,
  TbBuildingWarehouse,
  TbShoppingCart,
  TbUser,
} from "react-icons/tb";

/* ── seeded PRNG for deterministic chart data ────────────────────── */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/* ── time-series generation ──────────────────────────────────────── */

type Tier = {
  label: string;
  yLabel: string;
};

const TIERS: Tier[] = [
  { label: "Consumer Sales at Retailer", yLabel: "Consumer Demand" },
  { label: "Retailer Orders to Wholesaler", yLabel: "Retailer Order" },
  { label: "Wholesaler Orders to Manufacturer", yLabel: "Wholesaler Order" },
  { label: "Manufacturer Orders with Supplier", yLabel: "Manufacturer Order" },
];

const NUM_POINTS = 40;
const BASE_DEMAND = 200;
const Y_MAX = 1000;

const SUPPLY_CHAIN_STEPS = [
  { label: "Supplier", icon: <TbPick /> },
  { label: "Manufacturer", icon: <TbBuildingFactory2 /> },
  { label: "Distributor", icon: <TbTruck /> },
  { label: "Wholesaler", icon: <TbBuildingWarehouse /> },
  { label: "Retailer", icon: <TbShoppingCart /> },
  { label: "Consumer", icon: <TbUser /> },
];

function generateWithoutData(tierIndex: number, seed: number): number[] {
  const rng = seededRandom(seed + tierIndex * 1000);
  const points: number[] = [];

  const volatility = [18, 65, 140, 250][tierIndex];
  const drift = [0, 30, 60, 50][tierIndex];
  const spikiness = [0, 0.08, 0.15, 0.25][tierIndex];

  let prev = BASE_DEMAND + drift;
  for (let i = 0; i < NUM_POINTS; i++) {
    const noise = (rng() - 0.5) * 2 * volatility;
    const spike = rng() < spikiness ? (rng() - 0.3) * volatility * 2.5 : 0;
    const momentum = i > 0 ? (prev - (BASE_DEMAND + drift)) * 0.15 : 0;
    let val = prev + noise + spike - momentum;
    val = Math.max(10, Math.min(Y_MAX - 20, val));
    points.push(Math.round(val));
    prev = val;
  }
  return points;
}

function generateWithData(tierIndex: number, seed: number): number[] {
  const rng = seededRandom(seed + tierIndex * 2000 + 999);
  const points: number[] = [];

  const volatility = [18, 22, 26, 30][tierIndex];
  const drift = [0, 5, 10, 15][tierIndex];

  let prev = BASE_DEMAND + drift;
  for (let i = 0; i < NUM_POINTS; i++) {
    const noise = (rng() - 0.5) * 2 * volatility;
    const momentum = i > 0 ? (prev - (BASE_DEMAND + drift)) * 0.25 : 0;
    let val = prev + noise - momentum;
    val = Math.max(BASE_DEMAND - 60, Math.min(BASE_DEMAND + 100, val));
    points.push(Math.round(val));
    prev = val;
  }
  return points;
}

/* ── SVG mini chart ──────────────────────────────────────────────── */

const CHART_W = 320;
const CHART_H = 140;
const PAD_L = 44;
const PAD_R = 8;
const PAD_T = 28;
const PAD_B = 28;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

const Y_TICKS = [0, 200, 400, 600, 800, 1000];

function pointsToPath(data: number[]): string {
  return data
    .map((val, i) => {
      const x = PAD_L + (i / (data.length - 1)) * PLOT_W;
      const y = PAD_T + (1 - val / Y_MAX) * PLOT_H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function MiniChart({
  data,
  tier,
  tierIndex,
  inView,
  variant,
}: {
  data: number[];
  tier: Tier;
  tierIndex: number;
  inView: boolean;
  variant: "without" | "with";
}) {
  const d = useMemo(() => pointsToPath(data), [data]);

  const isWithout = variant === "without";
  const delay = 0.12 * tierIndex;

  const variance = useMemo(() => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const sqDiffs = data.map((v) => (v - mean) ** 2);
    return Math.round(Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / data.length));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "border overflow-hidden",
        "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]"
      )}
    >
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* title */}
        <text
          x={CHART_W / 2}
          y={14}
          textAnchor="middle"
          className="fill-neutral-700 dark:fill-white/70"
          fontSize="9"
          fontWeight="600"
        >
          {tier.label}
        </text>

        {/* grid lines */}
        {Y_TICKS.map((tick) => {
          const y = PAD_T + (1 - tick / Y_MAX) * PLOT_H;
          return (
            <line
              key={tick}
              x1={PAD_L}
              y1={y}
              x2={PAD_L + PLOT_W}
              y2={y}
              className="stroke-neutral-200/60 dark:stroke-white/5"
              strokeWidth={0.5}
            />
          );
        })}

        {/* x-axis label */}
        <text
          x={PAD_L + PLOT_W / 2}
          y={CHART_H - 3}
          textAnchor="middle"
          className="fill-neutral-600 dark:fill-white/60"
          fontSize="8.5"
          fontWeight="500"
        >
          Time (weeks)
        </text>

        {/* y-axis label */}
        <text
          x={10}
          y={PAD_T + PLOT_H / 2}
          textAnchor="middle"
          className="fill-neutral-600 dark:fill-white/60"
          fontSize="8"
          fontWeight="500"
          transform={`rotate(-90, 10, ${PAD_T + PLOT_H / 2})`}
        >
          {tier.yLabel}
        </text>

        {/* data line */}
        <motion.path
          d={d}
          fill="none"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            isWithout
              ? "stroke-neutral-800 dark:stroke-white/75"
              : "stroke-emerald-600 dark:stroke-emerald-400"
          )}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: { duration: 1.2, delay: delay + 0.2, ease: "easeOut" },
            opacity: { duration: 0.3, delay },
          }}
        />

        {/* variance badge */}
        <text
          x={CHART_W - PAD_R - 2}
          y={PAD_T + 10}
          textAnchor="end"
          className={cn(
            isWithout
              ? "fill-neutral-500 dark:fill-white/40"
              : "fill-emerald-600 dark:fill-emerald-400/70"
          )}
          fontSize="7"
          fontFamily="monospace"
        >
          σ = {variance}
        </text>
      </svg>
    </motion.div>
  );
}

/* ── chart panel (2×2 grid of mini charts) ───────────────────────── */

function ChartPanel({
  variant,
  inView,
}: {
  variant: "without" | "with";
  inView: boolean;
}) {
  const SEED = 42;
  const datasets = useMemo(
    () =>
      TIERS.map((_, i) =>
        variant === "without"
          ? generateWithoutData(i, SEED)
          : generateWithData(i, SEED)
      ),
    [variant]
  );

  const isWithout = variant === "without";

  return (
    <div>
      {/* panel heading */}
      <div className="mb-4 flex items-center gap-3">
        {isWithout ? (
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              "bg-neutral-400 dark:bg-white/30"
            )}
          />
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/70 dark:bg-emerald-400/50 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
          </span>
        )}
  
        <p className={cn(ds.text.mono, "tracking-[0.14em]")}>
          {isWithout ? "Without Rigid Body Dynamics" : "With Rigid Body Dynamics"}
        </p>
      </div>

      {/* 2×2 chart grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {TIERS.map((tier, i) => (
          <MiniChart
            key={tier.label}
            data={datasets[i]}
            tier={tier}
            tierIndex={i}
            inView={inView}
            variant={variant}
          />
        ))}
      </div>

      {/* summary stat */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className={cn(
          "mt-4 rounded-lg border px-4 py-3 text-center",
          isWithout
            ? "border-neutral-200 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.02]"
            : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]"
        )}
      >
        <p
          className={cn(
            "text-base sm:text-lg font-semibold",
            isWithout
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-900 dark:text-white"
          )}
        >
          {isWithout
            ? "14× larger planning errors"
            : "Decisions stay within 15% of real demand"}
        </p>
        <p className="text-sm text-neutral-500 dark:text-white/50 mt-1">
          {isWithout
            ? "Disconnected systems amplify small demand changes into major inventory and forecasting mistakes."
            : "Shared real-time data keeps forecasting and inventory decisions aligned across every partner."}
        </p>
   
      </motion.div>
    </div>
  );
}

/* ── main component ──────────────────────────────────────────────── */

export default function BullwhipEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      id="bullwhip"
      className="bg-background pb-16 dark:bg-black sm:pb-24 sm:pt-10"
    >
      <div className={ds.layout.sectionPx}>
        {/* heading */}
        <div className="mb-10 sm:mb-14">
          <h2 className={cn(ds.text.sectionHeading, "max-w-3xl mt-10")}>
            Every handoff in your supply chain costs you money.
          </h2>
          <p className={cn(ds.text.sectionDesc, "mt-3 max-w-xl")}>
          Retailer orders, inventory counts, and demand signals become delayed and distorted across the supply chain, causing forecasting errors and inventory swings.
          </p>
        </div>

        {/* supply chain flow with data sharing layer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 sm:mb-16"
        >
          {/* bidirectional arrow with label */}
          <div className="relative flex items-center h-10 mb-6">
            <svg className="flex-shrink-0 text-neutral-400 dark:text-white/30" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex-1 h-px bg-neutral-300 dark:bg-white/20" />
            <svg className="flex-shrink-0 text-neutral-400 dark:text-white/30" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-3 sm:px-4 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-[9px] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-neutral-700 dark:text-white/70 text-center leading-tight">
                Intelligent Data Sharing Layer
              </span>
            </div>
          </div>

          {/* supply chain steps — grid on mobile, inline on sm+ */}
          <div className="grid grid-cols-3 gap-y-5 sm:hidden">
            {SUPPLY_CHAIN_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                className="flex flex-col items-center gap-1.5 relative"
              >
                <div className="relative flex items-center justify-center">
                  {/* left arrow for items not in first column */}
                  {i % 3 !== 0 && (
                    <span className="absolute -left-4 text-neutral-600 dark:text-white/50 text-xs font-mono">‹</span>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-white/80 text-[20px]">
                    {step.icon}
                  </div>
                  {/* right arrow for items not in last column (within same row) */}
                  {i % 3 !== 2 && i < SUPPLY_CHAIN_STEPS.length - 1 && (
                    <span className="absolute -right-4 text-neutral-600 dark:text-white/50 text-xs font-mono">›</span>
                  )}
                </div>
                {/* down arrow between rows (last item in row 1) */}
                {i === 2 && (
                  <span className="absolute -bottom-3.5 text-neutral-600 dark:text-white/50 text-xs font-mono">↓</span>
                )}
                <span className="text-[10px] font-medium text-neutral-700 dark:text-white/70 text-center leading-tight">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="hidden sm:flex items-center justify-center">
            {SUPPLY_CHAIN_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                  className="flex flex-col items-center gap-2 w-[120px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-white/80 text-[24px]">
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium text-neutral-700 dark:text-white/70 text-center leading-tight">
                    {step.label}
                  </span>
                </motion.div>

                {i < SUPPLY_CHAIN_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                    className="flex items-center px-1 h-12"
                  >
                    <svg className="flex-shrink-0 text-neutral-600 dark:text-white/50" width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="w-8 h-px bg-neutral-500 dark:bg-white/35" />
                    <svg className="flex-shrink-0 text-neutral-600 dark:text-white/50" width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* two-column chart comparison */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          <ChartPanel variant="without" inView={inView} />
          <ChartPanel variant="with" inView={inView} />
        </div>
      </div>
    </section>
  );
}
