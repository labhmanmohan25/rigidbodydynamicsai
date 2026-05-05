"use client";

import Link from "next/link";
import MeteorShowerPixels from "./MeteorShowerPixels";

export default function SupplyHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-32 pb-24 sm:pt-40 sm:pb-32">
      <MeteorShowerPixels />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1 className="mx-auto max-w-4xl text-[clamp(1.875rem,6vw+1rem,4.5rem)] font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl md:text-[72px]">
          Your supply chain decides what to do.
          <br />
          We handle the rest.
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          Live operations, autonomous agents and field-channel ingestion across
          procurement, production, distribution, retail and credit — for
          Indian FMCG manufacturers.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/90"
          >
            Book Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
