/** Stable GA-friendly id from a display label (e.g. "Unified Visibility" → "unified_visibility"). */
export function analyticsSlugFromLabel(label: string): string {
  const s = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return s || "item";
}
