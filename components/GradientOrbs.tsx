"use client";

import { motion } from "motion/react";

export default function GradientOrbs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full opacity-30 blur-[100px]"
        style={{ background: "var(--accent)" }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-1/4 h-[360px] w-[360px] rounded-full opacity-20 blur-[80px]"
        style={{ background: "#6366f1" }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full opacity-15 blur-[90px]"
        style={{ background: "var(--accent)" }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
