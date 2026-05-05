const POINTS = [
  { k: "On-prem option", v: "Run inside your VPC or on your servers — your data never leaves your perimeter." },
  { k: "Audit trail", v: "Every agent action is logged and reversible. Approvals on by default for high-risk steps." },
  { k: "ERP-agnostic", v: "Works with SAP, Oracle, Tally, Odoo, Excel — and the WhatsApp groups you actually use." },
  { k: "Indian context", v: "GST, e-way bills, distributor schemes, credit notes — modeled out of the box." },
];

export default function SecurityBand() {
  return (
    <section className="relative overflow-hidden bg-[#070707] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.25), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-300/80">
              Trust & control
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Your data. Your ERPs. Your rules.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              Designed for the way Indian manufacturers run — across SAP,
              Tally, distributor portals and WhatsApp — with the controls
              your CFO and IT team need to sign off.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div key={p.k} className="bg-[#0a0a0a] p-6">
                <h3 className="text-sm font-semibold text-white">{p.k}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {p.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
