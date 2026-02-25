"use client";

import Link from "next/link";

const navLinks = [
  { href: "#vision", label: "Vision" },
  { href: "#approach", label: "Approach" },
];

// Same approach as background image: inline style url() so logo is always visible (public/logo.png)
const basePath = process.env.NODE_ENV === "production" ? "/rigidbodydynamicsai" : "";
const LOGO_URL = `${basePath || ""}/logo.png`;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[var(--max-width-content)] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <span
            className="h-8 w-[120px] flex-shrink-0 rounded bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${LOGO_URL}')`, backgroundSize: "contain" }}
            aria-hidden
          />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Rigid Body Dynamics
          </span>
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
