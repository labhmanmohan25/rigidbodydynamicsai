import Image from "next/image";
import Link from "next/link";

export default function FinalCta() {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-background py-8 dark:bg-black sm:py-10">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="relative mx-auto mb-2 aspect-[3/2] w-80 max-w-full sm:mb-3 sm:w-96 md:w-[28rem]">
          <Image
            src="/supply-light.png"
            alt="Pixel-art bear and fox running a factory conveyor belt of boxes"
            fill
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 448px"
            className="object-contain dark:hidden"
            style={{ imageRendering: "pixelated" }}
            priority={false}
          />
          <Image
            src="/supply.png"
            alt="Pixel-art bear and fox running a factory conveyor belt of boxes"
            fill
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 448px"
            className="hidden object-contain dark:block"
            style={{ imageRendering: "pixelated" }}
            priority={false}
          />
        </div>
        <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,7vw+0.75rem,4.5rem)] font-semibold leading-[1.08] tracking-tight text-neutral-950 sm:text-6xl md:text-7xl dark:text-white">
          Your team already runs on{" "}
          <span
            className="inline-flex items-center gap-2 align-middle text-[0.88em]"
            aria-label="WhatsApp, Excel, mail, and phone channels"
          >
            <Image
              src="/icons/whatsapp.png"
              alt="WhatsApp"
              width={64}
              height={64}
              className="inline-block h-[0.9em] w-[0.9em]"
            />
            <Image
              src="/icons/excel.png"
              alt="Excel"
              width={64}
              height={64}
              className="inline-block h-[0.9em] w-[0.9em]"
            />
            <Image
              src="/icons/gmail.png"
              alt="Mail"
              width={64}
              height={64}
              className="inline-block h-[0.9em] w-[0.9em]"
            />
            <Image
              src="/icons/mobile.png"
              alt="Phone"
              width={64}
              height={64}
              className="inline-block h-[0.9em] w-[0.9em]"
            />
          </span>
          . Now it runs itself.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-white/80">
          No migration. No new software to learn. No 6-month implementation. We
          plug into what you already do - and your operations start running
          automatically in weeks.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-xs uppercase tracking-[0.18em] text-neutral-500 sm:text-sm dark:text-white/50">
          WhatsApp · Excel · Phone · Tally · Paper
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-white/80">
          Works with your existing channels{" "}
          <span
            className="inline-flex items-center gap-1 align-middle"
            aria-label="Excel, WhatsApp, mail and phone channels"
          >
            <Image src="/icons/whatsapp.png" alt="WhatsApp" width={48} height={48} className="inline-block h-[1em] w-[1em]" />
            <Image src="/icons/excel.png" alt="Excel" width={48} height={48} className="inline-block h-[1em] w-[1em]" />
            <Image src="/icons/gmail.png" alt="Mail" width={48} height={48} className="inline-block h-[1em] w-[1em]" />
            <Image src="/icons/mobile.png" alt="Phone" width={48} height={48} className="inline-block h-[1em] w-[1em]" />
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
