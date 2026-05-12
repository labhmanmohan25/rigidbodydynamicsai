"use client";

import { useEffect, useRef } from "react";

const TRAIL_LEN = 14;
const MAX_METEORS = 48;
const MAX_LANDINGS = 72;
/** Meteor crossing this line (from above) converts to a floor silhouette */
const LAND_TRIGGER_Y = 36;
/** Icon anchored this many px above hero bottom  -  keeps shapes inside overflow clipping */
const LAND_ICON_ANCHOR_Y = 26;
/** Pop-in / fade-out timing for landed FMCG silhouettes (ms) */
const LAND_FADE_IN_MS = 320;
const LAND_HOLD_MS = 650;
const LAND_FADE_OUT_MS = 900;
const LAND_LIFETIME_MS =
  LAND_FADE_IN_MS + LAND_HOLD_MS + LAND_FADE_OUT_MS;
const LAND_PEAK_OPACITY = 0.92;

export type MeteorSurface = "light" | "dark";

type PixelPalette = {
  pickStarRgb: () => { r: number; g: number; b: number };
  starBaseMin: number;
  starBaseSpread: number;
  meteorHead: string;
  meteorTrail: (alpha: number) => string;
  landingStroke: string;
};

function paletteFor(surface: MeteorSurface): PixelPalette {
  if (surface === "dark") {
    return {
      pickStarRgb: () => ({
        r: 175 + Math.floor(Math.random() * 80),
        g: 200 + Math.floor(Math.random() * 55),
        b: 248 + Math.floor(Math.random() * 7),
      }),
      starBaseMin: 0.12,
      starBaseSpread: 0.55,
      meteorHead: "rgba(255, 255, 255, 0.95)",
      meteorTrail: (alpha) => `rgba(200, 230, 255, ${alpha})`,
      landingStroke: "rgba(255, 255, 255, 0.92)",
    };
  }
  return {
    pickStarRgb: () => ({
      r: 38 + Math.floor(Math.random() * 72),
      g: 62 + Math.floor(Math.random() * 58),
      b: 108 + Math.floor(Math.random() * 92),
    }),
    starBaseMin: 0.2,
    starBaseSpread: 0.52,
    meteorHead: "rgba(15, 23, 42, 0.96)",
    meteorTrail: (alpha) => `rgba(30, 58, 95, ${alpha})`,
    landingStroke: "rgba(30, 41, 59, 0.91)",
  };
}

function landingOpacity(ageMs: number): number {
  if (ageMs <= 0) return 0;
  if (ageMs < LAND_FADE_IN_MS) {
    const t = ageMs / LAND_FADE_IN_MS;
    return LAND_PEAK_OPACITY * (1 - (1 - t) * (1 - t));
  }
  if (ageMs < LAND_FADE_IN_MS + LAND_HOLD_MS) return LAND_PEAK_OPACITY;
  if (ageMs < LAND_LIFETIME_MS) {
    const t = (ageMs - LAND_FADE_IN_MS - LAND_HOLD_MS) / LAND_FADE_OUT_MS;
    return LAND_PEAK_OPACITY * (1 - t) * (1 - t);
  }
  return 0;
}

type NebulaStar = {
  x: number;
  y: number;
  size: number;
  base: number;
  phase: number;
  speed: number;
  r: number;
  g: number;
  b: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
  size: number;
};

/** Landed icons: Heroicons-outline product + logistics glyphs (canvas `Path2D`; matches `react-icons/hi2`). */
type FloorLanding = {
  x: number;
  y: number;
  kind: number;
  born: number;
};

/**
 * Landed marks use Heroicons v2 outline paths (MIT)  -  same artwork as `react-icons/hi2`.
 * Canvas cannot render React icon components directly; paths are inlined for `Path2D` stroke.
 * Curated for the product: input channels (WhatsApp/email/Excel/phone), AI agents,
 * order-to-cash flow, supply-chain assets, and the brand-owner / manufacturer / distributor stack.
 */
const LANDING_ICON_KIND_COUNT = 16;

const LANDING_HI_OUTLINE_PATH_D: readonly (readonly string[])[] = [
  // HiOutlineChatBubbleLeftRight  -  WhatsApp / messaging channel
  [
    "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  ],
  // HiOutlineEnvelope  -  email channel
  [
    "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  ],
  // HiOutlineTableCells  -  Excel / spreadsheet channel
  [
    "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5",
  ],
  // HiOutlineDevicePhoneMobile  -  phone channel
  [
    "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  ],
  // HiOutlineCpuChip  -  AI agent
  [
    "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z",
  ],
  // HiOutlineBolt  -  automation
  [
    "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
  ],
  // HiOutlineClipboardDocumentCheck  -  order processing
  [
    "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75",
  ],
  // HiOutlineCurrencyDollar  -  credit / receivables
  [
    "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  ],
  // HiOutlineShoppingBag  -  orders / retail
  [
    "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
  ],
  // HiOutlineArchiveBox  -  warehouse / inventory
  [
    "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
  ],
  // HiOutlineTruck  -  dispatch / logistics
  [
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  ],
  // HiOutlineCubeTransparent  -  SKU / product mix
  [
    "m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
  ],
  // HiOutlineBuildingOffice2  -  manufacturer / brand HQ
  [
    "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z",
  ],
  // HiOutlineBuildingStorefront  -  distributor / retailer
  [
    "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z",
  ],
  // HiOutlineChartBar  -  forecast / metrics
  [
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  ],
  // HiOutlineMapPin  -  field / territory
  [
    "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  ],
];

let landingPath2DCache: Path2D[][] | null = null;

function landingPath2DsForKind(kind: number): Path2D[] {
  if (!landingPath2DCache) {
    landingPath2DCache = LANDING_HI_OUTLINE_PATH_D.map((ds) =>
      ds.map((d) => new Path2D(d)),
    );
  }
  return landingPath2DCache[kind % LANDING_ICON_KIND_COUNT]!;
}

/** Heroicons outline / 24×24 viewBox; caller sets transform (scale + center). */
function strokeLandingHiOutline(ctx: CanvasRenderingContext2D, kind: number) {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 1.875;
  for (const p of landingPath2DsForKind(kind)) {
    ctx.stroke(p);
  }
}

function rndKind() {
  return Math.floor(Math.random() * LANDING_ICON_KIND_COUNT);
}

function pushLanding(
  landings: FloorLanding[],
  x: number,
  w: number,
  h: number,
  time: number,
) {
  const margin = 16;
  const jitter = (Math.random() - 0.5) * 8;
  const lx = Math.max(margin, Math.min(w - margin, x + jitter));
  const ly = h - LAND_ICON_ANCHOR_Y;
  landings.push({ x: lx, y: ly, kind: rndKind(), born: time });
  while (landings.length > MAX_LANDINGS) landings.shift();
}

function spawnMeteor(w: number, h: number, meteors: Meteor[]) {
  if (meteors.length >= MAX_METEORS) return;
  const speed = 2.9 + Math.random() * 4.8;

  let x: number;
  let y: number;
  let angle: number;

  if (Math.random() < 0.12) {
    x = -80 - Math.random() * 100;
    y = Math.random() * Math.max(h * 0.55, 120);
    angle = Math.PI / 6 + Math.random() * (Math.PI / 3);
  } else {
    x = Math.random() * (w + 140) - 70;
    y = -35 - Math.random() * 160;
    angle = Math.PI / 2 + (Math.random() - 0.5) * 1.05;
  }

  meteors.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    trail: [],
    size: 2 + (Math.random() > 0.65 ? 1 : 0),
  });
}

function generateNebulaStars(
  w: number,
  h: number,
  pal: PixelPalette,
): NebulaStar[] {
  const area = w * h;
  const count = Math.min(520, Math.max(220, Math.floor(area / 5500)));
  const stars: NebulaStar[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    const size = roll > 0.88 ? 2 : 1;
    const { r, g, b } = pal.pickStarRgb();
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      base: pal.starBaseMin + Math.random() * pal.starBaseSpread,
      phase: Math.random() * Math.PI * 2,
      speed: 0.65 + Math.random() * 2.4,
      r,
      g,
      b,
    });
  }
  return stars;
}

type MeteorShowerPixelsProps = {
  /** Match home cream vs black hero; dark keeps the original cool-white meteor look. */
  surface?: MeteorSurface;
};

export default function MeteorShowerPixels({
  surface = "dark",
}: MeteorShowerPixelsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const pal = paletteFor(surface);

    let meteors: Meteor[] = [];
    let stars: NebulaStar[] = [];
    let landings: FloorLanding[] = [];
    let raf = 0;
    let lastSpawn = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = generateNebulaStars(w, h, pal);
      landings = [];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const step = (time: number) => {
      if (!running) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      const landY = h - LAND_TRIGGER_Y;

      if (time - lastSpawn > 95 + Math.random() * 110) {
        lastSpawn = time;
        spawnMeteor(w, h, meteors);
      }

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const tw = Math.sin(time * 0.00085 * s.speed + s.phase) * 0.22;
        const a = Math.min(0.95, Math.max(0.06, s.base + tw));
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${a})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }

      meteors = meteors.filter((m) => {
        const prevY = m.y;
        m.x += m.vx;
        m.y += m.vy;

        let consumed = false;
        if (
          prevY < landY &&
          m.y >= landY &&
          m.x > -48 &&
          m.x < w + 48
        ) {
          pushLanding(landings, m.x, w, h, time);
          consumed = true;
        }

        if (consumed) return false;

        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > TRAIL_LEN) m.trail.shift();

        const n = m.trail.length;
        for (let i = 0; i < n; i++) {
          const p = m.trail[i];
          const t = n <= 1 ? 1 : i / (n - 1);
          const isHead = i === n - 1;
          const alpha = isHead ? 0.95 : 0.12 + t * 0.45;
          ctx.fillStyle = isHead ? pal.meteorHead : pal.meteorTrail(alpha);
          ctx.fillRect(
            Math.floor(p.x),
            Math.floor(p.y),
            m.size,
            m.size,
          );
        }

        return m.x < w + 80 && m.y < h + 80 && m.x > -120;
      });

      landings = landings.filter((L) => time - L.born < LAND_LIFETIME_MS);

      const iconPx = Math.min(20, Math.max(14, Math.min(w, h) * 0.036));
      for (const L of landings) {
        const e = landingOpacity(time - L.born);
        if (e < 0.02) continue;
        ctx.save();
        ctx.translate(L.x, L.y);
        ctx.globalAlpha = e;
        ctx.strokeStyle = pal.landingStroke;
        ctx.scale(iconPx / 24, iconPx / 24);
        ctx.translate(-12, -12);
        strokeLandingHiOutline(ctx, L.kind);
        ctx.restore();
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [surface]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
