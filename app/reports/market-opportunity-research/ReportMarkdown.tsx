import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { reportMarkdownComponents } from "./report-markdown-components";

/**
 * Server-rendered markdown for report content. Renders full content into initial HTML
 * so it is visible even when client JS fails to load (e.g. basePath mismatch).
 */
export function ReportMarkdown({ content }: { content: string }) {
  return (
    <div className="report-markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={reportMarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
