import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getSubResearchBySlug,
  MARKET_OPPORTUNITY_SUB_RESEARCHES,
} from "../sub-researches";

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

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl mt-0 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-neutral-900 mt-14 mb-4 scroll-mt-28">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-medium text-neutral-800 mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[0.9375rem] leading-relaxed text-neutral-600 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-neutral-200 pl-4 my-4 text-sm text-neutral-500 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-neutral-200 bg-neutral-50">
      {children}
    </thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 text-left font-medium text-neutral-700">
      {children}
    </th>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-neutral-100">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="bg-white">{children}</tr>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-neutral-600 align-top">{children}</td>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-neutral-800">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-neutral-100" />,
};

export default async function SubResearchPage({ params }: Props) {
  const { slug } = await params;
  const sub = getSubResearchBySlug(slug);
  if (!sub) notFound();

  const content = getReportContent(slug);
  if (!content) notFound();

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
          <Link
            href="/reports/market-opportunity-research"
            className="hover:text-neutral-600 transition-colors"
          >
            AI Market Opportunity Research
          </Link>
          <span>/</span>
          <span className="text-neutral-500">{sub.title}</span>
        </nav>

        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Sub-research · February 2026
        </p>

        <article className="prose-report markdown-report">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
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
