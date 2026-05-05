import Link from "next/link";

const COMPANY_NAME = "Rigid Body Dynamics";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOGO_WHITE_URL = basePath ? `${basePath}/logowhite.png` : "/logowhite.png";

export default function HomeDarkFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="scroll-mt-28 bg-[#050505] px-4 py-8 sm:px-6"
      role="contentinfo"
      aria-labelledby="home-footer-heading"
    >
      <h2 id="home-footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-7 w-7 flex-shrink-0 rounded-md bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${LOGO_WHITE_URL}')`, backgroundSize: "contain" }}
              aria-hidden
            />
            <p className="text-base font-semibold tracking-tight text-white">
              {COMPANY_NAME}
            </p>
          </div>
          <nav aria-label="Legal">
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <li>
                <Link
                  href="/privacy"
                  className="cursor-pointer text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="cursor-pointer text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
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
