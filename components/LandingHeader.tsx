"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { HomeTheme } from "@/components/HomeAppearance";
import { useHomeAppearance } from "@/components/HomeAppearance";

// Same approach as background image on home page: inline style url() so logo is always visible
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOGO_URL = basePath ? `${basePath}/logo.png` : "/logo.png";
const LOGO_WHITE_URL = basePath ? `${basePath}/logowhite.png` : "/logowhite.png";

const navLinks = [
  { href: "/", label: "the product" },
  { href: "/about", label: "the team" },
  { href: "/#final-cta", label: "everything else" },
] as const;

function HomeThemeToggle({
  value,
  onChange,
  variant,
}: {
  value: HomeTheme;
  onChange: (next: HomeTheme) => void;
  variant: "on-dark-hero" | "on-light-hero";
}) {
  const segment =
    "relative z-10 cursor-pointer rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors sm:px-3 sm:text-[11px] max-md:px-2";
  const shell =
    variant === "on-dark-hero"
      ? "border border-white/25 bg-black/25 p-0.5 backdrop-blur-sm"
      : "border border-neutral-200 bg-white/90 p-0.5 shadow-sm backdrop-blur-sm";
  return (
    <div role="group" aria-label="Light or dark appearance" className={`flex shrink-0 items-center rounded-md ${shell}`}>
      {(["light", "dark"] as const).map((mode) => {
        const selected = value === mode;
        const inactive =
          variant === "on-dark-hero"
            ? "text-white/55 hover:text-white"
            : "text-neutral-500 hover:text-neutral-800";
        const active =
          variant === "on-dark-hero"
            ? "text-white"
            : "text-neutral-900";
        const pill =
          variant === "on-dark-hero"
            ? "bg-white/20"
            : "bg-neutral-100 shadow-inner";
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(mode)}
            className={`${segment} ${selected ? active : inactive}`}
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 rounded-sm transition-colors ${
                selected ? pill : "bg-transparent"
              }`}
            />
            <span className="relative">{mode}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function LandingHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const isTintedLanding = pathname === "/" || pathname === "/about";
  const { homeTheme, setHomeTheme, showHomeThemeToggle } = useHomeAppearance();
  const landingLight = isTintedLanding && homeTheme === "light";
  const landingDark = isTintedLanding && homeTheme === "dark";
  const logoUrl = landingDark ? LOGO_WHITE_URL : LOGO_URL;

  const isAbout = pathname === "/about";
  const baseNavClass = landingDark
    ? "cursor-pointer rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 md:py-1.5"
    : "cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900 focus-visible:outline-offset-2 md:py-1.5";

  const ctaBase = landingDark
    ? "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-white px-4 text-sm font-medium text-black transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 md:bg-foreground md:text-background"
    : "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900 focus-visible:outline-offset-2";

  /** Desktop / drawer compact pill */
  const ctaClass = `${ctaBase} w-auto shrink-0`;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-center px-2 sm:top-4 sm:px-4">
      <div
        className={`flex w-full max-w-[min(100vw-1rem,var(--max-width-content))] flex-col rounded-xl px-3 py-2 shadow-lg backdrop-blur-sm ring-1 ring-inset md:w-auto md:py-2 ${
          landingDark ? "bg-white/10 ring-white/20" : "bg-white/95 ring-black/10"
        }`}
        style={{
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <div className="flex w-full min-w-0 items-center gap-2">
          <Link
            href="/"
            className={`flex cursor-pointer shrink-0 items-center justify-center p-1 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 ${landingDark ? "h-9 w-9 rounded-full bg-white/20" : "h-8 w-8 rounded-md"}`}
            aria-label="Rigid Body Dynamics home"
            onClick={() => setMenuOpen(false)}
          >
            <span
              className={`bg-center bg-no-repeat ${landingDark ? "h-6 w-6 rounded-full" : "h-7 w-7 rounded-md"}`}
              style={{
                backgroundImage: `url('${logoUrl}')`,
                backgroundSize: "contain",
              }}
              aria-hidden
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden min-w-0 flex-1 justify-center md:flex"
          >
            <ul className="flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const isActive =
                  href === "/#final-cta"
                    ? false
                    : href === "/"
                      ? isHome
                      : href === "/about"
                        ? isAbout
                        : false;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      scroll={href !== "/#final-cta"}
                      onClick={
                        href === "/#final-cta" && isHome
                          ? (e) => {
                              e.preventDefault();
                              document
                                .getElementById("final-cta")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              window.history.replaceState(
                                null,
                                "",
                                `${window.location.pathname}#final-cta`,
                              );
                            }
                          : undefined
                      }
                      className={`${baseNavClass} ${isActive ? "underline underline-offset-4 decoration-2" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link
              href="https://calendar.app.google/BBf57YUkQsQxwzG28"
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClass}
            >
              <span className="cta-text-roll" aria-label="get in touch">
                <span aria-hidden="true">get in touch</span>
                <span aria-hidden="true">get in touch</span>
              </span>
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

          <div className="flex min-w-0 flex-1 items-center md:hidden">
            <Link
              href="https://calendar.app.google/BBf57YUkQsQxwzG28"
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaBase} min-w-0 w-full max-w-full shrink justify-center`}
            >
              <span className="cta-text-roll" aria-label="get in touch">
                <span aria-hidden="true">get in touch</span>
                <span aria-hidden="true">get in touch</span>
              </span>
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

          <button
            type="button"
            className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md md:hidden ${landingDark ? "text-white/90 ring-1 ring-white/25 hover:bg-white/10" : "text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-100"}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-main-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <nav
          id="mobile-main-nav"
          aria-label="Main navigation"
          className={`border-t pb-2 pt-3 md:hidden ${menuOpen ? "block" : "hidden"} ${landingDark ? "border-white/15" : "border-neutral-200/80"}`}
        >
          {showHomeThemeToggle ? (
            <div className="mb-3 flex justify-center px-1">
              <HomeThemeToggle
                value={homeTheme}
                onChange={setHomeTheme}
                variant={landingLight ? "on-light-hero" : "on-dark-hero"}
              />
            </div>
          ) : null}
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/#final-cta"
                  ? false
                  : href === "/"
                    ? isHome
                    : href === "/about"
                      ? isAbout
                      : false;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    scroll={href !== "/#final-cta"}
                    onClick={
                      href === "/#final-cta" && isHome
                        ? (e) => {
                            e.preventDefault();
                            setMenuOpen(false);
                            document
                              .getElementById("final-cta")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            window.history.replaceState(
                              null,
                              "",
                              `${window.location.pathname}#final-cta`,
                            );
                          }
                        : () => setMenuOpen(false)
                    }
                    className={`${baseNavClass} block w-full py-3 ${isActive ? "underline underline-offset-4 decoration-2" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="https://calendar.app.google/BBf57YUkQsQxwzG28"
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaClass} mx-auto mt-4`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="cta-text-roll" aria-label="get in touch">
              <span aria-hidden="true">get in touch</span>
              <span aria-hidden="true">get in touch</span>
            </span>
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
        </nav>
      </div>
      {showHomeThemeToggle ? (
        <div className="pointer-events-none absolute top-1/2 right-[max(0.75rem,calc((100vw-var(--max-width-content))/2+0.75rem))] hidden -translate-y-1/2 md:flex">
          <div className="pointer-events-auto">
            <HomeThemeToggle
              value={homeTheme}
              onChange={setHomeTheme}
              variant={landingLight ? "on-light-hero" : "on-dark-hero"}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
