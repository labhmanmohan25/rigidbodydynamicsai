export default function TrustStrip() {
  const partners = [
    "PROCUREMENT",
    "PRODUCTION",
    "WAREHOUSING",
    "DISTRIBUTION",
    "RETAIL",
    "FINANCE",
  ];

  return (
    <section className="bg-transparent pt-8 pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-neutral-500 dark:text-white/40">
          {partners.map((p) => (
            <span
              key={p}
              className="text-[12px] font-medium tracking-[0.2em] transition-colors hover:text-neutral-800 dark:hover:text-white/80"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
