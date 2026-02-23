"use client";

import Link from "next/link";

const navLinks = [
  { href: "#vision", label: "Vision" },
  { href: "#approach", label: "Approach" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[var(--max-width-content)] items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Rigid Body Dynamics AI
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 focus-visible:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
