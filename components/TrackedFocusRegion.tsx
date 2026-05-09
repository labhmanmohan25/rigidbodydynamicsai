"use client";

import { type ReactNode, useCallback, useRef } from "react";
import { useViewportDwell } from "@/hooks/useViewportDwell";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type TrackedFocusRegionProps = {
  /** High-level area, e.g. `capabilities`, `product_steps`, `agents`. */
  focusRegion: string;
  /** Stable id within the region, e.g. `unified_visibility`, `capture_0`. */
  focusItemId: string;
  /** Optional human-readable label for GA explorations. */
  focusItemLabel?: string;
  children: ReactNode;
};

/**
 * Per-surface dwell: use inside scroll stacks, sticky cards, or any block where you want
 * time-on-screen for a specific child of a parent section.
 */
export default function TrackedFocusRegion({
  focusRegion,
  focusItemId,
  focusItemLabel,
  children,
}: TrackedFocusRegionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const onFlush = useCallback(
    (dwellMs: number, useBeacon: boolean) => {
      const payload: Record<string, unknown> = {
        focus_region: focusRegion,
        focus_item_id: focusItemId,
        dwell_time_msec: Math.round(dwellMs),
        dwell_seconds: Math.round((dwellMs / 1000) * 10) / 10,
        page_location: typeof window !== "undefined" ? window.location.href : undefined,
      };
      if (focusItemLabel) {
        payload.focus_item_label = focusItemLabel;
      }
      if (useBeacon) {
        payload.transport_type = "beacon";
      }
      window.gtag?.("event", "home_focus_dwell", payload);
    },
    [focusItemId, focusItemLabel, focusRegion],
  );

  useViewportDwell(rootRef, {
    effectKey: `${focusRegion}:${focusItemId}`,
    onFlush,
  });

  return <div ref={rootRef} className="h-full w-full min-h-0">{children}</div>;
}
