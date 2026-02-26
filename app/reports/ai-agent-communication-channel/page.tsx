import fs from "fs";
import path from "path";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReportMarkdown } from "@/app/reports/market-opportunity-research/ReportMarkdown";

const RAW_FILE = "AI Agent Communication Channel Research.md";

function getContent(): string {
  const filePath = path.join(process.cwd(), "app/reports/ai-agent-communication-channel", RAW_FILE);
  return fs.readFileSync(filePath, "utf-8");
}

export const metadata = {
  title: "AI Agent Communication Channel Research — RBD AI Reports",
  description:
    "Analyzing the shift from human-centric messaging to machine-to-machine agentic communication. Architecture, throughput, and the case for new agent communication channels.",
};

export default function AIAgentCommunicationChannelReportPage() {
  const content = getContent();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "AI Agent Communication Channel Research" },
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
