import fs from "fs";
import path from "path";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MARKET_OPPORTUNITY_SUB_RESEARCHES } from "./sub-researches";
import { SubResearchesList } from "./SubResearchesList";
import { VirtualizedMarkdown } from "./VirtualizedMarkdown";

export const metadata = {
  title: "AI Market Opportunity Research — RBD AI Reports",
  description:
    "20 problems across Healthcare, Manufacturing, and Hospitality. Combined economic burden in the trillions; gap ratios from 1.6x to 140x.",
};

function getContent(): string {
  const filePath = path.join(
    process.cwd(),
    "app/reports/market-opportunity-research/content.md"
  );
  return fs.readFileSync(filePath, "utf-8");
}

export default function MarketOpportunityReportPage() {
  const content = getContent();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "AI Market Opportunity Research" },
          ]}
        />

        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Research Report · February 24, 2026
        </p>

        <article className="prose-report markdown-report">
          <VirtualizedMarkdown content={content} />
        </article>

        {MARKET_OPPORTUNITY_SUB_RESEARCHES.length > 0 && (
          <SubResearchesList items={MARKET_OPPORTUNITY_SUB_RESEARCHES} />
        )}

        <div className="mt-16 border-t border-neutral-100 pt-8">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back to Research
          </Link>
        </div>
      </main>
    </div>
  );
}
