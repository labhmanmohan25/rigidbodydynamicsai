"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  { prefix: "→", text: "Connecting to systems...", status: "success" },
  { prefix: "→", text: "Loading context", status: "success" },
  { prefix: "✦", text: "AI: Analyzing workflow", status: "idle" },
  { prefix: "✦", text: "AI: Executing next steps", status: "idle" },
  { prefix: "✦", text: "AI: Task complete", status: "idle" },
];

export default function TerminalMockup() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible((v) => (v < LINES.length ? v + 1 : v));
    }, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="relative mx-auto max-w-md rounded-xl border border-border bg-card/90 p-4 font-mono text-sm shadow-xl backdrop-blur sm:p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-muted-foreground">terminal</span>
      </div>
      <div className="space-y-1.5">
        {LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{
              opacity: i < visible ? 1 : 0,
              x: i < visible ? 0 : -8,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="text-accent">{line.prefix}</span>
            <span className="text-muted-foreground">{line.text}</span>
            {line.status === "success" && i < visible && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400/90"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-2 flex items-center gap-1 text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <span className="inline-block h-3 w-0.5 bg-accent" /> Ready
      </motion.div>
    </motion.div>
  );
}
