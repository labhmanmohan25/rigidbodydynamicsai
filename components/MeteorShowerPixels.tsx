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

/** Landed icons: generic FMCG pack shapes + generic supply-chain nodes (sources: FMCG flows — source → manufacture → warehousing → multimodal logistics → retail / trade). */
type FloorLanding = {
  x: number;
  y: number;
  kind: number;
  born: number;
};

/** FMCG silhouettes `0…7`; supply-chain `8…15` (warehouse, truck, pallets, factory, sourcing, rail, storefront, shipping container). */
const LANDING_ICON_KIND_COUNT = 16;

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

/**
 * Stroke-only B&W silhouettes in local coords centered at origin (~±12 px).
 */
function drawLandingSilhouette(ctx: CanvasRenderingContext2D, kind: number) {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  switch (kind % LANDING_ICON_KIND_COUNT) {
    case 0: {
      // Biscuit / namkeen flow pack
      ctx.beginPath();
      ctx.roundRect(-11, -7, 22, 14, 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-7, -1);
      ctx.lineTo(7, -1);
      ctx.moveTo(-7, 3);
      ctx.lineTo(7, 3);
      ctx.stroke();
      break;
    }
    case 1: {
      // PET soft drink bottle (generic)
      ctx.beginPath();
      ctx.moveTo(-3, -10);
      ctx.lineTo(3, -10);
      ctx.lineTo(4, -6);
      ctx.lineTo(5, 8);
      ctx.quadraticCurveTo(5, 11, 2, 11);
      ctx.lineTo(-2, 11);
      ctx.quadraticCurveTo(-5, 11, -5, 8);
      ctx.lineTo(-4, -6);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 2: {
      // Washing soap / detergent bar
      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.lineTo(9, -4);
      ctx.lineTo(7, 5);
      ctx.lineTo(-7, 5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6, -1);
      ctx.lineTo(6, -1);
      ctx.stroke();
      break;
    }
    case 3: {
      // Toothpaste tube
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.lineTo(6, -2);
      ctx.lineTo(9, -5);
      ctx.lineTo(10, -5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.quadraticCurveTo(-11, 5, -9, 7);
      ctx.lineTo(5, 7);
      ctx.quadraticCurveTo(7, 5, 6, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2, 10, 1.8, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 4: {
      // Stand-up liquid refill pouch + cap bump
      ctx.beginPath();
      ctx.moveTo(-8, -9);
      ctx.lineTo(8, -9);
      ctx.quadraticCurveTo(9, 2, 6, 11);
      ctx.lineTo(-6, 11);
      ctx.quadraticCurveTo(-9, 2, -8, -9);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -9, 1.8, Math.PI, 0);
      ctx.stroke();
      break;
    }
    case 5: {
      // Instant noodles cup / dry snack drum
      ctx.beginPath();
      ctx.moveTo(-8, -8);
      ctx.lineTo(8, -8);
      ctx.lineTo(9, -5);
      ctx.lineTo(7, 9);
      ctx.lineTo(-7, 9);
      ctx.lineTo(-9, -5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-7.5, -5);
      ctx.lineTo(7.5, -5);
      ctx.stroke();
      break;
    }
    case 6: {
      // Edible oil / ghee jar
      ctx.beginPath();
      ctx.moveTo(-4, -11);
      ctx.lineTo(4, -11);
      ctx.lineTo(4.5, -8);
      ctx.arc(0, -5, 7, Math.PI, 0, true);
      ctx.lineTo(-4.5, -8);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-9, -2);
      ctx.lineTo(-8, 10);
      ctx.quadraticCurveTo(0, 13, 8, 10);
      ctx.lineTo(9, -2);
      ctx.quadraticCurveTo(0, -5, -9, -2);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 7: {
      // Tetra Pak–style beverage / juice brick
      ctx.beginPath();
      ctx.moveTo(-9, -8);
      ctx.lineTo(2, -12);
      ctx.lineTo(9, -6);
      ctx.lineTo(9, 8);
      ctx.lineTo(-9, 8);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-9, -8);
      ctx.lineTo(9, -6);
      ctx.stroke();
      break;
    }

    /* —— Supply chain (logistics network; no brand marks) —— */

    case 8: {
      // Regional / DC warehouse — gabled roof + loading façade
      ctx.beginPath();
      ctx.moveTo(-12, 4);
      ctx.lineTo(0, -9);
      ctx.lineTo(12, 4);
      ctx.lineTo(12, 11);
      ctx.lineTo(-12, 11);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-7.5, 4);
      ctx.lineTo(-7.5, 11);
      ctx.moveTo(0, 4);
      ctx.lineTo(0, 11);
      ctx.moveTo(7.5, 4);
      ctx.lineTo(7.5, 11);
      ctx.stroke();
      break;
    }

    case 9: {
      // Road freight — rigid truck silhouette
      ctx.strokeRect(-11, -6, 12, 8);
      ctx.strokeRect(2, -3.5, 8.5, 6.5);
      ctx.beginPath();
      ctx.arc(-5.5, 6, 1.65, 0, Math.PI * 2);
      ctx.arc(6, 6, 1.65, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 10: {
      // Pallet / unit load (floor stock)
      ctx.beginPath();
      ctx.moveTo(-10, 5);
      ctx.lineTo(10, 5);
      ctx.moveTo(-10, 0.5);
      ctx.lineTo(10, 0.5);
      ctx.moveTo(-10, -4);
      ctx.lineTo(10, -4);
      ctx.stroke();
      ctx.strokeRect(-9, -7, 4, 2.5);
      ctx.strokeRect(5, -7, 4, 2.5);
      ctx.strokeRect(-9, 5, 4, 2.5);
      ctx.strokeRect(5, 5, 4, 2.5);
      break;
    }

    case 11: {
      // Manufacturing plant — bays + chimney
      ctx.strokeRect(-11, -1, 22, 11);
      ctx.strokeRect(5, -11, 3.5, 10);
      ctx.beginPath();
      ctx.moveTo(-11, -1);
      ctx.lineTo(-6, -7);
      ctx.lineTo(-1, -1);
      ctx.lineTo(4, -7);
      ctx.lineTo(9, -1);
      ctx.stroke();
      break;
    }

    case 12: {
      // Sourcing / inbound procurement — staged cartons + feed path
      ctx.strokeRect(-9.5, 1, 7.5, 7);
      ctx.strokeRect(-3, -7, 7.5, 7);
      ctx.beginPath();
      ctx.moveTo(-11, -10);
      ctx.lineTo(-2, -1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2.5, -1);
      ctx.lineTo(-4.8, -1);
      ctx.lineTo(-2.8, -3.8);
      ctx.stroke();
      break;
    }

    case 13: {
      // Rail freight wagon
      ctx.strokeRect(-11, -3.8, 22, 7.5);
      ctx.beginPath();
      ctx.arc(-6, 6, 1.45, 0, Math.PI * 2);
      ctx.arc(0, 6, 1.45, 0, Math.PI * 2);
      ctx.arc(6, 6, 1.45, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 14: {
      // Retail / kirana-trade storefront — awning over shopfront
      ctx.beginPath();
      ctx.moveTo(-10.5, 1.5);
      ctx.lineTo(10.5, 1.5);
      ctx.lineTo(10, -4.8);
      ctx.lineTo(-10, -4.8);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(-8.5, 2, 17, 8.5);
      ctx.strokeRect(-2.8, 4.8, 5.8, 5.8);
      break;
    }

    case 15:
    default: {
      // Dry intermodal shipping container — corrugations + corners
      ctx.strokeRect(-10, -7.2, 20, 14.5);
      ctx.beginPath();
      ctx.moveTo(-10, -1.8);
      ctx.lineTo(10, -1.8);
      ctx.moveTo(-10, 3.2);
      ctx.lineTo(10, 3.2);
      ctx.stroke();
      ctx.strokeRect(-9.2, -6.4, 2.2, 2.2);
      ctx.strokeRect(7, -6.4, 2.2, 2.2);
      ctx.strokeRect(-9.2, 4.2, 2.2, 2.2);
      ctx.strokeRect(7, 4.2, 2.2, 2.2);
      break;
    }
  }
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

function generateNebulaStars(w: number, h: number): NebulaStar[] {
  const area = w * h;
  const count = Math.min(520, Math.max(220, Math.floor(area / 5500)));
  const stars: NebulaStar[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    const size = roll > 0.88 ? 2 : 1;
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      base: 0.12 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.65 + Math.random() * 2.4,
      r: 175 + Math.floor(Math.random() * 80),
      g: 200 + Math.floor(Math.random() * 55),
      b: 248 + Math.floor(Math.random() * 7),
    });
  }
  return stars;
}

export default function MeteorShowerPixels() {
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
      stars = generateNebulaStars(w, h);
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
          ctx.fillStyle = isHead
            ? "rgba(255, 255, 255, 0.95)"
            : `rgba(200, 230, 255, ${alpha})`;
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
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.lineWidth = 1.15;
        ctx.scale(iconPx / 13, iconPx / 13);
        drawLandingSilhouette(ctx, L.kind);
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
  }, []);

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
