"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function VisionCta() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden px-6 py-20 md:py-28"
      aria-labelledby="vision-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div
          className="absolute -left-1/4 top-0 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "#6366f1" }}
        />
      </div>
      <div className="relative mx-auto max-w-[var(--max-width-content)] text-center">
        <motion.h2
          id="vision-heading"
          className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          Making AI that actually executes
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          We&apos;re building the layer that turns automation into intuition —
          one problem at a time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="https://www.linkedin.com/company/rigid-body-dynamics-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            get in touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
