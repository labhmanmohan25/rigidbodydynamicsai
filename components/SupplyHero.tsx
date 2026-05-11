"use client";

import Link from "next/link";
import Image from "next/image";
import MeteorShowerPixels from "./MeteorShowerPixels";
import TrustStrip from "./TrustStrip";
import { useHomeAppearance } from "./HomeAppearance";

export default function SupplyHero() {
  const { homeTheme } = useHomeAppearance();

  return (
    <section className="relative isolate overflow-hidden bg-background pb-32 pt-32 dark:bg-black sm:pb-40 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.82] dark:opacity-100">
        <MeteorShowerPixels surface={homeTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/45 via-transparent to-background/75 dark:hidden" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-neutral-950 sm:px-6 dark:text-white">
        <h1 className="mx-auto max-w-5xl text-[clamp(1.875rem,5vw+0.9rem,3.9rem)] font-normal leading-[1.08] tracking-tight sm:text-6xl md:text-[60px]">
          AI agents for operations:  
          <br className="hidden md:block" />
          built for{" "}
          <span className="inline">
            <span className="underline underline-offset-[0.12em] decoration-from-font decoration-black dark:decoration-white">
              brand owners
            </span>
            ,{" "}
            <span className="underline underline-offset-[0.12em] decoration-from-font decoration-black dark:decoration-white">
              manufacturers
            </span>
            {" "}and{" "}
            <span className="underline underline-offset-[0.12em] decoration-from-font decoration-black dark:decoration-white">
              distributors
            </span>
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/55">
          AI agents that turn your{" "}
          <span className="inline-flex items-center gap-1 align-middle" aria-label="WhatsApp, email, Excel, and phone channels">
            <Image src="/icons/whatsapp.png" alt="WhatsApp" width={64} height={64} className="inline-block h-[1.1em] w-[1.1em]" />
            <Image src="/icons/gmail.png" alt="Email" width={64} height={64} className="inline-block h-[1.1em] w-[1.1em]" />
            <Image src="/icons/excel.png" alt="Excel" width={64} height={64} className="inline-block h-[1.1em] w-[1.1em]" />
            <Image src="/icons/mobile.png" alt="Phone" width={64} height={64} className="inline-block h-[1.1em] w-[1.1em]" />
          </span>{" "}
          into fully automated operations - no new tools, no new hires. Reduce operational load today and unlock rapid growth tomorrow.
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

        <TrustStrip />
      </div>
    </section>
  );
}
