import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  getSubResearchBySlug,
  MARKET_OPPORTUNITY_SUB_RESEARCHES,
} from "../sub-researches";
import { ReportMarkdown } from "../ReportMarkdown";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return MARKET_OPPORTUNITY_SUB_RESEARCHES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sub = getSubResearchBySlug(slug);
  if (!sub) return { title: "Not Found" };
  return {
    title: `${sub.title} — AI Market Opportunity Research`,
    description: sub.description ?? undefined,
  };
}

function getReportContent(slug: string): string | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/reports/market-opportunity-research/reports",
      `${slug}.md`
    );
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export default async function SubResearchPage({ params }: Props) {
  const { slug } = await params;
  const sub = getSubResearchBySlug(slug);
  if (!sub) notFound();

  const content = getReportContent(slug);
  if (!content) notFound();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "AI Market Opportunity Research", href: "/reports/market-opportunity-research" },
            { label: sub.title },
          ]}
        />

        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Research Report · {sub.date}
        </p>

        <article className="prose-report markdown-report">
          <ReportMarkdown content={content} />
        </article>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-8">
          <Link
            href="/reports/market-opportunity-research"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Back to AI Market Opportunity Research
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Back to Research
          </Link>
        </div>
      </main>
    </div>
  );
}
