"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import GridBackground from "./GridBackground";
import GradientOrbs from "./GradientOrbs";

const items = [
  {
    title: "Proactive, not reactive",
    description: "Siri and Gemini respond when asked. We focus on execution before you have to ask.",
    icon: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Persistent memory",
    description: "Retains context, learns your preferences and priorities, and improves over time.",
    icon: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-8 0Z" />
        <path d="M12 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
      </svg>
    ),
  },
  {
    title: "Goal-driven automation",
    description: "Automates tasks across apps with a focus on achieving your goals, not single commands.",
    icon: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Learning and adapting",
    description: "Reduces manual input and increases productivity by getting better at what you need.",
    icon: (
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m22 7-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
  },
];

export default function Differentiators() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="differentiators"
      className="relative overflow-hidden px-6 py-24 md:py-32"
      aria-labelledby="differentiators-heading"
    >
      <GradientOrbs />
      <GridBackground />
      <div ref={ref} className="relative mx-auto max-w-[var(--max-width-content)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            The difference
          </motion.span>
          <h2
            id="differentiators-heading"
            className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-5xl lg:text-6xl"
          >
            Not another{" "}
            <span className="text-muted-foreground">assistant</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            We build systems that <span className="text-foreground font-medium">do the work</span> — with persistent memory and
            multi-step execution.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:justify-start"
          >
            <span className="text-sm text-muted-foreground/80">Assistants respond.</span>
            <span className="text-sm font-medium text-accent">We execute.</span>
          </motion.div>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            hidden: {},
          }}
        >
          {items.map(({ title, description, icon }) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="group relative"
            >
              <div className="relative h-full rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-card/80 hover:shadow-[0_0_40px_-12px_var(--accent)] md:p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80 text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent/10">
                  {icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
