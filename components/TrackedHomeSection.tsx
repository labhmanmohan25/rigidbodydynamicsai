"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
} from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Portion of the section area that must overlap the viewport to count as “in view”. */
const MIN_INTERSECTION_RATIO = 0.22;
/** Ignore very short passes (fast scroll / layout flicker). */
const MIN_DWELL_MS = 1_500;

function viewportIntersectionRatio(el: Element): number {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return 0;
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  const visibleWidth = Math.min(rect.right, vw) - Math.max(rect.left, 0);
  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visibleWidth <= 0 || visibleHeight <= 0) return 0;
  return (visibleWidth * visibleHeight) / (rect.width * rect.height);
}

type TrackedHomeSectionProps = {
  sectionId: string;
  children: ReactNode;
};

function sendDwell(sectionId: string, dwellMs: number, useBeacon: boolean) {
  if (dwellMs < MIN_DWELL_MS) return;
  const payload: Record<string, unknown> = {
    section_id: sectionId,
    dwell_time_msec: Math.round(dwellMs),
    dwell_seconds: Math.round((dwellMs / 1000) * 10) / 10,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  };
  if (useBeacon) {
    payload.transport_type = "beacon";
  }
  window.gtag?.("event", "home_section_dwell", payload);
}

export default function TrackedHomeSection({
  sectionId,
  children,
}: TrackedHomeSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleSinceRef = useRef<number | null>(null);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const flush = (now: number, useBeacon: boolean) => {
      const start = visibleSinceRef.current;
      visibleSinceRef.current = null;
      wasVisibleRef.current = false;
      if (start == null) return;
      sendDwell(sectionId, now - start, useBeacon);
    };

    const updateFromRatio = (ratio: number, useBeaconForFlush: boolean) => {
      const visible = ratio >= MIN_INTERSECTION_RATIO;
      if (visible && !wasVisibleRef.current) {
        wasVisibleRef.current = true;
        visibleSinceRef.current = performance.now();
      } else if (!visible && wasVisibleRef.current) {
        flush(performance.now(), useBeaconForFlush);
      }
    };

    const thresholds = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.65, 0.8, 1];

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateFromRatio(entry.intersectionRatio, false);
      },
      { threshold: thresholds }
    );

    observer.observe(el);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSinceRef.current != null) {
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
      if (visibleSinceRef.current != null) {
        flush(performance.now(), true);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      if (visibleSinceRef.current != null) {
        flush(performance.now(), false);
      }
      observer.disconnect();
    };
  }, [sectionId]);

  return <div ref={rootRef}>{children}</div>;
}
