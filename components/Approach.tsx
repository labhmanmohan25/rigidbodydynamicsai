"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const workflows = [
  {
    step: 1,
    title: "Content creator automation",
    steps: [
      "Scan top posts in your niche",
      "Summarize themes and generate posts in your tone",
      "Draft replies and schedule across platforms",
    ],
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Research & decision briefs",
    steps: [
      "Track competitors and industry news daily",
      "Extract funding, pricing, or product changes",
      "Prepare concise decision memos and notify the team",
    ],
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
];

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="approach"
      className="relative px-6 py-20 md:py-28 overflow-hidden"
      aria-labelledby="approach-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,211,238,0.04),transparent_70%)] pointer-events-none" />
      <div ref={ref} className="relative mx-auto max-w-[var(--max-width-content)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent/90 mb-3">
            Our approach
          </p>
          <h2
            id="approach-heading"
            className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            One{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              problem
            </span>{" "}
            at a time
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We pick one workflow, solve it end-to-end, then move to the next. No
            scattered features — focused execution.
          </p>
        </motion.div>

        {/* Flow: one → two with connector */}
        <motion.div
          className="mt-14 md:mt-16 relative"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            hidden: {},
          }}
        >
          {/* Connector line (visible on larger screens) */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block -translate-x-px"
            aria-hidden
          >
            <div className="sticky top-1/2 h-24 -translate-y-1/2 w-full">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {workflows.map(({ step, title, steps, icon }) => (
              <motion.article
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className="group relative rounded-2xl border border-border bg-card/60 p-8 md:p-9 backdrop-blur transition-all duration-300 hover:border-accent/25 hover:bg-card/80"
                style={{
                  boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.04), 0 20px 40px -12px rgba(0,0,0,0.25)",
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-accent font-display font-bold text-lg transition-colors group-hover:border-accent/40"
                      aria-hidden
                    >
                      {step}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-accent/90 transition-colors group-hover:border-accent/30">
                      {icon}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                    {title}
                  </h3>
                  <ul className="mt-5 space-y-3" role="list">
                    {steps.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                          aria-hidden
                        />
                        <span className="text-[15px] leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
