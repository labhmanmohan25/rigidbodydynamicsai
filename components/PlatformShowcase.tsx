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
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
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
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* area under actual */}
        <path d={areaPath} fill="url(#actualFill)" />

        {/* forecast — dashed */}
        <path
          d={forecastPath}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.25}
          strokeDasharray="3 3"
        />

        {/* actual — solid */}
        <path
          d={actualPath}
          fill="none"
          stroke="white"
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* divergence callout */}
        <circle cx={divergeX} cy={divergeY} r={3.5} fill="white" />
        <circle
          cx={divergeX}
          cy={divergeY}
          r={7}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
        />
        <line
          x1={divergeX}
          y1={divergeY}
          x2={divergeX}
          y2={h - pad}
          stroke="rgba(255,255,255,0.25)"
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
        +18% vs forecast → RM PO triggered
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
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-4 w-16" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="white" strokeWidth={1.25} strokeLinejoin="round" />
    </svg>
  );
}

const KPIS = [
  { k: "Orders processed", v: "12,840", d: "+12%", trend: [40, 42, 38, 50, 55, 52, 60, 64], up: true },
  { k: "On-time fulfilment", v: "94.2%", d: "+1.4 pts", trend: [88, 89, 90, 91, 92, 93, 93, 94], up: true },
  { k: "Outstanding (₹ Cr)", v: "28.4", d: "−6%", trend: [34, 33, 32, 31, 30, 30, 29, 28], up: false },
  { k: "Stockouts averted", v: "37", d: "+5", trend: [12, 14, 18, 22, 25, 30, 33, 37], up: true },
  { k: "Active disruptions", v: "3", d: "−2", trend: [6, 5, 5, 4, 4, 5, 4, 3], up: false },
];

/* ────────────────────────────────────────────────────────────────────────────
 *  Disruption radar
 * ──────────────────────────────────────────────────────────────────────────── */
const DISRUPTIONS = [
  {
    sev: "high",
    title: "Sugar — Vendor #4 delayed 36h",
    sub: "Auto-routed 18MT to Vendor #2 · Procurement Agent",
    time: "12m ago",
  },
  {
    sev: "med",
    title: "SKU-228 demand +18% in MH",
    sub: "RM PO ₹8.2L raised · Forecast Engine + Procurement",
    time: "38m ago",
  },
  {
    sev: "low",
    title: "Distributor D-087 over limit",
    sub: "Hold placed on next dispatch · Credit Watchdog",
    time: "1h ago",
  },
];

const SEV_DOT: Record<string, string> = {
  high: "bg-white",
  med: "bg-white/60",
  low: "bg-white/30",
};

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
  if (v < 14) return "bg-white text-black"; // risk
  if (v <= 30) return "bg-white/35 text-white"; // healthy
  if (v <= 45) return "bg-white/15 text-white/85";
  return "bg-white/5 text-white/55"; // excess
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Receivables aging — stacked horizontal bar
 * ──────────────────────────────────────────────────────────────────────────── */
const AGING = [
  { bucket: "0–30 d", amt: 14.8, tone: "bg-white" },
  { bucket: "31–60 d", amt: 7.6, tone: "bg-white/70" },
  { bucket: "61–90 d", amt: 4.2, tone: "bg-white/40" },
  { bucket: "90+ d", amt: 1.8, tone: "bg-white/20" },
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
    <section id="platform" className="bg-black py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex w-fit items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
          <span className="inline-block h-1.5 w-1.5 bg-white" />
          The platform
        </div>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
          Watch your operations
          <br />
          run themselves.
        </h2>

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
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]"
            >
          {/* Chrome */}
          <div className="flex min-h-[2.75rem] flex-wrap items-center gap-x-2 gap-y-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex shrink-0 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <span className="min-w-0 flex-1 basis-auto truncate pl-0 font-mono text-xs text-white/45">
              ops.rigidbody.ai / acme-foods · operations
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              live
            </span>
          </div>

          {/* Sub-nav */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#0a0a0a] px-3">
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
                    active ? "text-white" : "text-white/45"
                  }`}
                >
                  {t}
                  {active ? (
                    <span className="absolute inset-x-2 -bottom-px h-px bg-white" />
                  ) : null}
                </span>
              );
            })}
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-5 gap-px bg-white/5">
            {KPIS.map((k) => (
              <div key={k.k} className="bg-[#0a0a0a] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10.5px] uppercase tracking-wider text-white/45">
                    {k.k}
                  </p>
                  <Sparkline values={k.trend} />
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="text-[22px] font-semibold leading-none text-white">
                    {k.v}
                  </span>
                  <span
                    className={`font-mono text-[11px] ${
                      k.up ? "text-white/85" : "text-white/55"
                    }`}
                  >
                    {k.d}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main: chart + radar */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-px bg-white/5">
            {/* Demand vs Forecast */}
            <div className="bg-[#0a0a0a] p-6">
              <div className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    Demand vs Forecast
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-white/45">
                    SKU-228 · Maharashtra · last 14 days
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] text-white/55">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-[2px] w-3 bg-white" />
                    Actual
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-[2px] w-3"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 4px)",
                      }}
                    />
                    Forecast
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <DemandChart />
              </div>
              <div className="mt-4 flex flex-row items-center justify-between gap-0 border-t border-white/10 pt-3 font-mono text-[11px] text-white/55">
                <span>Forecast accuracy · 91.2%</span>
                <span>Auto-corrections this week · 4</span>
              </div>
            </div>

            {/* Disruption radar */}
            <div className="bg-[#0a0a0a] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Disruption radar</p>
                <span className="rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
                  3 active
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {DISRUPTIONS.map((d, i) => (
                  <li
                    key={i}
                    className="rounded border border-white/8 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1 inline-block h-2 w-2 rounded-full ${SEV_DOT[d.sev]}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] leading-snug text-white">
                            {d.title}
                          </p>
                          <span className="font-mono text-[10px] text-white/40">
                            {d.time}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10.5px] leading-snug text-white/55">
                          {d.sub}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-white/55">
                <span>MTTR · 6m 22s</span>
                <span>Auto-resolved · 87%</span>
              </div>
            </div>
          </div>

          {/* Bottom: heatmap + aging */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-px bg-white/5">
            {/* Inventory heatmap */}
            <div className="bg-[#0a0a0a] p-6">
              <div className="flex flex-row items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">
                  Inventory cover
                </p>
                <p className="font-mono text-[11px] text-white/45">
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
                      className="text-center font-mono text-[10px] uppercase tracking-wider text-white/45"
                    >
                      {d}
                    </div>
                  ))}

                  {/* rows */}
                  {SKU_GROUPS.flatMap((g, r) => [
                    <div
                      key={`${g}-label`}
                      className="flex items-center font-mono text-[11px] text-white/65"
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

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3 font-mono text-[10.5px] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white" />
                  &lt; 14 d · risk
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white/35" />
                  14–30 d · healthy
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white/15" />
                  30–45 d
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white/5 ring-1 ring-white/10" />
                  &gt; 45 d · excess
                </span>
              </div>
            </div>

            {/* Receivables aging */}
            <div className="bg-[#0a0a0a] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  Receivables aging
                </p>
                <p className="font-mono text-[11px] text-white/45">
                  ₹ Cr · 142 distributors
                </p>
              </div>

              <div className="mt-6">
                <div className="flex h-3 w-full overflow-hidden rounded">
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
                      <span className="text-white/70">{a.bucket}</span>
                      <span className="ml-auto font-mono text-white/85">
                        ₹{a.amt.toFixed(1)} Cr
                      </span>
                      <span className="w-12 text-right font-mono text-[11px] text-white/40">
                        {((a.amt / totalOutstanding) * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-white/55">
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
