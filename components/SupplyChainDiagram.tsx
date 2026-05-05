"use client";

import { Fragment } from "react";

type AppId =
  | "excel"
  | "whatsapp"
  | "paper"
  | "phone"
  | "email"
  | "tally"
  | "dms";

type Stage = {
  id: string;
  label: string;
  role: string;
  apps: AppId[];
};

const STAGES: Stage[] = [
  {
    id: "procurement",
    label: "Procurement",
    role: "Buyer",
    apps: ["excel", "whatsapp", "phone", "email"],
  },
  {
    id: "production",
    label: "Production",
    role: "Plant Manager",
    apps: ["excel", "paper", "whatsapp"],
  },
  {
    id: "inventory",
    label: "Inventory",
    role: "Warehouse Mgr",
    apps: ["excel", "tally", "paper"],
  },
  {
    id: "logistics",
    label: "Logistics",
    role: "Transporter",
    apps: ["whatsapp", "phone", "paper"],
  },
  {
    id: "distribution",
    label: "Distribution",
    role: "Distributor",
    apps: ["tally", "excel", "whatsapp", "dms"],
  },
  {
    id: "sales",
    label: "Sales",
    role: "Salesperson",
    apps: ["paper", "whatsapp", "phone", "dms"],
  },
  {
    id: "retail",
    label: "Retail",
    role: "Kirana / Store",
    apps: ["whatsapp", "phone", "paper"],
  },
];

type IconProps = { className?: string };

function ExcelIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" />
      <line x1="2.5" y1="6" x2="13.5" y2="6" />
      <line x1="2.5" y1="9.5" x2="13.5" y2="9.5" />
      <line x1="6" y1="2.5" x2="6" y2="13.5" />
      <line x1="10" y1="2.5" x2="10" y2="13.5" />
    </svg>
  );
}

function WhatsappIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 13.2l1.1-2.7a5.5 5.5 0 1 1 1.6 1.6L3 13.2z" />
    </svg>
  );
}

function PaperIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 2h6l2.5 2.5V14H4z" />
      <path d="M10 2v2.5h2.5" />
      <line x1="6" y1="8" x2="11" y2="8" />
      <line x1="6" y1="11" x2="10" y2="11" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 2.5h2.4l1 2.7-1.5 1a8 8 0 0 0 4.4 4.4l1-1.5 2.7 1V13a.5.5 0 0 1-.5.5A11 11 0 0 1 2.5 3a.5.5 0 0 1 .5-.5z" />
    </svg>
  );
}

function EmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="3.5" width="12" height="9" rx="1" />
      <path d="M2.5 4.5L8 9l5.5-4.5" />
    </svg>
  );
}

function TallyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" />
      <text
        x="8"
        y="11.4"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
      >
        T
      </text>
    </svg>
  );
}

function DmsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="3" width="12" height="3.5" rx="0.6" />
      <rect x="2" y="7.5" width="12" height="3.5" rx="0.6" />
      <line x1="4" y1="4.75" x2="6" y2="4.75" />
      <line x1="4" y1="9.25" x2="6" y2="9.25" />
    </svg>
  );
}

const APPS: Record<AppId, { name: string; Icon: React.FC<IconProps> }> = {
  excel: { name: "Excel", Icon: ExcelIcon },
  whatsapp: { name: "WhatsApp", Icon: WhatsappIcon },
  paper: { name: "Paper", Icon: PaperIcon },
  phone: { name: "Phone", Icon: PhoneIcon },
  email: { name: "Email", Icon: EmailIcon },
  tally: { name: "Tally", Icon: TallyIcon },
  dms: { name: "DMS", Icon: DmsIcon },
};

const ARROW_W = 22;
const INTEGRATION_H = 56;

const FLOW_KEYFRAMES = `
  @keyframes supply-chain-dash {
    to { stroke-dashoffset: -120; }
  }
  .supply-chain-flow {
    animation-name: supply-chain-dash;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .supply-chain-flow {
      animation: none !important;
      stroke-dasharray: none !important;
      opacity: 0.45;
    }
  }
`;

function StageCard({ stage }: { stage: Stage }) {
  return (
    <article
      aria-label={`${stage.label} stage handled by ${stage.role}`}
      className="flex h-full flex-col gap-2 rounded-md border border-white/20 bg-white/[0.02] p-3"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/55">
        {stage.role}
      </p>
      <h3 className="text-sm font-medium text-white">{stage.label}</h3>
      <ul className="mt-auto flex flex-wrap gap-1 pt-1">
        {stage.apps.map((appId) => {
          const app = APPS[appId];
          const Icon = app.Icon;
          return (
            <li
              key={appId}
              title={app.name}
              aria-label={app.name}
              className="inline-flex items-center gap-1 rounded-sm border border-white/15 bg-white/[0.03] px-1.5 py-[3px] text-[10px] text-white/75"
            >
              <Icon className="h-3 w-3" />
              <span>{app.name}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function HorizontalArrow({ delay = 0 }: { delay?: number }) {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center self-stretch"
      style={{ width: ARROW_W }}
    >
      <svg
        viewBox="0 0 22 12"
        width={ARROW_W}
        height={12}
        className="overflow-visible"
      >
        <line
          x1="0"
          y1="6"
          x2="18"
          y2="6"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="6"
          x2="18"
          y2="6"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="6 14"
          className="supply-chain-flow"
          style={{ animationDuration: "2.4s", animationDelay: `${delay}s` }}
        />
        <path
          d="M14 2.5 L18 6 L14 9.5"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DownLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex h-full w-full justify-center" aria-hidden>
      <svg
        viewBox={`0 0 4 ${INTEGRATION_H}`}
        width={4}
        height={INTEGRATION_H}
        className="overflow-visible"
      >
        <line
          x1="2"
          y1="0"
          x2="2"
          y2={INTEGRATION_H}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <line
          x1="2"
          y1="0"
          x2="2"
          y2={INTEGRATION_H}
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="6 14"
          className="supply-chain-flow"
          style={{ animationDuration: "2.6s", animationDelay: `${delay}s` }}
        />
      </svg>
    </div>
  );
}

function DownChevron({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex justify-center" aria-hidden>
      <svg
        viewBox="0 0 12 28"
        width={12}
        height={28}
        className="overflow-visible"
      >
        <line
          x1="6"
          y1="0"
          x2="6"
          y2="22"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="0"
          x2="6"
          y2="22"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="5 11"
          className="supply-chain-flow"
          style={{ animationDuration: "2.4s", animationDelay: `${delay}s` }}
        />
        <path
          d="M2.5 18 L6 22 L9.5 18"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function RbdBand() {
  return (
    <div className="rounded-md border border-white/35 bg-white/[0.04] px-4 py-3 sm:px-6 sm:py-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
        Unified supply chain dashboard
      </p>
      <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
        Rigid Body Dynamics
      </h3>
      <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/65 sm:text-sm">
        Ingests Excel, WhatsApp, paper, phone, Tally and existing DMS feeds into
        one live picture across the entire FMCG chain.
      </p>
    </div>
  );
}

export default function SupplyChainDiagram() {
  return (
    <figure
      aria-label="FMCG supply chain — stages, the apps each role uses today, and the Rigid Body Dynamics dashboard that unifies them"
      className="mx-auto w-full max-w-6xl"
    >
      <style>{FLOW_KEYFRAMES}</style>

      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 sm:text-xs">
        FMCG supply chain — how mid-sized brands actually run today
      </p>

      {/* Wide layout: horizontal flow */}
      <div className="hidden lg:block">
        <div className="flex items-stretch gap-2">
          {STAGES.map((stage, i) => (
            <Fragment key={stage.id}>
              <div className="min-w-0 flex-1">
                <StageCard stage={stage} />
              </div>
              {i < STAGES.length - 1 && <HorizontalArrow delay={i * 0.18} />}
            </Fragment>
          ))}
        </div>

        <div
          className="mt-1 flex items-stretch gap-2"
          style={{ height: INTEGRATION_H }}
        >
          {STAGES.map((stage, i) => (
            <Fragment key={stage.id}>
              <div className="min-w-0 flex-1">
                <DownLine delay={i * 0.18} />
              </div>
              {i < STAGES.length - 1 && (
                <div style={{ width: ARROW_W }} aria-hidden />
              )}
            </Fragment>
          ))}
        </div>

        <RbdBand />
      </div>

      {/* Narrow layout: vertical stack */}
      <div className="flex flex-col gap-2 lg:hidden">
        {STAGES.map((stage, i) => (
          <Fragment key={stage.id}>
            <StageCard stage={stage} />
            {i < STAGES.length - 1 && <DownChevron delay={i * 0.15} />}
          </Fragment>
        ))}
        <DownChevron delay={STAGES.length * 0.15} />
        <RbdBand />
      </div>
    </figure>
  );
}
