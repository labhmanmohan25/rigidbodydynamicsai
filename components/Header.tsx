"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "#vision", label: "Vision" },
  { href: "#approach", label: "Approach" },
];

// Logo: public/rbdlogo.svg (replace with public/rbdlogo.jpg if you add a custom image)
const basePath = process.env.NODE_ENV === "production" ? "/rigidbodydynamicsai" : "";
const LOGO_SRC = `${basePath}/rbdlogo.svg`;

export default function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[var(--max-width-content)] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {!logoError ? (
            <Image
              src={LOGO_SRC}
              alt="RBD"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
              onError={() => setLogoError(true)}
            />
          ) : null}
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Rigid Body Dynamics AI
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
