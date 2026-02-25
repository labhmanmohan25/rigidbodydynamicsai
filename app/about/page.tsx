import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = {
  title: "About Us — Rigid Body Dynamics",
  description: "About Rigid Body Dynamics and the people behind it.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

        <div className="mt-16 flex min-h-[60vh] flex-col justify-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Manmohan Labh
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Building AI Systems | Full-Stack Engineer | Ex-Postman | GYTI Awardee | I-ACE National
            Winner | IIT (ISM) Dhanbad
          </p>
          <p className="mt-6 text-sm leading-relaxed text-neutral-600">
          Researching AI, autonomous agents, and emerging technologies. Building an Agent-as-a-Service orchestration framework to compose and deploy intelligent workflows at scale, while also developing Tarmac, a journey-intelligence app live on the Play Store and App Store.
          </p>
          <Link
            href="https://www.linkedin.com/in/manmohanlabh/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            LinkedIn
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
