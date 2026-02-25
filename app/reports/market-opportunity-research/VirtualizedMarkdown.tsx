"use client";

import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { reportMarkdownComponents } from "./report-markdown-components";

const SECTION_HEIGHT_ESTIMATE = 400;

function splitMarkdownSections(content: string): string[] {
  if (!content.trim()) return [];
  const sections = content.split(/\n(?=## )|\n(?=### )/);
  return sections.map((s) => s.trim()).filter(Boolean);
}

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
