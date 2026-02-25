import fs from "fs";
import path from "path";

const REPORTS_DIR = path.join(process.cwd(), "content/market-opportunity-research");

export type SubReportMeta = {
  slug: string;
  title: string;
  category: "hc" | "hosp" | "mfg";
};

/** Get first # heading from markdown for display title */
function getTitleFromMarkdown(content: string, slug: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getCategory(slug: string): "hc" | "hosp" | "mfg" {
  if (slug.startsWith("hc_")) return "hc";
  if (slug.startsWith("hosp_")) return "hosp";
  if (slug.startsWith("mfg_")) return "mfg";
  return "hc";
}

export function getSubReportSlugs(): string[] {
  const files = fs.readdirSync(REPORTS_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getSubReportsMeta(): SubReportMeta[] {
  const slugs = getSubReportSlugs();
  return slugs.map((slug) => {
    const filePath = path.join(REPORTS_DIR, `${slug}.md`);
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      slug,
      title: getTitleFromMarkdown(content, slug),
      category: getCategory(slug),
    };
  });
}

export function getSubReportContent(slug: string): string | null {
  const filePath = path.join(REPORTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
