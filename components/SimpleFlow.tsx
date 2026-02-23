"use client";

import { motion } from "motion/react";

type FlowStep = {
  title: string;
  description: string;
  icon: string;
};

const CAD_FLOW: FlowStep[] = [
  {
    title: "Your 2D drawing",
    description: "Upload a blueprint or technical sketch",
    icon: "📐",
  },
  {
    title: "AI understands it",
    description: "Reads dimensions, views, and intent",
    icon: "✨",
  },
  {
    title: "You get a 3D model",
    description: "Ready to use, simulate, or share",
    icon: "🎯",
  },
];

const MARKETING_FLOW: FlowStep[] = [
  {
    title: "You write one message",
    description: "What you want to tell customers",
    icon: "✉️",
  },
  {
    title: "AI adapts for each person",
    description: "Right tone, language, and offer",
    icon: "✨",
  },
  {
    title: "Customers get relevant replies",
    description: "Feels personal, scales to everyone",
    icon: "💬",
  },
];

type FlowVariant = "cad" | "marketing";

export default function SimpleFlow({ variant = "cad" }: { variant?: FlowVariant }) {
  const steps = variant === "cad" ? CAD_FLOW : MARKETING_FLOW;
  const flowLabel =
    variant === "cad"
      ? "From 2D drawing to 3D — in plain English"
      : "One message, many customers — done right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="relative mx-auto max-w-2xl"
    >
      <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
        {flowLabel}
      </p>
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.15 }}
            className="flex flex-1 flex-col items-center sm:flex-row sm:flex-initial"
          >
            <div className="flex w-full max-w-[200px] flex-col items-center rounded-xl border border-border bg-card/90 p-4 text-center shadow-lg backdrop-blur sm:w-[160px] sm:p-5">
              <span className="mb-2 text-2xl sm:text-3xl" aria-hidden>
                {step.icon}
              </span>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {step.description}
              </p>
            </div>
            {i < steps.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.15 }}
                className="mt-2 text-muted-foreground sm:mt-0 sm:px-1 sm:text-xl"
                aria-hidden
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
