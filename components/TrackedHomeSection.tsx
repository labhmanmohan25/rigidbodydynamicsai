"use client";

import { type ReactNode, useCallback, useRef } from "react";
import { useViewportDwell } from "@/hooks/useViewportDwell";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type TrackedHomeSectionProps = {
  sectionId: string;
  children: ReactNode;
};

export default function TrackedHomeSection({
  sectionId,
  children,
}: TrackedHomeSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const onFlush = useCallback(
    (dwellMs: number, useBeacon: boolean) => {
      const payload: Record<string, unknown> = {
        section_id: sectionId,
        dwell_time_msec: Math.round(dwellMs),
        dwell_seconds: Math.round((dwellMs / 1000) * 10) / 10,
        page_location:
          typeof window !== "undefined" ? window.location.href : undefined,
      };
      if (useBeacon) {
        payload.transport_type = "beacon";
      }
      window.gtag?.("event", "home_section_dwell", payload);
    },
    [sectionId],
  );

  useViewportDwell(rootRef, {
    effectKey: sectionId,
    onFlush,
  });

  return <div ref={rootRef}>{children}</div>;
}
