import Image from "next/image";
import Link from "next/link";

export default function FinalCta() {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-black py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="relative mx-auto mb-2 aspect-[3/2] w-80 max-w-full sm:mb-3 sm:w-96 md:w-[28rem]">
          <Image
            src="/supply.png"
            alt="Pixel-art bear and fox running a factory conveyor belt of boxes"
            fill
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 448px"
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
            priority={false}
          />
        </div>
        <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,7vw+0.75rem,4.5rem)] font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl">
          Your operations are ready.
          Are you?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Onboard and upgrade your systems in weeks, not months. We integrate with
          your existing systems, so you do not need to migrate to another platform.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-white px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/90"
          >
            <span className="cta-text-roll" aria-label="Book a demo">
              <span aria-hidden="true">Book a demo</span>
              <span aria-hidden="true">Book a demo</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
