"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const reactive = {
  title: "Reactive",
  summary:
    "Chat interfaces answer questions. You ask, they respond. Manual steps at every turn.",
};

const proactive = {
  title: "Proactive execution",
  summary:
    "AI that executes tasks autonomously. Multi-step goals, fewer prompts, real work done.",
};

export default function Paradigm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="paradigm"
      className="relative px-6 py-20 md:py-28"
      aria-labelledby="paradigm-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(34,211,238,0.04),transparent)]"
        aria-hidden
      />
      <div ref={ref} className="relative mx-auto max-w-[var(--max-width-content)]">
        <motion.div
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:max-w-md">
            <p className="text-sm font-medium uppercase tracking-widest text-accent/90 mb-3">
              The shift
            </p>
            <h2
              id="paradigm-heading"
              className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              From reactive to{" "}
              <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                proactive
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Move from question-answer loops to AI that runs tasks end-to-end.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground lg:gap-4">
            <span>Assistants respond</span>
            <span className="text-accent" aria-hidden>→</span>
            <span className="font-medium text-foreground">We execute</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            hidden: {},
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="group relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 md:p-8"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.02)" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
            <div className="relative">
              <span className="inline-block rounded-lg border border-border bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                Before
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-muted-foreground sm:text-2xl">
                {reactive.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {reactive.summary}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="group relative rounded-2xl border border-accent/30 bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_32px_-8px_rgba(34,211,238,0.25)] md:p-8"
            style={{
              boxShadow: "0 0 0 1px rgba(34,211,238,0.08), 0 20px 40px -12px rgba(0,0,0,0.3)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            <div className="relative">
              <span className="inline-block rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">
                After
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-accent sm:text-2xl">
                {proactive.title}
              </h3>
              <p className="mt-3 text-foreground/90 leading-relaxed">
                {proactive.summary}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
