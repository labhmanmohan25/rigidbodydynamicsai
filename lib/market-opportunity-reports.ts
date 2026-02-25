import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "market-opportunity-research");

export type SubReportMeta = {
  slug: string;
  title: string;
};

/** Format slug as readable title (e.g. hc_01_physician_documentation_burden -> Physician Documentation Burden) */
function slugToTitle(slug: string): string {
  const withoutPrefix = slug
    .replace(/^(hc|hosp|mfg)_\d+_/, "")
    .replace(/_/g, " ");
  return withoutPrefix
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** All sub-report slugs and titles for the AI market opportunity research */
export function getMarketOpportunitySubReports(): SubReportMeta[] {
  const dir = CONTENT_DIR;
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      return { slug, title: slugToTitle(slug) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Get raw markdown content for a sub-report by slug */
export function getMarketOpportunityReportContent(slug: string): string | null {
  const safeSlug = slug.replace(/[^a-z0-9_]/gi, "");
  const filePath = path.join(CONTENT_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

/** All valid slugs for static params */
export function getMarketOpportunitySlugs(): string[] {
  return getMarketOpportunitySubReports().map((r) => r.slug);
}
