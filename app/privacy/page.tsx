import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | Rigid Body Dynamics",
  description:
    "How Rigid Body Dynamics collects, uses, and safeguards customer and operational data processed by our AI agents.",
};

const LAST_UPDATED = "8 May 2026";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Overview",
    body: (
      <>
        <p>
          Rigid Body Dynamics (&ldquo;Rigid Body Dynamics&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) builds AI agents that automate
          supply-chain and back-office operations for brand owners, manufacturers,
          and distributors. To do that, our agents read messages, voice notes,
          photos, emails, and spreadsheets that flow through your existing
          WhatsApp, email, Excel, and phone channels, and turn that activity into
          structured operational actions such as purchase orders, dispatch plans,
          credit holds, and forecasts.
        </p>
        <p>
          This policy explains what we collect, why we collect it, who we share it
          with, and the choices and rights available to you. It applies to our
          website, our hosted platform, and any agent or workflow we operate on
          behalf of a customer.
        </p>
      </>
    ),
  },
  {
    id: "who-we-process-data-for",
    title: "2. Who this policy is for",
    body: (
      <>
        <p>We process two broad categories of personal information:</p>
        <ul>
          <li>
            <span className="font-medium text-foreground">Visitor data</span>  - 
            information about people who visit our website, request a demo, or
            contact us. We act as the data fiduciary for this information.
          </li>
          <li>
            <span className="font-medium text-foreground">Customer operational data</span>  - 
            information our agents process inside a customer&rsquo;s operations
            (orders, vendor messages, distributor exchanges, dispatch plans,
            invoices, etc.). For this data, our customer is the data fiduciary
            and we act as a data processor on their behalf, under the contract
            in place with them.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "3. Information we collect",
    body: (
      <>
        <p className="font-medium text-foreground">From website visitors and prospects</p>
        <ul>
          <li>Contact details you submit (name, work email, phone number, company name, role).</li>
          <li>Meeting scheduling data when you book a demo through our calendar link.</li>
          <li>
            Device, log, and analytics data  -  IP address, browser type, pages
            visited, referrer, and approximate location derived from IP.
          </li>
          <li>Cookies and similar technologies (see Section 9).</li>
        </ul>
        <p className="mt-6 font-medium text-foreground">From customers and their authorized users</p>
        <ul>
          <li>Account and billing information for the contracting entity.</li>
          <li>Authentication data (credentials, access tokens, audit logs).</li>
          <li>Configuration data (SKUs, pricing tiers, vendor list, credit rules, territory mapping).</li>
        </ul>
        <p className="mt-6 font-medium text-foreground">Operational data our agents process</p>
        <ul>
          <li>WhatsApp messages, voice notes, images, and attachments shared with the numbers connected to our agents.</li>
          <li>Emails and attachments routed to inboxes that you connect.</li>
          <li>Excel, CSV, PDF, and ERP exports you upload or auto-sync.</li>
          <li>Phone call recordings and transcripts where you have enabled call ingestion.</li>
          <li>
            Order, inventory, dispatch, vendor, distributor, credit-limit, and
            related operational records used to run agents like the Procurement
            Agent, Production Planner, Dispatch Coordinator, Field Listener,
            Credit Watchdog, and Forecast Engine.
          </li>
        </ul>
        <p>
          Operational data may include personal information of your employees,
          field staff, vendors, distributors, and their representatives  -  for
          example names, phone numbers, voice recordings, and photos. You are
          responsible for ensuring you have the legal basis and notices in place
          to share this data with us under applicable laws, including the Digital
          Personal Data Protection Act, 2023 (DPDP).
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "4. How we use the information",
    body: (
      <>
        <ul>
          <li>To provide, operate, and improve our agents and platform.</li>
          <li>To turn unstructured WhatsApp, email, voice, and document inputs into structured actions (orders, POs, dispatch plans, credit holds, forecasts).</li>
          <li>To match orders to SKUs, check live inventory, and confirm orders back to your customers and field team.</li>
          <li>To detect anomalies, prevent abuse, and secure the platform.</li>
          <li>To respond to demo requests, support tickets, and other inquiries.</li>
          <li>To comply with legal obligations and enforce our agreements.</li>
          <li>
            To train and tune <span className="font-medium text-foreground">customer-specific</span>{" "}
            models on your operational data when your contract permits. We do
            not use your operational data to train shared, multi-tenant models
            unless you have given us explicit, separate consent in writing.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-and-llms",
    title: "5. How AI agents and large language models process your data",
    body: (
      <>
        <p>
          Our agents combine our own systems with hosted large language model
          (LLM) and speech-to-text providers to interpret messages, voice notes,
          and documents. When the platform sends a snippet of operational data
          to one of these providers, we choose providers and configurations that
          contractually prohibit them from training their own foundation models
          on your data.
        </p>
        <p>
          AI outputs are probabilistic. We design agent workflows with
          configurable approval steps for high-impact actions (e.g., releasing
          credit, confirming a purchase order, or sending a payment instruction)
          so that a human can review and override the agent before any
          irreversible action is taken on your behalf.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "6. Legal bases for processing",
    body: (
      <>
        <p>Where Indian law applies, we rely on the following bases under the DPDP Act and applicable contract:</p>
        <ul>
          <li><span className="font-medium text-foreground">Consent</span>  -  for marketing communications and optional features.</li>
          <li><span className="font-medium text-foreground">Performance of contract</span>  -  to deliver the platform to a customer and to interact with prospects who request a demo.</li>
          <li><span className="font-medium text-foreground">Legitimate uses</span>  -  for security, fraud prevention, debugging, and improving the platform.</li>
          <li><span className="font-medium text-foreground">Legal obligation</span>  -  to comply with tax, accounting, and regulatory requirements.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "7. How we share information",
    body: (
      <>
        <p>We do not sell personal information. We share it only as described below:</p>
        <ul>
          <li>
            <span className="font-medium text-foreground">Subprocessors and infrastructure providers</span>  - 
            cloud hosting, LLM and speech providers, messaging gateways, email
            and analytics tools, payment processors. Each is bound by contract
            to use the data only to provide their service to us.
          </li>
          <li>
            <span className="font-medium text-foreground">Customer&rsquo;s own systems</span>  - 
            we write back to ERPs, accounting software, and dashboards you
            connect.
          </li>
          <li>
            <span className="font-medium text-foreground">Authorized users in the customer&rsquo;s organization</span>  - 
            agents send WhatsApp summaries, alerts, and reports to the people
            you add as recipients.
          </li>
          <li>
            <span className="font-medium text-foreground">Legal and safety</span>  - 
            to comply with law, valid legal process, or to protect our rights,
            property, or safety, or that of our customers or the public.
          </li>
          <li>
            <span className="font-medium text-foreground">Business transfers</span>  - 
            in connection with a merger, acquisition, or sale of assets, with
            the same protections in place.
          </li>
        </ul>
        <p>
          A current list of material subprocessors is available on request to
          the contact below.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "8. International transfers",
    body: (
      <>
        <p>
          Some of our subprocessors (notably LLM and speech-to-text providers)
          are located outside India. When we transfer personal data
          internationally, we do so in compliance with applicable law and use
          contractual safeguards with each recipient. Customers who require all
          processing to remain inside India can request a India-only deployment
          at the time of contracting.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "9. Cookies and analytics",
    body: (
      <>
        <p>
          Our marketing website uses a small set of strictly necessary and
          analytics cookies to keep the site running, measure traffic, and
          understand which pages prospects find useful. We do not use
          third-party advertising cookies. You can block or delete cookies via
          your browser, although some parts of the site may not function as
          intended.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "10. Data retention",
    body: (
      <>
        <ul>
          <li>Visitor and prospect data  -  retained for up to 24 months after the last interaction, then deleted or anonymized.</li>
          <li>Customer account and configuration data  -  retained for the duration of the contract and up to 90 days after termination.</li>
          <li>Operational data processed by agents  -  retained for the period agreed in the customer contract, with the default being 12 months on hot storage and longer on cold storage where required for audit or legal reasons.</li>
          <li>Backups  -  overwritten on a rolling cycle of up to 90 days.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "11. Security",
    body: (
      <>
        <ul>
          <li>Encryption in transit (TLS 1.2+) and at rest for data stored on our managed cloud infrastructure.</li>
          <li>Role-based access controls and least-privilege defaults for our staff.</li>
          <li>Audit logging of administrative and agent actions.</li>
          <li>Network isolation between customer environments where contracted.</li>
          <li>Regular vulnerability scanning and dependency review.</li>
        </ul>
        <p>
          No system is perfectly secure. If we become aware of a security
          incident affecting your personal data, we will notify the affected
          customer without undue delay in line with the DPDP Act and the terms
          of our contract.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "12. Your rights",
    body: (
      <>
        <p>
          Where the DPDP Act or other applicable law gives you rights over your
          personal data, you can ask us to:
        </p>
        <ul>
          <li>access a copy of the personal data we hold about you,</li>
          <li>correct inaccurate or incomplete personal data,</li>
          <li>erase your personal data, subject to legal retention obligations,</li>
          <li>withdraw consent you have given us at any time, and</li>
          <li>nominate another individual to exercise these rights in the event of your incapacity or death.</li>
        </ul>
        <p>
          If your data was provided to us by one of our customers (for example,
          you are a distributor or field staff member of a brand we work with),
          please reach out to that customer first  -  we will support them in
          responding to your request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "13. Children",
    body: (
      <>
        <p>
          Our platform is built for businesses and is not directed at children.
          We do not knowingly collect personal data from children. If you
          believe a child has provided us personal data, please contact us and
          we will delete it.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "14. Changes to this policy",
    body: (
      <>
        <p>
          We may update this policy from time to time. When we make material
          changes, we will update the &ldquo;Last updated&rdquo; date at the top
          of this page and, where required, notify customers by email or
          in-product message.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "15. Contact and grievance officer",
    body: (
      <>
        <p>
          For privacy questions, requests under the DPDP Act, or to reach our
          grievance officer,{" "}
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            className="cursor-pointer text-foreground underline underline-offset-2 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            book a call
          </Link>
          . We aim to acknowledge requests within 7 business days and resolve
          them within 30 days.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-neutral-50">
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

        <h1 className="mt-12 font-serif text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Rigid Body Dynamics · Last updated {LAST_UPDATED}
        </p>

        <div className="mt-12 space-y-12 text-sm leading-relaxed text-muted-foreground [&_li]:my-1 [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:list-outside [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-neutral-400 dark:[&_ul]:marker:text-neutral-600">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-base font-medium text-foreground sm:text-lg">
                {section.title}
              </h2>
              <div className="mt-3">{section.body}</div>
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="mt-16 inline-block cursor-pointer text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
        >
          ← Back home
        </Link>
      </main>
    </div>
  );
}
