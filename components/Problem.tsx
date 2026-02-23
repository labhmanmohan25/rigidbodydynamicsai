"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

const points = [
  {
    title: "Execution bandwidth",
    text: "High performers lack execution bandwidth — tools are available but underutilized.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Fragmented workflows",
    text: "Workflows span across 10+ apps: CRM, email, docs, social, analytics.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Integration gap",
    text: "Difficulty managing multiple platforms; need for an integrated solution.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
        <path d="M5 5l14 14" opacity="0.5" />
      </svg>
    ),
  },
];

const TERMINAL_LINES = [
  { text: "Assistants respond", status: "ok" as const },
  { text: "Multi-step execution", status: "fail" as const },
  { text: "Proactive task management", status: "fail" as const },
];

function BottleneckVisual() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const t = setInterval(() => {
      setVisible((v) => (v < TERMINAL_LINES.length ? v + 1 : v));
    }, 500);
    return () => clearInterval(t);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card/80 p-4 font-mono text-sm backdrop-blur sm:p-5"
      style={{
        boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.06), 0 20px 40px -12px rgba(0,0,0,0.4)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative flex items-center gap-2 mb-3">
        <span className="h-2 w-2 rounded-full bg-red-500/90" />
        <span className="h-2 w-2 rounded-full bg-amber-500/90" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/90" />
        <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">current state</span>
      </div>
      <div className="relative space-y-2">
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{
              opacity: i < visible ? 1 : 0.4,
              x: 0,
            }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <span className="text-muted-foreground select-none">&gt;</span>
            <span className="text-foreground/90">{line.text}</span>
            {i < visible && (
              <span className={line.status === "ok" ? "text-emerald-400" : "text-amber-400/90"}>
                {line.status === "ok" ? "✓" : "✗"}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border/80">
        <span className="text-muted-foreground text-xs">The real bottleneck: response without execution.</span>
      </div>
    </motion.div>
  );
}

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="problem"
      className="relative px-6 py-20 md:py-28 overflow-hidden"
      aria-labelledby="problem-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.06),transparent)] pointer-events-none" />
      <div ref={ref} className="relative mx-auto max-w-[var(--max-width-content)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12"
        >
          <div className="lg:max-w-xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent/90 mb-3">
              The problem
            </p>
            <h2
              id="problem-heading"
              className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              The real{" "}
              <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                bottleneck
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Assistants respond but don&apos;t execute. They lack multi-step goal
              execution and proactive task management.
            </p>
            <div className="mt-8 lg:mt-10 max-w-sm">
              <BottleneckVisual />
            </div>
          </div>
          <div className="flex-1 lg:pt-2">
            <motion.ul
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:max-w-md"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                hidden: {},
              }}
            >
              {points.map((item, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="group relative rounded-xl border border-border bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:border-accent/25 hover:bg-card/80"
                  style={{
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.02)",
                  }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                  <div className="relative">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/80 text-accent transition-colors group-hover:border-accent/30">
                      {item.icon}
                    </span>
                    <h3 className="mt-4 font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
