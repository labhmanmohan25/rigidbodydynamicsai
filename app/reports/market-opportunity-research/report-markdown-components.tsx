import type { Components } from "react-markdown";

export const reportMarkdownComponents: Components = {
  img: ({ src, alt, ...props }) => {
    if (src == null || src === "") return null;
    return <img src={src} alt={alt ?? ""} {...props} />;
  },
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
  // Wrap display math so it doesn’t overflow on small screens
  span: ({ className, children, ...props }) => {
    if (typeof className === "string" && className.includes("katex-display")) {
      return (
        <div className="my-4 overflow-x-auto overflow-y-hidden" {...props}>
          <span className={className}>{children}</span>
        </div>
      );
    }
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  },
};
