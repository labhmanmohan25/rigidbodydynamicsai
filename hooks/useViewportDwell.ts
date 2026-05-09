"use client";

import { type RefObject, useEffect, useRef } from "react";

export const DEFAULT_MIN_INTERSECTION_RATIO = 0.22;
export const DEFAULT_MIN_DWELL_MS = 1_500;

export function viewportIntersectionRatio(el: Element): number {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return 0;
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  const visibleWidth = Math.min(rect.right, vw) - Math.max(rect.left, 0);
  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visibleWidth <= 0 || visibleHeight <= 0) return 0;
  return (visibleWidth * visibleHeight) / (rect.width * rect.height);
}

type UseViewportDwellOptions = {
  /** When this string changes, the observer is recreated. */
  effectKey: string;
  minIntersectionRatio?: number;
  minDwellMs?: number;
  onFlush: (dwellMs: number, useBeacon: boolean) => void;
};

/**
 * Tracks how long `rootRef` is meaningfully visible in the viewport, then calls `onFlush`
 * with elapsed milliseconds (only if ≥ minDwellMs).
 */
export function useViewportDwell(
  rootRef: RefObject<HTMLElement | null>,
  {
    effectKey,
    minIntersectionRatio = DEFAULT_MIN_INTERSECTION_RATIO,
    minDwellMs = DEFAULT_MIN_DWELL_MS,
    onFlush,
  }: UseViewportDwellOptions,
) {
  const onFlushRef = useRef(onFlush);
  onFlushRef.current = onFlush;
  const minDwellRef = useRef(minDwellMs);
  minDwellRef.current = minDwellMs;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let visibleSince: number | null = null;
    let wasVisible = false;

    const flush = (now: number, useBeacon: boolean) => {
      const start = visibleSince;
      visibleSince = null;
      wasVisible = false;
      if (start == null) return;
      const dwellMs = now - start;
      if (dwellMs < minDwellRef.current) return;
      onFlushRef.current(dwellMs, useBeacon);
    };

    const updateFromRatio = (ratio: number, useBeaconForFlush: boolean) => {
      const visible = ratio >= minIntersectionRatio;
      if (visible && !wasVisible) {
        wasVisible = true;
        visibleSince = performance.now();
      } else if (!visible && wasVisible) {
        flush(performance.now(), useBeaconForFlush);
      }
    };

    const thresholds = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.65, 0.8, 1];

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateFromRatio(entry.intersectionRatio, false);
      },
      { threshold: thresholds },
    );

    observer.observe(el);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSince != null) {
          flush(performance.now(), true);
        }
        return;
      }
      if (document.visibilityState === "visible") {
        requestAnimationFrame(() => {
          updateFromRatio(viewportIntersectionRatio(el), false);
        });
      }
    };

    const onPageHide = () => {
      if (visibleSince != null) {
        flush(performance.now(), true);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      if (visibleSince != null) {
        flush(performance.now(), false);
      }
      observer.disconnect();
    };
  }, [effectKey, minIntersectionRatio, rootRef]);
}
