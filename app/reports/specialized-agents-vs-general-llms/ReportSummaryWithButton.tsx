"use client";

import { useState } from "react";

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function DropdownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type State = "idle" | "loading" | "show" | "closed";

export function ReportSummaryWithButton({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("idle");

  const handleSummarize = () => {
    setState("loading");
    const delay = 1800 + Math.random() * 700;
    setTimeout(() => setState("show"), delay);
  };

  const handleShowSummary = () => setState("show");
  const handleCloseSummary = () => setState("closed");

  if (state === "show") {
    return (
      <div id="report-summary" className="mb-14 rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 sm:p-8 relative">
        <button
          type="button"
          onClick={handleCloseSummary}
          className="absolute top-4 right-4 cursor-pointer rounded-md p-1.5 text-neutral-400 hover:bg-neutral-200/80 hover:text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 transition-colors"
          aria-label="Close summary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="pr-10 sm:pr-12">{children}</div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div
        id="report-summary"
        className="mb-14 rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 sm:p-8"
        aria-busy
        aria-live="polite"
      >
        <div className="flex flex-col items-center justify-center py-10 sm:py-14">
          <div className="relative mb-4 inline-flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 inline-flex h-10 w-10 animate-pulse rounded-full bg-neutral-200" aria-hidden />
            <SparklesIcon className="relative z-10 h-5 w-5 text-neutral-500" />
          </div>
          <p className="text-sm font-medium text-neutral-600">Generating summary…</p>
          <p className="mt-1 text-xs text-neutral-400">Analyzing report content</p>
          <div className="mt-6 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isClosed = state === "closed";
  return (
    <div className="mb-14">
      <button
        type="button"
        onClick={isClosed ? handleShowSummary : handleSummarize}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
        aria-label={isClosed ? "Show summary" : "Generate AI summary of this report"}
      >
        {isClosed ? (
          <>
            <DropdownIcon className="h-5 w-5 text-neutral-500" />
            Show summary
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 text-neutral-500" />
            Summarize
          </>
        )}
      </button>
    </div>
  );
}
