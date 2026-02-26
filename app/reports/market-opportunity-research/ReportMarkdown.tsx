import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { reportMarkdownComponents } from "./report-markdown-components";

/**
 * Server-rendered markdown for report content. Renders full content into initial HTML
 * so it is visible even when client JS fails to load (e.g. basePath mismatch).
 * Supports LaTeX math via remark-math and rehype-katex ($...$ and $$...$$).
 */
export function ReportMarkdown({ content }: { content: string }) {
  return (
    <div className="report-markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={reportMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
