"use client";

import Link from "next/link";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const ROW_HEIGHT_ESTIMATE = 88;

type SubResearch = {
  href: string;
  title: string;
  description?: string;
};

export function SubResearchesList({ items }: { items: readonly SubResearch[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 5,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent?.includes("Firefox")
        ? undefined
        : (el) => el.getBoundingClientRect().height,
  });

  return (
    <div className="mb-10 rounded-lg border border-neutral-200 bg-neutral-50/50 px-5 py-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-500">
        Sub-researches
      </p>
      <div
        ref={parentRef}
        className="max-h-[min(70vh,480px)] overflow-auto rounded-md"
        style={{ contain: "strict" }}
      >
        <ul
          className="relative w-full space-y-5"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const sub = items[virtualRow.index];
            return (
              <li
                key={sub.href}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                className="absolute left-0 top-0 w-full pb-5"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Link href={sub.href} className="block group pr-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2 transition-colors group-hover:text-neutral-900 group-hover:decoration-neutral-500">
                      {sub.title}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                      February 2026
                    </span>
                  </div>
                  {sub.description && (
                    <p className="mt-1.5 text-sm text-neutral-600 leading-snug max-w-2xl">
                      {sub.description}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
