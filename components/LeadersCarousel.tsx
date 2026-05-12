import { cn, ds } from "@/lib/design-system";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoSrc = (file: string) => (basePath ? `${basePath}/logos/${file}` : `/logos/${file}`);

type Company = { name: string; file: string };

/**
 * Order shuffled across CPG / consumer-health / beverage / personal-care so
 * adjacent items never share a sub-category. Logos are self-hosted under
 * `public/logos/` (sourced from Wikimedia Commons; swap any file in-place).
 */
const COMPANIES: readonly Company[] = [
  { name: "Kraft Heinz",          file: "kraft-heinz.svg" },
  { name: "Unilever",             file: "unilever.svg" },
  { name: "L'Oréal",              file: "loreal.svg" },
  { name: "Mars",                 file: "mars.svg" },
  { name: "Mondelez",             file: "mondelez.svg" },
  { name: "Coca-Cola",            file: "coca-cola.svg" },
  { name: "Kimberly-Clark",       file: "kimberly-clark.svg" },
  { name: "Procter & Gamble",     file: "pg.svg" },
  { name: "Danone",               file: "danone.png" },
  { name: "Estée Lauder",         file: "estee-lauder.svg" },
  { name: "PepsiCo",              file: "pepsico.svg" },
  { name: "Kellanova",            file: "kellanova.svg" },
  { name: "Reckitt",              file: "reckitt.svg" },
  { name: "Johnson & Johnson",    file: "jnj.svg" },
  { name: "Henkel",               file: "henkel.svg" },
  { name: "Nestlé",               file: "nestle.svg" },
  { name: "Colgate-Palmolive",    file: "colgate-palmolive.svg" },
  { name: "Anheuser-Busch InBev", file: "ab-inbev.svg" },
  { name: "General Mills",        file: "general-mills.svg" },
  { name: "Kenvue",               file: "kenvue.svg" },
];

function Logo({ company }: { company: Company }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc(company.file)}
      alt={`${company.name} logo`}
      title={company.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "h-7 w-auto max-w-[140px] shrink-0 object-contain sm:h-8 md:h-9",
        "opacity-60 grayscale transition-[opacity,filter] duration-200",
        "hover:opacity-100 hover:grayscale-0",
        "dark:opacity-75 dark:invert",
        "dark:hover:opacity-100",
      )}
    />
  );
}

export default function LeadersCarousel() {
  return (
    <section className="w-full overflow-hidden bg-background py-10 dark:bg-black sm:py-12">
      <p
        className={cn(
          "mx-auto max-w-3xl px-4 text-center sm:px-6",
          ds.text.label,
        )}
      >
        Leaders are already automating. Don&rsquo;t fall behind.
      </p>

      <div
        className="relative mt-7 w-full overflow-hidden sm:mt-9"
        aria-label="Consumer-goods leaders already automating their supply chains with AI"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent dark:from-black sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent dark:from-black sm:w-24"
        />

        <div
          className="marquee-track flex w-max items-center gap-12 sm:gap-16"
          style={{ ["--marquee-duration" as string]: "55s" }}
        >
          {COMPANIES.map((c) => (
            <Logo key={`a-${c.name}`} company={c} />
          ))}
          {COMPANIES.map((c) => (
            <Logo key={`b-${c.name}`} company={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
