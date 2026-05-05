"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* ────────────────────────────────────────────────────────────────────────────
 *  Demand vs Forecast — last 14 days, Maharashtra · SKU-228 (200ml glucose)
 *  The single most useful chart for an FMCG ops head: where reality diverged
 *  from the forecast, and what the platform did about it.
 * ──────────────────────────────────────────────────────────────────────────── */
const FORECAST = [82, 84, 86, 88, 90, 91, 92, 93, 94, 96, 98, 100, 102, 104];
const ACTUAL =   [80, 83, 85, 87, 91, 95, 99, 104, 110, 118, 124, 122, 119, 121];
const X_LABELS = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];

function pathFor(values: number[], w: number, h: number, pad = 8) {
  const min = 70;
  const max = 130;
  const stepX = (w - pad * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (h - pad * 2) * (1 - (v - min) / (max - min));
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function DemandChart() {
  const w = 540;
  const h = 200;
  const pad = 8;
  const forecastPath = pathFor(FORECAST, w, h, pad);
  const actualPath = pathFor(ACTUAL, w, h, pad);
  const areaPath = `${actualPath} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;

  // mark divergence point — day 7 (where actual breaks above forecast)
  const divergeIdx = 6;
  const divergeX = pad + ((w - pad * 2) / (ACTUAL.length - 1)) * divergeIdx;
  const divergeY =
    pad + (h - pad * 2) * (1 - (ACTUAL[divergeIdx] - 70) / 60);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="block w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--demand-fill-start)" />
            <stop offset="100%" stopColor="var(--demand-fill-end)" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={w - pad}
            y1={pad + (h - pad * 2) * t}
            y2={pad + (h - pad * 2) * t}
            stroke="var(--demand-grid)"
            strokeWidth={1}
          />
        ))}

        {/* area under actual */}
        <path d={areaPath} fill="url(#actualFill)" />

        {/* forecast — dashed */}
        <path
          d={forecastPath}
          fill="none"
          stroke="var(--demand-forecast-stroke)"
          strokeWidth={1.25}
          strokeDasharray="3 3"
        />

        {/* actual — solid */}
        <path
          d={actualPath}
          fill="none"
          stroke="var(--demand-actual-stroke)"
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* divergence callout */}
        <circle cx={divergeX} cy={divergeY} r={3.5} fill="var(--demand-marker-fill)" />
        <circle
          cx={divergeX}
          cy={divergeY}
          r={7}
          fill="none"
          stroke="var(--demand-marker-ring)"
        />
        <line
          x1={divergeX}
          y1={divergeY}
          x2={divergeX}
          y2={h - pad}
          stroke="var(--demand-callout-line)"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      </svg>

      {/* x-axis day labels */}
      <div
        className="mt-1 grid px-2 font-mono text-[9.5px] text-white/35"
        style={{ gridTemplateColumns: `repeat(${X_LABELS.length}, minmax(0, 1fr))` }}
      >
        {X_LABELS.map((d, i) => (
          <span
            key={i}
            className={`text-center ${
              i === divergeIdx ? "text-white/80" : ""
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* divergence annotation — below chart on narrow screens to avoid clipping */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full rounded border border-white/20 bg-black px-2 py-1 font-mono text-[10px] text-white/85"
        style={{
          left: `${(divergeX / w) * 100}%`,
          top: `${(divergeY / h) * 100 - 4}%`,
        }}
      >
        +18% vs forecast -&gt; RM PO auto-triggered to vendor
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 *  KPI strip with sparklines
 * ──────────────────────────────────────────────────────────────────────────── */
function Sparkline({ values, w = 60, h = 18 }: { values: number[]; w?: number; h?: number }) {
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
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" />
    </svg>
  );
}

const KPIS = [
  { k: "Orders processed", v: "12,840", d: "+12%", source: "from WhatsApp + phone", trend: [40, 42, 38, 50, 55, 52, 60, 64], up: true },
  { k: "On-time fulfilment", v: "94.2%", d: "+1.4 pts", trend: [88, 89, 90, 91, 92, 93, 93, 94], up: true },
  { k: "Outstanding (₹ Cr)", v: "28.4", d: "-6%", trend: [34, 33, 32, 31, 30, 30, 29, 28], up: false },
  { k: "Stockouts averted", v: "37", d: "+5", source: "auto-procurement", trend: [12, 14, 18, 22, 25, 30, 33, 37], up: true },
  { k: "Active disruptions", v: "3", d: "-2", source: "auto-resolved", trend: [6, 5, 5, 4, 4, 5, 4, 3], up: false },
];

/* ────────────────────────────────────────────────────────────────────────────
 *  Disruption radar
 * ──────────────────────────────────────────────────────────────────────────── */
const DISRUPTIONS = [
  "Sugar - Vendor #4 delayed 36h -> auto-routed to Vendor #2",
  "SKU-228 demand +18% in MH -> procurement triggered",
  "Distributor D-087 over credit limit -> orders on hold",
];

/* ────────────────────────────────────────────────────────────────────────────
 *  Inventory heatmap — 5 SKU groups × 6 depots
 *  Values 0–100 = days of cover; <14 = risk, 14–30 = healthy, >45 = excess
 * ──────────────────────────────────────────────────────────────────────────── */
const DEPOTS = ["Pune", "Indore", "Surat", "Coim.", "Kolk.", "Patna"];
const SKU_GROUPS = ["Glucose", "Biscuits", "Snacks", "Beverages", "Spreads"];
const COVER = [
  [22, 18, 11, 26, 31, 14],
  [28, 24, 30, 19, 12, 21],
  [16, 32, 25, 22, 19, 28],
  [42, 38, 51, 29, 33, 22],
  [12, 14, 18, 24, 30, 35],
];

function cellTone(v: number) {
  if (v < 14) return "bg-neutral-950 text-white dark:bg-white dark:text-black"; // risk
  if (v <= 30) return "bg-emerald-200 text-emerald-950 dark:bg-white/35 dark:text-white"; // healthy
  if (v <= 45) return "bg-neutral-200 text-neutral-900 dark:bg-white/15 dark:text-white/85";
  return "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-white/55"; // excess
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Receivables aging — stacked horizontal bar
 * ──────────────────────────────────────────────────────────────────────────── */
const AGING = [
  { bucket: "0–30 d", amt: 14.8, tone: "bg-neutral-800 dark:bg-white" },
  { bucket: "31–60 d", amt: 7.6, tone: "bg-neutral-500 dark:bg-white/70" },
  { bucket: "61–90 d", amt: 4.2, tone: "bg-neutral-400 dark:bg-white/40" },
  { bucket: "90+ d", amt: 1.8, tone: "bg-neutral-300 dark:bg-white/20" },
];

const DASHBOARD_BASE_WIDTH = 1120;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PlatformShowcase() {
  const totalOutstanding = AGING.reduce((s, a) => s + a.amt, 0);
  const reduceMotion = useReducedMotion();
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const dashboardShellRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [dashboardScale, setDashboardScale] = useState(1);
  const [dashboardHeight, setDashboardHeight] = useState(0);
  const entranceProgress = useMotionValue(0);
  const smoothEntrance = useSpring(entranceProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.35,
  });
  const entranceY = useTransform(smoothEntrance, [0, 1], [140, 0]);
  const entranceScale = useTransform(smoothEntrance, [0, 1], [1.14, 1]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const shell = dashboardShellRef.current;
    if (!shell) return;

    const updateScale = () => {
      const shellWidth = shell.clientWidth;
      const nextScale = Math.min(1, shellWidth / DASHBOARD_BASE_WIDTH);
      setDashboardScale(nextScale);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(shell);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const dashboard = dashboardRef.current;
    if (!dashboard) return;

    const updateHeight = () => {
      setDashboardHeight(dashboard.offsetHeight);
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(dashboard);
    return () => resizeObserver.disconnect();
  }, []);

  const shouldAnimateDashboard = !reduceMotion && isDesktopViewport;

  useEffect(() => {
    entranceProgress.set(shouldAnimateDashboard ? 0 : 1);
  }, [entranceProgress, shouldAnimateDashboard]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!shouldAnimateDashboard) return;
    const shell = dashboardShellRef.current;
    if (!shell) return;

    const viewportHeight = window.innerHeight || 1;
    const rect = shell.getBoundingClientRect();
    const triggerStart = viewportHeight - rect.height * 0.01;
    const triggerEnd = viewportHeight * 0.78;
    const targetProgress = clamp(
      (triggerStart - rect.top) / (triggerStart - triggerEnd),
      0,
      1
    );

    const isScrollingDown = latest > lastScrollY.current;
    const currentProgress = entranceProgress.get();

    if (isScrollingDown) {
      // When scrolling down, only allow moving toward final stage.
      entranceProgress.set(Math.max(currentProgress, targetProgress));
    } else {
      // When scrolling up, allow reversing back toward the initial stage.
      entranceProgress.set(targetProgress);
    }

    lastScrollY.current = latest;
  });

  return (
    <section id="platform" className="bg-background py-8 dark:bg-black sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex w-fit items-center gap-2 rounded-md border border-neutral-300/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-600 dark:border-white/20 dark:text-white/70">
          <span className="inline-block h-1.5 w-1.5 bg-neutral-800 dark:bg-white" />
          The platform
        </div>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl md:text-6xl dark:text-white">
          Watch your operations
          <br />
          run themselves.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/60">
          Everything below comes from WhatsApp messages, Excel sheets, and
          phone calls your team already sends. No new data entry. No new tools
          to learn.
        </p>

        {/* Window */}
        <div
          ref={dashboardShellRef}
          className="relative mt-14"
          style={{ height: dashboardHeight ? `${dashboardHeight * dashboardScale}px` : undefined }}
        >
          <div
            style={{
              width: `${DASHBOARD_BASE_WIDTH}px`,
              transformOrigin: "top left",
              transform: `scale(${dashboardScale})`,
            }}
          >
            <motion.div
              ref={dashboardRef}
              style={shouldAnimateDashboard ? { y: entranceY, scale: entranceScale } : undefined}
              className="relative overflow-hidden rounded-xl border border-neutral-200/90 bg-[#fffefb] shadow-sm ring-1 ring-black/[0.04] [--demand-fill-end:rgba(0,0,0,0)] [--demand-fill-start:rgba(23,23,23,0.13)] [--demand-grid:rgba(0,0,0,0.06)] [--demand-forecast-stroke:rgba(0,0,0,0.36)] [--demand-actual-stroke:#171717] [--demand-marker-fill:#171717] [--demand-marker-ring:rgba(0,0,0,0.2)] [--demand-callout-line:rgba(0,0,0,0.2)] [--forecast-legend-dash:rgba(0,0,0,0.42)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-none dark:ring-0 dark:[--demand-fill-end:rgba(255,255,255,0)] dark:[--demand-fill-start:rgba(255,255,255,0.18)] dark:[--demand-grid:rgba(255,255,255,0.06)] dark:[--demand-forecast-stroke:rgba(255,255,255,0.35)] dark:[--demand-actual-stroke:#ffffff] dark:[--demand-marker-fill:#ffffff] dark:[--demand-marker-ring:rgba(255,255,255,0.4)] dark:[--demand-callout-line:rgba(255,255,255,0.25)] dark:[--forecast-legend-dash:rgba(255,255,255,0.5)]"
            >
          {/* Chrome */}
          <div className="flex min-h-[2.75rem] flex-wrap items-center gap-x-2 gap-y-2 border-b border-neutral-200/80 bg-neutral-100/55 px-4 py-3 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex shrink-0 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/95 dark:bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/95 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/95 dark:bg-white/15" />
            </div>
            <span className="min-w-0 flex-1 basis-auto truncate pl-0 font-mono text-xs text-neutral-500 dark:text-white/45">
              ops.rigidbody.ai / acme-foods · operations
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded border border-neutral-200/90 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse dark:bg-green-400" />
              live
            </span>
          </div>

          {/* Sub-nav */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200/80 bg-[#fffefb] px-3 dark:border-white/10 dark:bg-[#0a0a0a]">
            {[
              "Operations",
              "Demand",
              "Inventory",
              "Credit",
              "Schemes",
              "Agents",
            ].map((t, i) => {
              const active = i === 0;
              return (
                <span
                  key={t}
                  className={`relative whitespace-nowrap px-3 py-2.5 text-[12px] ${
                    active ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-white/45"
                  }`}
                >
                  {t}
                  {active ? (
                    <span className="absolute inset-x-2 -bottom-px h-px bg-neutral-900 dark:bg-white" />
                  ) : null}
                </span>
              );
            })}
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-5 gap-px bg-neutral-200/70 dark:bg-white/5">
            {KPIS.map((k) => (
              <div key={k.k} className="bg-[#fffefb] p-4 dark:bg-[#0a0a0a]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10.5px] uppercase tracking-wider text-neutral-500 dark:text-white/45">
                    {k.k}
                  </p>
                  <Sparkline values={k.trend} />
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="text-[22px] font-semibold leading-none text-neutral-900 dark:text-white">
                    {k.v}
                  </span>
                  <span
                    className={`font-mono text-[11px] ${
                      k.up ? "text-emerald-800 dark:text-white/85" : "text-neutral-600 dark:text-white/55"
                    }`}
                  >
                    {k.d}
                  </span>
                </div>
                {"source" in k && k.source ? (
                  <p className="mt-1 text-[10px] text-neutral-500 dark:text-white/40">{k.source}</p>
                ) : null}
              </div>
            ))}
          </div>

          {/* Main: chart + radar */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-px bg-neutral-200/70 dark:bg-white/5">
            {/* Demand vs Forecast */}
            <div className="bg-[#fffefb] p-6 dark:bg-[#0a0a0a]">
              <div className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Demand vs Forecast
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-neutral-500 dark:text-white/45">
                    SKU-228 · Maharashtra · last 14 days
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] text-neutral-600 dark:text-white/55">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-[2px] w-3 bg-neutral-900 dark:bg-white" />
                    Actual
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-[2px] w-3"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, var(--forecast-legend-dash) 0 2px, transparent 2px 4px)",
                      }}
                    />
                    Forecast
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <DemandChart />
              </div>
              <div className="mt-4 flex flex-row items-center justify-between gap-0 border-t border-neutral-200/80 pt-3 font-mono text-[11px] text-neutral-600 dark:border-white/10 dark:text-white/55">
                <span>Forecast accuracy · 91.2%</span>
                <span>Auto-corrections this week · 4</span>
              </div>
            </div>

            {/* Disruption radar */}
            <div className="bg-[#fffefb] p-6 dark:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Disruption radar</p>
                <span className="rounded border border-neutral-200/90 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/70">
                  3 active
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {DISRUPTIONS.map((item) => (
                  <li
                    key={item}
                    className="rounded border border-neutral-200/80 bg-neutral-50/80 p-3 dark:border-white/8 dark:bg-white/[0.02]"
                  >
                    <p className="font-mono text-[11px] leading-relaxed text-neutral-700 dark:text-white/70">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200/80 pt-3 font-mono text-[11px] text-neutral-600 dark:border-white/10 dark:text-white/55">
                <span>MTTR · 6m 22s</span>
                <span>Auto-resolved · 87%</span>
              </div>
            </div>
          </div>

          {/* Bottom: heatmap + aging */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-px bg-neutral-200/70 dark:bg-white/5">
            {/* Inventory heatmap */}
            <div className="bg-[#fffefb] p-6 dark:bg-[#0a0a0a]">
              <div className="flex flex-row items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Inventory cover
                </p>
                <p className="font-mono text-[11px] text-neutral-500 dark:text-white/45">
                  days of cover · by SKU group × depot
                </p>
              </div>

              <div className="mt-5 overflow-x-auto">
                <div
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: `92px repeat(${DEPOTS.length}, minmax(0, 1fr))` }}
                >
                  {/* header row */}
                  <div />
                  {DEPOTS.map((d) => (
                    <div
                      key={d}
                      className="text-center font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-white/45"
                    >
                      {d}
                    </div>
                  ))}

                  {/* rows */}
                  {SKU_GROUPS.flatMap((g, r) => [
                    <div
                      key={`${g}-label`}
                      className="flex items-center font-mono text-[11px] text-neutral-600 dark:text-white/65"
                    >
                      {g}
                    </div>,
                    ...COVER[r].map((v, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`flex h-9 items-center justify-center rounded font-mono text-[11px] ${cellTone(v)}`}
                        title={`${g} @ ${DEPOTS[c]} · ${v} days cover`}
                      >
                        {v}
                      </div>
                    )),
                  ])}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-200/80 pt-3 font-mono text-[10.5px] text-neutral-600 dark:border-white/10 dark:text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-950 dark:bg-white" />
                  &lt; 14 d · risk
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200 dark:bg-white/35" />
                  14–30 d · healthy
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-200 dark:bg-white/15" />
                  30–45 d
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-100 ring-1 ring-neutral-300 dark:bg-white/5 dark:ring-white/10" />
                  &gt; 45 d · excess
                </span>
              </div>
            </div>

            {/* Receivables aging */}
            <div className="bg-[#fffefb] p-6 dark:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Receivables aging
                </p>
                <p className="font-mono text-[11px] text-neutral-500 dark:text-white/45">
                  ₹ Cr · 142 distributors
                </p>
              </div>

              <div className="mt-6">
                <div className="flex h-3 w-full overflow-hidden rounded bg-neutral-200/90 dark:bg-white/10">
                  {AGING.map((a) => (
                    <div
                      key={a.bucket}
                      className={a.tone}
                      style={{ width: `${(a.amt / totalOutstanding) * 100}%` }}
                      title={`${a.bucket} · ₹${a.amt.toFixed(1)} Cr`}
                    />
                  ))}
                </div>

                <ul className="mt-5 space-y-2.5">
                  {AGING.map((a) => (
                    <li
                      key={a.bucket}
                      className="flex items-center gap-3 text-[12.5px]"
                    >
                      <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${a.tone}`} />
                      <span className="text-neutral-600 dark:text-white/70">{a.bucket}</span>
                      <span className="ml-auto font-mono text-neutral-900 dark:text-white/85">
                        ₹{a.amt.toFixed(1)} Cr
                      </span>
                      <span className="w-12 text-right font-mono text-[11px] text-neutral-500 dark:text-white/40">
                        {((a.amt / totalOutstanding) * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-200/80 pt-3 font-mono text-[11px] text-neutral-600 dark:border-white/10 dark:text-white/55">
                <span>Total · ₹{totalOutstanding.toFixed(1)} Cr</span>
                <span>Auto-holds active · 9</span>
              </div>
            </div>
          </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
