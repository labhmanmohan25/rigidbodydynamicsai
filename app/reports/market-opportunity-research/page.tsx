import fs from "fs";
import path from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MARKET_OPPORTUNITY_SUB_RESEARCHES } from "./sub-researches";
import { SubResearchesList } from "./SubResearchesList";

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
        <nav className="mb-10 flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/research" className="hover:text-neutral-600 transition-colors">
            Research
          </Link>
          <span>/</span>
          <span className="text-neutral-500">AI Market Opportunity Research</span>
        </nav>

        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Research Report · February 24, 2026
        </p>

        <article className="prose-report markdown-report">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl mt-0 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-neutral-900 mt-14 mb-4 scroll-mt-28">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-medium text-neutral-800 mt-10 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[0.9375rem] leading-relaxed text-neutral-600 mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-neutral-200 pl-4 my-4 text-sm text-neutral-500 italic">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-medium text-neutral-700">
                  {children}
                </th>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-neutral-100">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="bg-white">{children}</tr>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-neutral-600 align-top">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-neutral-800">
                  {children}
                </strong>
              ),
              hr: () => <hr className="my-8 border-neutral-100" />,
            }}
          >
            {content}
          </ReactMarkdown>
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
