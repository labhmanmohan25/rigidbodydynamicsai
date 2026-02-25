"use client";

import Link from "next/link";
import { useState } from "react";

const INITIAL_VISIBLE = 2;

type SubResearch = {
  href: string;
  title: string;
  description?: string;
};

export function SubResearchesList({ items }: { items: readonly SubResearch[] }) {
  const [expanded, setExpanded] = useState(false);
  const total = items.length;
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE);
  const hasMore = total > INITIAL_VISIBLE;

  return (
    <div className="mb-10 rounded-lg border border-neutral-200 bg-neutral-50/50 px-5 py-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-500">
        Sub-researches
      </p>
      <ul className="space-y-5">
        {visibleItems.map((sub) => (
          <li key={sub.href}>
            <Link href={sub.href} className="block group">
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
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2 transition-colors"
        >
          {expanded
            ? "Show less"
            : `Show ${total - INITIAL_VISIBLE} more`}
        </button>
      )}
    </div>
  );
}
