import fs from "fs";
import path from "path";

const REPORTS_DIR = path.join(
  process.cwd(),
  "content/reports/market-opportunity-research"
);

export type ReportMeta = { slug: string; title: string };

function slugFromFilename(name: string): string {
  return name.replace(/\.md$/i, "");
}

/** Get all report slugs by reading the content directory. */
export function getReportSlugs(): string[] {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => slugFromFilename(f))
    .sort();
}

/** Get title from first # heading in markdown, or fallback to slug. */
function getTitleFromMarkdown(content: string, slug: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return slug.replace(/_/g, " ");
}

/** Get all reports with slug and title. */
export function getAllReports(): ReportMeta[] {
  const slugs = getReportSlugs();
  return slugs.map((slug) => {
    const raw = getReportContent(slug);
    const title = raw ? getTitleFromMarkdown(raw, slug) : slug.replace(/_/g, " ");
    return { slug, title };
  });
}

/** Get raw markdown content for a report by slug. */
export function getReportContent(slug: string): string | null {
  const safeSlug = slug.replace(/[^a-z0-9_-]/gi, "");
  const filePath = path.join(REPORTS_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
