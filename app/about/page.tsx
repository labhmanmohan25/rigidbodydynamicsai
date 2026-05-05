import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = {
  title: "About Us — Rigid Body Dynamics",
  description: "About Rigid Body Dynamics and the people behind it.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16 sm:px-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

        <h1 className="mt-16 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          About us
        </h1>

        <div className="mt-12 flex min-h-[50vh] flex-col justify-center gap-16">
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">CEO</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Apurva Biswas
            </h2>
            <ul className="mt-6 list-outside list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 marker:text-neutral-400">
              <li>IITian (same alma mater as CEOs of Google & IBM)</li>
              <li>Awarded by Prime Minister of India</li>
              <li>Former Quant Strat at Goldman Sachs (FX and commodities)</li>
              <li>Leads market research, design, and product strategy</li>
            </ul>
            <Link
              href="https://www.linkedin.com/in/apurva-biswas/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              LinkedIn
              <span aria-hidden>→</span>
            </Link>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">CTO</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Manmohan Labh
            </h2>
            <ul className="mt-6 list-outside list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 marker:text-neutral-400">
              <li>IITian (same alma mater as CEOs of Google & IBM)</li>
              <li>Awarded by Prime Minister of India</li>
              <li>Senior SWE (5 yr experience, ex-Postman)</li>
              <li>Leads tech development and scalability</li>
              <li>Inventor: patented EEG-controlled medical bed (GYTI awardee)</li>
            </ul>
            <Link
              href="https://www.linkedin.com/in/manmohanlabh/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              LinkedIn
              <span aria-hidden>→</span>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
