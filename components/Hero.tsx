"use client";

import Link from "next/link";
import { motion } from "motion/react";
import GridBackground from "./GridBackground";
import GradientOrbs from "./GradientOrbs";
import ChatMockup from "./ChatMockup";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <GradientOrbs />
      <GridBackground />
      <div className="relative mx-auto max-w-[var(--max-width-content)] text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            AI that does the work{" "}
            <span className="text-accent">for you</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            We research what&apos;s next in AI and make it accessible — one
            problem at a time.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="#approach"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Learn more
            </Link>
            <Link
              href="https://www.linkedin.com/company/rigid-body-dynamics-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-base font-medium text-foreground transition-colors hover:border-muted-foreground hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              get in touch
            </Link>
          </motion.div>
          <motion.div variants={item} className="mt-14 w-full">
            <ChatMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
