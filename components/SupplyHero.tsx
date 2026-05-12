"use client";

import Link from "next/link";
import MeteorShowerPixels from "./MeteorShowerPixels";
import { useHomeAppearance } from "./HomeAppearance";
import { cn, ds } from "@/lib/design-system";

export default function SupplyHero() {
  const { homeTheme } = useHomeAppearance();

  return (
    <section className="relative isolate overflow-hidden bg-background pb-40 pt-44 dark:bg-black sm:pb-48 sm:pt-52">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.82] dark:opacity-100">
        <MeteorShowerPixels surface={homeTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/45 via-transparent to-background/75 dark:hidden" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-neutral-950 sm:px-6 dark:text-white">
        <h1
          className={`mx-auto max-w-5xl text-neutral-950 dark:text-white ${ds.text.heroHeading}`}
        >
          AI agents to handle your supply chain
        </h1>

        <p
          className={cn(
            "mx-auto mt-5 max-w-xl",
            ds.text.body,
          )}
        >
          Turn your back-office into fully automated operations with 5x more
          efficiency — no new tools, no new hires. Built for{" "}
          <span className="underline underline-offset-[0.12em] decoration-from-font decoration-black dark:decoration-white">
            brand owners
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-[0.12em] decoration-from-font decoration-black dark:decoration-white">
            manufacturers
          </span>
          .
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <span className="cta-text-roll" aria-label="Book Demo">
              <span aria-hidden="true">Book Demo</span>
              <span aria-hidden="true">Book Demo</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
