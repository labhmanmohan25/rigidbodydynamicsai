"use client";

import Link from "next/link";
import LeadersCarousel from "./LeadersCarousel";
import { cn, ds } from "@/lib/design-system";

export default function SupplyHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pt-44 pb-0 dark:bg-black sm:pt-52">
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
          Turn your back-office into fully automated operations with <strong>5x more
          efficiency</strong>  -  no new tools, no new hires. Built for{" "}
     
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

      <div className="relative z-10 mt-16 sm:mt-20">
        <LeadersCarousel />
      </div>
    </section>
  );
}
