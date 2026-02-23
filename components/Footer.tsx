export default function Footer() {
  const year = new Date().getFullYear();

  const contactLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/rigid-body-dynamics-ai",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const brandName = "Rigid Body Dynamics AI";

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#1a1a1a] px-6 pb-48 pt-8"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="relative z-10 mx-auto flex max-w-[var(--max-width-content)] flex-wrap items-center justify-between gap-6">
        <nav aria-label="Contact">
          <ul className="flex items-center gap-6">
            {contactLinks.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 focus-visible:text-foreground"
                  aria-label={name}
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted-foreground">
          © {brandName} {year}
        </p>
      </div>
      {/* Large faint brand name at bottom: left-aligned, line 1 full, line 2 half visible */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start justify-end gap-0 pl-6 pt-4 text-left md:pl-8"
        aria-hidden
      >
        <span
          className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none tracking-tight text-white opacity-[0.04] [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
          style={{ paintOrder: "stroke fill" }}
        >
          Rigid Body
        </span>
        <span
          className="-mt-px font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none tracking-tight text-white opacity-[0.04] [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
          style={{ paintOrder: "stroke fill" }}
        >
          Dynamics AI
        </span>
      </div>
    </footer>
  );
}
