"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

type Props = {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: boolean;
};

export function AnimatedSection({ children, className = "", staggerChildren }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={
        staggerChildren
          ? {
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              hidden: {},
            }
          : {
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              hidden: { opacity: 0, y: 24 },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      variants={defaultVariants}
      custom={index}
      className={className}
    >
      {children}
    </motion.div>
  );
}
