import { ds } from "@/lib/design-system";

const OUTCOMES = [
  {
    metric: "Zero lost orders",
    subtitle:
      "Every WhatsApp message, every Excel sheet  -  captured and confirmed automatically.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="h-5 w-5"
        aria-hidden
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 5v3M12 16v3M5 12h3M16 12h3M12 12h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    metric: "80% less admin time",
    subtitle: "Agents handle order entry, follow-ups, and coordination  -  your team focuses on decisions.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="h-5 w-5"
        aria-hidden
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 8.5V13l3 1.6" strokeLinecap="round" />
        <path d="M9.5 2.5h5M12 5V2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    metric: "4-week deployment",
    subtitle: "Live on your existing WhatsApp & Excel  -  no IT involvement needed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function OutcomesStrip() {
  return (
    <section className="w-full bg-background py-10 dark:bg-black sm:py-14">
      <div
        className="w-full border-y border-neutral-200 bg-background [background-size:24px_24px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:border-white/10 dark:bg-black dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid w-full grid-cols-1 gap-px bg-neutral-300/80 dark:bg-white/10 sm:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div
                key={o.metric}
                className="group relative flex items-center gap-3 bg-background px-5 py-5 transition-colors first:border-l first:border-neutral-200 last:border-r last:border-neutral-200 hover:bg-card dark:bg-black dark:first:border-white/10 dark:last:border-white/10 dark:hover:bg-white/[0.03] sm:py-6"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-neutral-700 dark:text-white/80">
                  {o.icon}
                </span>
                <div className="min-w-0">
                  <p className={ds.text.metric}>{o.metric}</p>
                  <p className={`mt-1 ${ds.text.metricDesc}`}>{o.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
