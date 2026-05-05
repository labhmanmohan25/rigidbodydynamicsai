"use client";

import { useEffect, useRef } from "react";

const TRAIL_LEN = 14;
const MAX_METEORS = 48;
const MAX_LANDINGS = 72;
/** Meteor crossing this line (from above) converts to a floor silhouette */
const LAND_TRIGGER_Y = 36;
/** Icon anchored this many px above hero bottom — keeps shapes inside overflow clipping */
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
 * Landed marks use Heroicons v2 outline paths (MIT) — same artwork as `react-icons/hi2`.
 * Canvas cannot render React icon components directly; paths are inlined for `Path2D` stroke.
 * Order: retail / product mix (0–7), then supply chain (8–15).
 */
const LANDING_ICON_KIND_COUNT = 16;

const LANDING_HI_OUTLINE_PATH_D: readonly (readonly string[])[] = [
  [
    "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
  ],
  [
    "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  ],
  [
    "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z",
  ],
  [
    "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
  ],
  [
    "M20.625 11.505v8.25a1.5 1.5 0 0 1-1.5 1.5H4.875a1.5 1.5 0 0 1-1.5-1.5v-8.25m8.25-6.375A2.625 2.625 0 1 0 9 7.755h2.625m0-2.625v2.625m0-2.625a2.625 2.625 0 1 1 2.625 2.625h-2.625m0 0v13.5M3 11.505h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.622-.504-1.125-1.125-1.125H3c-.621 0-1.125.503-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
  ],
  [
    "M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z",
  ],
  [
    "M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z",
    "M6 6h.008v.008H6V6Z",
  ],
  [
    "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  ],
  [
    "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z",
  ],
  [
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  ],
  [
    "M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122",
  ],
  [
    "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  ],
  [
    "m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
  ],
  [
    "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  ],
  [
    "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z",
  ],
  [
    "m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
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
