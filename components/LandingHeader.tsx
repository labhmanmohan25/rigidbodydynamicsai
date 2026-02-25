"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const basePath = process.env.NODE_ENV === "production" ? "/rigidbodydynamicsai" : "";
const LOGO_SRC = `${basePath}/logo.png`;

const navLinks = [
  { href: "/research", label: "Research" },
];

export default function LandingHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navLinkClass = isHome
    ? "rounded-md px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
    : "rounded-md px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900 focus-visible:outline-offset-2";

  return (
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-center px-2 sm:top-4 sm:px-4">
      <div className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-3 py-3 shadow-lg backdrop-blur-sm ring-1 ring-inset ring-white/20 sm:w-auto sm:py-2" style={{boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)"}}>
        <Link
          href="/"
          className="mr-1 flex items-center justify-center rounded-md p-1 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          aria-label="Rigid Body Dynamics AI home"
        >
          <Image
            src={LOGO_SRC}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            priority
          />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={navLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="https://www.linkedin.com/company/rigid-body-dynamics-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex h-9 flex-shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 sm:ml-1 sm:h-8"
        >
          Get in touch
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
