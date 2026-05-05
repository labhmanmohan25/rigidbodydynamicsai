import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 dark:text-neutral-500"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">/</span>}
          {item.href != null ? (
            <Link
              href={item.href}
              className="cursor-pointer transition-colors hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-500 dark:text-neutral-300" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
