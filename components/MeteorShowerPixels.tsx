"use client";

import { useEffect, useRef } from "react";

const TRAIL_LEN = 14;
const MAX_METEORS = 28;

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
  size: number;
};

function spawnMeteor(w: number, meteors: Meteor[]) {
  if (meteors.length >= MAX_METEORS) return;
  const x = Math.random() * (w * 1.35) - w * 0.15;
  const y = -40 - Math.random() * 140;
  const speed = 2.8 + Math.random() * 4.5;
  const angle = Math.PI * (0.1 + Math.random() * 0.06);
  meteors.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    trail: [],
    size: 2 + (Math.random() > 0.65 ? 1 : 0),
  });
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

      if (time - lastSpawn > 140 + Math.random() * 160) {
        lastSpawn = time;
        spawnMeteor(w, meteors);
      }

      ctx.clearRect(0, 0, w, h);

      meteors = meteors.filter((m) => {
        m.x += m.vx;
        m.y += m.vy;
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
            m.size
          );
        }

        return m.x < w + 80 && m.y < h + 80 && m.x > -120;
      });

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
