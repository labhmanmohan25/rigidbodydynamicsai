import Link from "next/link";

export default function FinalCta() {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-background py-20 dark:bg-black sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,7vw+0.75rem,4.5rem)] font-normal leading-[1.08] tracking-tight text-neutral-950 sm:text-6xl md:text-7xl dark:text-white">
          Still running ops manually?
          <br />
          It&rsquo;s costing you growth.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-white/70">
          Every missed order, late dispatch, and unchecked credit limit is
          margin you don&rsquo;t get back. The businesses moving ahead
          are the ones automating now.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="cta-ai-glow-wrap">
            <span className="cta-ai-glow-backdrop" aria-hidden>
              <span className="cta-ai-glow-rotor" />
            </span>
            <Link
              href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-8 text-[13px] font-medium uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <span className="cta-text-roll" aria-label="Book a demo">
                <span aria-hidden="true">Book a demo</span>
                <span aria-hidden="true">Book a demo</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
