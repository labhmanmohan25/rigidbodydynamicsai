"use client";

import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SECTION_HEIGHT_ESTIMATE = 400;

function splitMarkdownSections(content: string): string[] {
  if (!content.trim()) return [];
  const sections = content.split(/\n(?=## )|\n(?=### )/);
  return sections.map((s) => s.trim()).filter(Boolean);
}

const reportMarkdownComponents: Parameters<typeof ReactMarkdown>[0]["components"] = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl mt-0 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-neutral-900 mt-14 mb-4 scroll-mt-28">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-medium text-neutral-800 mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[0.9375rem] leading-relaxed text-neutral-600 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-2 text-[0.9375rem] text-neutral-600 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-neutral-200 pl-4 my-4 text-sm text-neutral-500 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-neutral-200 bg-neutral-50">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-medium text-neutral-700">
      {children}
    </th>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-neutral-100">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="bg-white">{children}</tr>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-600 align-top">{children}</td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-800">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-neutral-100" />,
};

type Props = {
  content: string;
};

export function VirtualizedMarkdown({ content }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => splitMarkdownSections(content), [content]);

  const virtualizer = useVirtualizer({
    count: sections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const section = sections[index];
      const lineCount = section.split("\n").length;
      return Math.max(SECTION_HEIGHT_ESTIMATE, lineCount * 22);
    },
    overscan: 2,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent?.includes("Firefox")
        ? undefined
        : (el) => el.getBoundingClientRect().height,
  });

  return (
    <div
      ref={parentRef}
      className="max-h-[calc(100vh-8rem)] overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const sectionContent = sections[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="pb-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={reportMarkdownComponents}
                >
                  {sectionContent}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
