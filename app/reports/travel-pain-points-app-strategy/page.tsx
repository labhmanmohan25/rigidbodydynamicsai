import fs from "fs";
import path from "path";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReportMarkdown } from "@/app/reports/market-opportunity-research/ReportMarkdown";

const RAW_FILE = "Travel Pain Points & App Strategy.md";

function getContent(): string {
  const filePath = path.join(process.cwd(), "app/reports/travel-pain-points-app-strategy", RAW_FILE);
  return fs.readFileSync(filePath, "utf-8");
}

export const metadata = {
  title: "Travel Pain Points & App Strategy — RBD AI Reports",
  description:
    "Market dynamics, traveler friction, willingness to pay, and the post-commoditization landscape in global travel and tourism.",
};

export default function TravelPainPointsReportPage() {
  const content = getContent();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Travel Pain Points & App Strategy" },
          ]}
        />

        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Research Report · February 26, 2026
        </p>

        <article className="prose-report markdown-report">
          <ReportMarkdown content={content} />
        </article>
      </main>
    </div>
  );
}
