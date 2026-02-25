import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MARKET_OPPORTUNITY_SUB_RESEARCHES } from "@/app/reports/market-opportunity-research/sub-researches";

type ListItem = {
  title: string;
  subtitle?: string;
  description?: string;
  href: string;
  internal: boolean;
  date: string;
  tag?: string;
};

const mainArticles: ListItem[] = [
  {
    title: "The Paradigm Shift to Agent-First Organizations",
    subtitle: "Specialized agents vs. general LLMs",
    date: "Feb 25, 2026",
    description:
      "Evaluating the transition from monolithic models to orchestrated specialized AI. A comprehensive analysis of specialized fine-tuned SLMs vs. frontier LLMs.",
    href: "/reports/specialized-agents-vs-general-llms",
    internal: true,
  },
  {
    title: "AI Market Opportunity Research",
    tag: "Conclusion report",
    subtitle: "Healthcare · Manufacturing · Hospitality",
    date: "Feb 24, 2026",
    description:
      "20 problems across three sectors with a combined economic burden in the trillions. Gap ratios from 1.6x to 140x; individual problem reports linked within.",
    href: "/reports/market-opportunity-research",
    internal: true,
  },
];

const subReportItems: ListItem[] = MARKET_OPPORTUNITY_SUB_RESEARCHES.map((sub) => ({
  title: sub.title,
  date: "Feb 24, 2026",
  description: sub.description ?? undefined,
  href: sub.href,
  internal: true,
}));

const articles: ListItem[] = [...mainArticles, ...subReportItems];

export const metadata = {
  title: "Research — Rigid Body Dynamics",
  description: "Research publications and articles from Rigid Body Dynamics.",
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Research" }]} />
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Research</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Publications and articles from our lab.
        </p>

        <div className="mt-12">
          {articles.length === 0 ? (
            <p className="text-sm text-neutral-400">Articles coming soon.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {articles.map((article) => (
                <li key={article.href} className="py-7">
                  <Link
                    href={article.href}
                    {...(!article.internal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-medium text-neutral-900 transition-colors group-hover:text-neutral-600">
                            {article.title}
                          </h2>
                          {article.tag && (
                            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                              {article.tag}
                            </span>
                          )}
                        </div>
                        {article.subtitle && (
                          <p className="mt-0.5 text-sm text-neutral-500 italic">{article.subtitle}</p>
                        )}
                        {article.description && (
                          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{article.description}</p>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors group-hover:text-neutral-600">
                          Read report
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-neutral-400 whitespace-nowrap">{article.date}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
