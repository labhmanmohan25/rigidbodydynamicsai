"use client";

import Link from "next/link";
import Image from "next/image";
import MeteorShowerPixels from "./MeteorShowerPixels";
import TrustStrip from "./TrustStrip";
import { useHomeAppearance } from "./HomeAppearance";

export default function SupplyHero() {
  const { homeTheme } = useHomeAppearance();

  return (
    <section className="relative isolate overflow-hidden bg-background pb-24 pt-32 dark:bg-black sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.82] dark:opacity-100">
        <MeteorShowerPixels surface={homeTheme} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/45 via-transparent to-background/75 dark:hidden" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-neutral-950 sm:px-6 dark:text-white">
        <h1 className="mx-auto max-w-4xl text-[clamp(1.875rem,6vw+1rem,4.5rem)] font-semibold leading-[1.06] tracking-tight sm:text-6xl md:text-[72px]">
          Your team runs your operations on{" "}
          <span
            className="inline-flex items-center gap-2 align-middle text-[0.9em]"
            aria-label="Excel, WhatsApp, mail and phone channels"
          >
            <Image src="/icons/whatsapp.png" alt="WhatsApp" width={64} height={64} className="inline-block h-[0.9em] w-[0.9em]" />
            <Image src="/icons/excel.png" alt="Excel" width={64} height={64} className="inline-block h-[0.9em] w-[0.9em]" />
            <Image src="/icons/gmail.png" alt="Mail" width={64} height={64} className="inline-block h-[0.9em] w-[0.9em]" />
            <Image src="/icons/mobile.png" alt="Phone" width={64} height={64} className="inline-block h-[0.9em] w-[0.9em]" />
          </span>
          <br />
          We automate it!
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-white/55">
        AI agents that turn your WhatsApp messages, Emails, Excel sheets, and Phone calls into fully automated operations — no new tools, no new hires. Order
          processing, procurement, production, distribution, and credit -
          handled, not tracked.
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
