const OUTCOMES = [
  {
    metric: "99.99% accuracy",
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
    <section className="w-full bg-black pb-10 pt-2 sm:pb-14 sm:pt-4">
      <div
        className="w-full border-y border-white/10 bg-black"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid w-full grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div
                key={o.metric}
                className="group relative flex items-center justify-center gap-3 bg-black px-5 py-5 transition-colors first:border-l first:border-white/10 last:border-r last:border-white/10 hover:bg-white/[0.03] sm:py-6"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.035] text-white/85">
                  {o.icon}
                </span>
                <p className="min-w-0 text-center text-[18px] font-semibold leading-tight tracking-tight text-neutral-100 sm:text-[21px]">
                  {o.metric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
