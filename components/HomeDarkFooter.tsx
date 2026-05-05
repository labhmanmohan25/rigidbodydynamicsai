import Link from "next/link";

const COMPANY_NAME = "Rigid Body Dynamics";

export default function HomeDarkFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="scroll-mt-28 bg-[#050505] px-6 py-12"
      role="contentinfo"
      aria-labelledby="home-footer-heading"
    >
      <h2 id="home-footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-base font-semibold tracking-tight text-white">
            {COMPANY_NAME}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="text-sm text-zinc-500 sm:self-end">
          © {year} {COMPANY_NAME}
        </p>
      </div>
    </footer>
  );
}
