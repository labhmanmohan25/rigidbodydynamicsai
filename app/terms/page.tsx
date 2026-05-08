import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Rigid Body Dynamics",
  description: "Terms and conditions for Rigid Body Dynamics.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto min-h-[calc(100dvh-6rem)] max-w-2xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Rigid Body Dynamics
      </p>
      <p className="mt-8 text-muted-foreground leading-relaxed">
        This page will hold our terms and conditions. Content is coming soon.
        For questions, use{" "}
        <Link
          href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
          className="cursor-pointer text-foreground underline underline-offset-2 hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          get in touch
        </Link>
        .
      </p>
      <Link
        href="/"
        className="mt-10 inline-block cursor-pointer text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
      >
        ← Back home
      </Link>
    </div>
  );
}
