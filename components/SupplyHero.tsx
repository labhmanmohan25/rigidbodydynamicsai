"use client";

import Link from "next/link";
import Image from "next/image";
import MeteorShowerPixels from "./MeteorShowerPixels";
import TrustStrip from "./TrustStrip";

export default function SupplyHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-32 pb-24 sm:pt-40 sm:pb-32">
      <MeteorShowerPixels />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1 className="mx-auto max-w-4xl text-[clamp(1.875rem,6vw+1rem,4.5rem)] font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl md:text-[72px]">
          Your team runs your supply chain on{" "}
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

        <p className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-white/55 sm:text-base">
        AI agents that turn your WhatsApp messages, Emails, Excel sheets, and Phone calls into fully automated operations — no new tools, no new hires. Order
          processing, procurement, production, distribution, and credit -
          handled, not tracked.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-white px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/90"
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
