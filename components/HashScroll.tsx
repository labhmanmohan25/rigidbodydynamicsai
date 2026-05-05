"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll to #footer (and other hash targets) after client navigation, e.g. from /about to /#footer */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname]);

  return null;
}
