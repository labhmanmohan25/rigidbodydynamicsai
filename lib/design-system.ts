/**
 * Design System — Rigid Body Dynamics (Notion-like, minimal)
 *
 * Import the token bundle and compose class names:
 *   import { ds, cn } from '@/lib/design-system';
 *   <p className={cn(ds.text.body, isActive && "font-medium")}>…</p>
 *   <div className={cn(ds.card.base, className)}>…</div>
 *
 * When Tailwind utilities conflict (e.g. two paddings), add `tailwind-merge` and use:
 *   import { twMerge } from "tailwind-merge";
 *   className={twMerge(ds.button.primary, className)}
 *
 * CSS variables for colors, radii, shadows, and spacing live in `app/globals.css` (`:root` + `.dark`).
 */

type ClassValue = string | false | null | undefined;

/** Join DS fragments and conditional classes. For conflicting utilities use `twMerge`. */
export function cn(...inputs: ClassValue[]): string {
  return inputs.flat().filter(Boolean).join(" ");
}

/* ─── Spacing scale (Tailwind values) ─────────────────────────────────────
 *  0: 0     1: 4px    1.5: 6px   2: 8px    2.5: 10px
 *  3: 12px  4: 16px   5: 20px    6: 24px   8: 32px
 *  10: 40px 12: 48px  16: 64px   20: 80px
 *
 *  Preferred stops: 2 (8) · 3 (12) · 4 (16) · 6 (24) · 8 (32) · 12 (48)
 * ──────────────────────────────────────────────────────────────────────── */

export const ds = {
  /* ── Typography ──────────────────────────────────────────────────────── */
  text: {
    /** Page-level hero heading. Responsive clamp. */
    heroHeading:
      "text-[clamp(1.875rem,5vw+0.9rem,3.9rem)] font-normal leading-[1.08] tracking-tight",

    /** Major section heading (H2). */
    sectionHeading:
      "text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:text-white",

    /** Alias: section title (same as section heading). */
    sectionTitle:
      "text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:text-white",

    /** Sub-section heading (H3). Cards, step titles. */
    subHeading:
      "text-xl sm:text-2xl font-semibold leading-snug text-neutral-950 dark:text-white",

    /** Section description — directly below a heading. */
    sectionDesc:
      "text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-white/70",

    /** Body text inside cards, bullets, feature descriptions. */
    body:
      "text-[15px] sm:text-base leading-relaxed text-neutral-700 dark:text-white/70",

    /** Smaller body for compact areas — minimum for readability. */
    bodySmall:
      "text-sm leading-relaxed text-neutral-700 dark:text-white/70",

    /** Caption / metadata — timestamps, secondary info. */
    caption:
      "text-xs text-neutral-500 dark:text-white/50",

    /** Illustration text — the minimum readable size inside mockup UIs. */
    illus:
      "text-xs text-neutral-700 dark:text-white/75",

    /**
     * Illustration UI minimum — ties to `--ds-illus-min-font` in globals.css.
     * Prefer this over ad-hoc `text-[10px]` inside mockups.
     */
    illustrationMin:
      "text-[var(--ds-illus-min-font)] leading-snug text-[color:var(--ds-text-on-card)]",

    /** Illustration label — headings inside illustration panels. */
    illusHeading:
      "text-[13px] font-semibold text-neutral-800 dark:text-white/85",

    /** Illustration secondary text. */
    illusSecondary:
      "text-xs text-neutral-500 dark:text-white/55",

    /** Semantic text on any surface — uses CSS vars (see `.dark` in globals.css). */
    tone: {
      primary: "text-[color:var(--ds-text-primary)]",
      muted: "text-[color:var(--ds-text-muted-semantic)]",
      onCard: "text-[color:var(--ds-text-on-card)]",
    },

    /** Mono labels (step numbers, codes, IDs). */
    mono:
      "font-mono text-xs tabular-nums text-neutral-500 dark:text-white/45",

    /** Mono label — prominent (active step numbers, selected indices). */
    monoActive:
      "font-mono text-[13px] font-medium tabular-nums text-neutral-900 dark:text-white",

    /** Uppercase label — used for tags, badges, status indicators. */
    label:
      "text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600 dark:text-white/65",

    /** Metric / KPI number. Large, prominent. */
    metric:
      "text-[18px] sm:text-[21px] font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100",

    /** Metric subtitle — explains what the metric means. */
    metricDesc:
      "text-xs leading-snug text-neutral-500 dark:text-white/50",
  },

  /* ── Cards ───────────────────────────────────────────────────────────── */
  card: {
    /** Granular chrome — compose with `cn()` or use presets below. */
    chrome: {
      radius: "rounded-[var(--ds-radius-xl)]",
      radiusLg: "rounded-[var(--ds-radius-lg)]",
      radiusMd: "rounded-[var(--ds-radius-md)]",
      border: "border border-[color:var(--ds-card-border)]",
      shadow:
        "shadow-[var(--ds-shadow-card)] dark:shadow-[var(--ds-shadow-card-dark)]",
      bgElevated: "bg-[color:var(--ds-card-bg)]",
      /** Flush with page background (Notion-like panel). */
      bgPanel: "bg-background dark:bg-[#0a0a0a]",
    },

    /** Standard content card. */
    base: [
      "rounded-[var(--ds-radius-xl)] border border-[color:var(--ds-card-border)]",
      "bg-background dark:bg-[#0a0a0a]",
    ].join(" "),

    /** Interactive card — adds hover state. */
    interactive: [
      "rounded-[var(--ds-radius-xl)] border border-[color:var(--ds-card-border)]",
      "bg-background dark:bg-[#0a0a0a]",
      "transition-colors hover:bg-card dark:hover:bg-[#0f0f0f]",
    ].join(" "),

    /** Raised surface — off-white / dark card fill + subtle shadow. */
    elevated: [
      "rounded-[var(--ds-radius-xl)] border border-[color:var(--ds-card-border)]",
      "bg-[color:var(--ds-card-bg)]",
      "shadow-[var(--ds-shadow-card)] dark:shadow-[var(--ds-shadow-card-dark)]",
    ].join(" "),

    /** Card padding — standard. */
    padding: "p-5 sm:p-6",

    /** Illustration panel inside a step. Clean, flat. */
    illus: [
      "rounded-[var(--ds-radius-lg)] border border-neutral-200 dark:border-white/10",
      "bg-white dark:bg-neutral-900",
      "overflow-hidden",
    ].join(" "),

    /** Illustration panel — with subtle shadow (floating elements only). */
    illusFloat: [
      "rounded-[var(--ds-radius-lg)] border border-neutral-200 dark:border-white/10",
      "bg-white dark:bg-neutral-900",
      "overflow-hidden",
      "shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
    ].join(" "),
  },

  /* ── Buttons ─────────────────────────────────────────────────────────── */
  button: {
    /** Primary CTA (Book Demo, etc.). Dark fill, light text. */
    primary: [
      "inline-flex h-11 items-center justify-center rounded-[var(--ds-radius-md)]",
      "bg-neutral-900 dark:bg-white",
      "px-6 text-[13px] font-medium uppercase tracking-[0.14em]",
      "text-white dark:text-black",
      "transition-colors hover:bg-neutral-800 dark:hover:bg-white/90",
      "cursor-pointer",
    ].join(" "),

    /** Secondary / ghost button. Border only. */
    secondary: [
      "inline-flex h-10 items-center justify-center rounded-[var(--ds-radius-md)]",
      "border border-neutral-300 dark:border-white/15",
      "bg-transparent",
      "px-5 text-[13px] font-medium uppercase tracking-[0.14em]",
      "text-neutral-800 dark:text-white/80",
      "transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
      "cursor-pointer",
    ].join(" "),

    /** Ghost — same as secondary (outline / minimal). */
    ghost: [
      "inline-flex h-10 items-center justify-center rounded-[var(--ds-radius-md)]",
      "border border-neutral-300 dark:border-white/15",
      "bg-transparent",
      "px-5 text-[13px] font-medium uppercase tracking-[0.14em]",
      "text-neutral-800 dark:text-white/80",
      "transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
      "cursor-pointer",
    ].join(" "),

    /** Small action button inside illustrations. */
    action: [
      "inline-flex h-8 items-center justify-center rounded-[var(--ds-radius-md)]",
      "border border-neutral-200 dark:border-white/10",
      "bg-white dark:bg-white/5",
      "px-3 text-xs font-medium",
      "text-neutral-700 dark:text-white/75",
      "transition-colors hover:bg-neutral-50 dark:hover:bg-white/10",
      "cursor-pointer",
    ].join(" "),
  },

  /* ── Badges & Pills ──────────────────────────────────────────────────── */
  badge: {
    /** Neutral status badge (e.g., "active", "live"). */
    neutral: [
      "inline-flex items-center gap-1.5 rounded-md",
      "border border-neutral-200 dark:border-white/15",
      "bg-neutral-100 dark:bg-white/[0.04]",
      "px-2 py-0.5",
      "text-[11px] font-medium uppercase tracking-[0.1em]",
      "text-neutral-600 dark:text-white/65",
    ].join(" "),

    /** Success badge (green). */
    success: [
      "inline-flex items-center gap-1.5 rounded-md",
      "border border-emerald-200 dark:border-emerald-500/30",
      "bg-emerald-50 dark:bg-emerald-500/10",
      "px-2 py-0.5",
      "text-[11px] font-medium uppercase tracking-[0.1em]",
      "text-emerald-700 dark:text-emerald-300",
    ].join(" "),

    /** Warning badge (amber). */
    warning: [
      "inline-flex items-center gap-1.5 rounded-md",
      "border border-amber-200 dark:border-amber-500/30",
      "bg-amber-50 dark:bg-amber-500/10",
      "px-2 py-0.5",
      "text-[11px] font-medium uppercase tracking-[0.1em]",
      "text-amber-700 dark:text-amber-300",
    ].join(" "),

    /** Error / danger badge (red). */
    danger: [
      "inline-flex items-center gap-1.5 rounded-md",
      "border border-red-200 dark:border-red-500/30",
      "bg-red-50 dark:bg-red-500/10",
      "px-2 py-0.5",
      "text-[11px] font-medium uppercase tracking-[0.1em]",
      "text-red-700 dark:text-red-300",
    ].join(" "),
  },

  /* ── Borders ─────────────────────────────────────────────────────────── */
  border: {
    /** Standard divider — horizontal or vertical. */
    default: "border-neutral-200 dark:border-white/10",

    /** Subtle divider — inside cards. */
    subtle: "border-neutral-100 dark:border-white/5",

    /** Standard outer border color. */
    color: "border-neutral-200 dark:border-white/10",
  },

  /* ── Icon containers ─────────────────────────────────────────────────── */
  icon: {
    /** Standard icon wrapper (40×40 with border). */
    box: [
      "flex h-10 w-10 shrink-0 items-center justify-center",
      "rounded-lg border border-neutral-200 dark:border-white/10",
      "bg-white dark:bg-white/[0.04]",
      "text-neutral-700 dark:text-white/80",
    ].join(" "),

    /** Small icon wrapper (28×28). */
    boxSm: [
      "flex h-7 w-7 shrink-0 items-center justify-center",
      "rounded-md border border-neutral-200 dark:border-white/10",
      "bg-white dark:bg-white/[0.04]",
      "text-neutral-700 dark:text-white/80",
    ].join(" "),
  },

  /* ── Layout ──────────────────────────────────────────────────────────── */
  layout: {
    /** Standard section vertical padding. */
    sectionPy: "py-12 sm:py-16",

    /** Section shell: horizontal padding + site content max width (matches header). */
    sectionPx:
      "mx-auto w-full max-w-[var(--max-width-content)] px-4 sm:px-6",

    /** Tight section padding (less vertical space). */
    sectionPyTight: "py-8 sm:py-10",
  },

  /* ── Max widths (see `--max-width-*` in globals.css) ─────────────────── */
  maxWidth: {
    content: "max-w-[var(--max-width-content)]",
    readable: "max-w-[var(--max-width-readable)]",
    narrow: "max-w-[var(--max-width-narrow)]",
    /** Tailwind prose width (~65ch) when you do not need the CSS var. */
    prose: "max-w-prose",
  },

  /* ── Spacing — Tailwind presets + CSS var names (see `--ds-space-*`) ──── */
  space: {
    gapTight: "gap-2",
    gap: "gap-3 sm:gap-4",
    gapLoose: "gap-4 sm:gap-6",
    gapSection: "gap-6 sm:gap-8",
    stackTight: "space-y-2",
    stack: "space-y-4",
    stackLoose: "space-y-6 sm:space-y-8",
    pxInset: "px-4 sm:px-6",
    pyBlock: "py-3 sm:py-4",
    /** Vertical rhythm between stacked blocks inside a section. */
    stackBlocks: "space-y-8 sm:space-y-10",
  },

  /* ── Progress bar ────────────────────────────────────────────────────── */
  progress: {
    /** Track (background). */
    track:
      "h-2 w-full rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden",

    /** Fill (foreground) — pair with inline style for width. */
    fill:
      "h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-500",

    /** Fill — success variant. */
    fillSuccess:
      "h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500",

    /** Fill — warning variant. */
    fillWarning:
      "h-full rounded-full bg-amber-500 dark:bg-amber-400 transition-all duration-500",
  },

  /* ── Table ───────────────────────────────────────────────────────────── */
  table: {
    /** Table header cell. */
    th: [
      "text-[11px] font-semibold uppercase tracking-wider",
      "text-neutral-500 dark:text-white/50",
      "px-3 py-2 text-left",
      "border-b border-neutral-200 dark:border-white/10",
      "bg-neutral-50 dark:bg-white/[0.03]",
    ].join(" "),

    /** Table body cell. */
    td: [
      "text-xs text-neutral-700 dark:text-white/75",
      "px-3 py-2",
      "border-b border-neutral-100 dark:border-white/5",
    ].join(" "),

    /** Table body cell — numeric right-aligned. */
    tdNum: [
      "text-xs tabular-nums text-neutral-700 dark:text-white/75",
      "px-3 py-2 text-right",
      "border-b border-neutral-100 dark:border-white/5",
    ].join(" "),
  },
} as const;

/** Spacing in px — parallels `--ds-space-*` in `app/globals.css` for inline styles. */
export const spacingPx = {
  0: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export type Ds = typeof ds;

/* ─── Nestle product catalog (shared across steps 3, 5, 6, 10) ────────── */
export type NestleProduct = {
  sku: string;
  name: string;
  shortName: string;
  qty: number;
  stock: number;
  shelfLife: string;
  status: "ok" | "low" | "out";
};

/** Order tuned for Process visual 1: Maggi (SKU-104) row 3, low-stock Sunrise (SKU-302) row 4 — keeps zoom framing aligned. */
export const NESTLE_PRODUCTS: NestleProduct[] = [
  { sku: "SKU-118", name: "Nescafe Classic 50g",             shortName: "Nescafe Classic",   qty: 80,  stock: 310,  shelfLife: "18 mo", status: "ok" },
  { sku: "SKU-156", name: "KitKat 4-Finger 37.3g",          shortName: "KitKat",            qty: 200, stock: 860,  shelfLife: "12 mo", status: "ok" },
  { sku: "SKU-104", name: "Maggi 2-Min Noodles 70g",         shortName: "Maggi Noodles",     qty: 120, stock: 540,  shelfLife: "8 mo",  status: "ok" },
  { sku: "SKU-302", name: "Nescafe Sunrise 100g",            shortName: "Nescafe Sunrise",   qty: 90,  stock: 22,   shelfLife: "18 mo", status: "low" },
  { sku: "SKU-189", name: "Munch 23g",                       shortName: "Munch",             qty: 150, stock: 420,  shelfLife: "9 mo",  status: "ok" },
  { sku: "SKU-201", name: "Milkybar 25g",                    shortName: "Milkybar",          qty: 60,  stock: 280,  shelfLife: "10 mo", status: "ok" },
  { sku: "SKU-215", name: "Everyday Dairy Whitener 200g",    shortName: "Everyday",          qty: 40,  stock: 175,  shelfLife: "6 mo",  status: "ok" },
  { sku: "SKU-228", name: "Maggi Hot & Sweet Sauce 500g",    shortName: "Maggi Sauce",       qty: 50,  stock: 324,  shelfLife: "12 mo", status: "ok" },
  { sku: "SKU-345", name: "Maggi Masala-ae-Magic 6g",        shortName: "Masala Magic",      qty: 100, stock: 650,  shelfLife: "12 mo", status: "ok" },
  { sku: "SKU-401", name: "Bar-One 22g",                     shortName: "Bar-One",           qty: 80,  stock: 390,  shelfLife: "9 mo",  status: "ok" },
  { sku: "SKU-467", name: "Nestea Iced Tea Lemon 400g",      shortName: "Nestea Lemon",      qty: 35,  stock: 140,  shelfLife: "12 mo", status: "ok" },
  { sku: "SKU-502", name: "Cerelac Wheat-Rice Dal 300g",     shortName: "Cerelac",           qty: 25,  stock: 95,   shelfLife: "15 mo", status: "ok" },
  { sku: "SKU-533", name: "Alpino Peanut Butter 400g",       shortName: "Alpino PB",         qty: 30,  stock: 110,  shelfLife: "6 mo",  status: "ok" },
  { sku: "SKU-601", name: "Nescafe Gold 100g",               shortName: "Nescafe Gold",      qty: 20,  stock: 64,   shelfLife: "18 mo", status: "ok" },
];

/** The low-stock product that drives procurement in Step 5. */
export const LOW_STOCK_PRODUCT = NESTLE_PRODUCTS.find((p) => p.status === "low")!;
