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
  tagHighlight?: boolean | "golden";
};

const featuredArticle: ListItem = {
  title: "The Paradigm Shift to Agent-First Organizations",
  tag: "Business opportunity",
  tagHighlight: "golden",
  subtitle: "Specialized agents vs. general LLMs",
  date: "Feb 25, 2026",
  description:
    "Evaluating the transition from monolithic models to orchestrated specialized AI. A comprehensive analysis of specialized fine-tuned SLMs vs. frontier LLMs.",
  href: "/reports/specialized-agents-vs-general-llms",
  internal: true,
};

const mainArticles: ListItem[] = [
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
  {
    title: "AI Agent Communication Channel Research",
    subtitle: "Agentic communication · Infrastructure",
    date: "Feb 26, 2026",
    description:
      "Analyzing the shift from human-centric messaging to machine-to-machine agentic communication. Throughput limits, rate limiting mismatch, and the case for new agent communication channels.",
    href: "/reports/ai-agent-communication-channel",
    internal: true,
  },
  {
    title: "Travel Pain Points & App Strategy",
    subtitle: "Travel · Experience economy",
    date: "Feb 26, 2026",
    description:
      "Market dynamics, traveler friction, willingness to pay, and the post-commoditization landscape. Macro trends, taxonomy of friction, and behavioral economics of travel.",
    href: "/reports/travel-pain-points-app-strategy",
    internal: true,
  },
];

function subtitleForSlug(slug: string): string {
  if (slug.startsWith("hc_")) return "Healthcare";
  if (slug.startsWith("hosp_")) return "Hospitality";
  if (slug.startsWith("mfg_")) return "Manufacturing";
  return "";
}

const subReportItems: ListItem[] = MARKET_OPPORTUNITY_SUB_RESEARCHES.map((sub) => ({
  title: sub.title,
  subtitle: subtitleForSlug(sub.slug),
  date: sub.date,
  description: sub.description ?? undefined,
  href: sub.href,
  internal: true,
}));

function parseDate(dateStr: string): number {
  return new Date(dateStr).getTime();
}

const articles: ListItem[] = [...mainArticles, ...subReportItems].sort(
  (a, b) => parseDate(b.date) - parseDate(a.date)
);

export const metadata = {
  title: "Research — Rigid Body Dynamics",
  description: "Research publications and articles from Rigid Body Dynamics.",
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Research" }]} />

        <div className="mt-12">
          {/* Featured section — Specialized agents vs. general LLMs */}
          <section className="mb-14">
            <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-neutral-400">Featured</h2>
            <Link
              href={featuredArticle.href}
              className="group block"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-400">{featuredArticle.date}</span>
                {featuredArticle.tag && (
                  <span
                    className={
                      featuredArticle.tagHighlight === "golden"
                        ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                        : featuredArticle.tagHighlight
                          ? "rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700"
                          : "rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500"
                    }
                  >
                    {featuredArticle.tag}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-violet-800 sm:text-2xl">
                {featuredArticle.title}
              </h3>
              {featuredArticle.subtitle && (
                <p className="mt-1 text-sm text-neutral-500 italic">{featuredArticle.subtitle}</p>
              )}
              {featuredArticle.description && (
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{featuredArticle.description}</p>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors group-hover:text-violet-700">
                Read report
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          </section>

          {articles.length === 0 ? (
            <p className="text-sm text-neutral-400">Articles coming soon.</p>
          ) : (
            <>
              <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400">All research</h2>
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
                              <span
                                className={
                                  article.tagHighlight === "golden"
                                    ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                                    : article.tagHighlight
                                      ? "rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700"
                                      : "rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500"
                                }
                              >
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
