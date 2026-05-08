import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions | Rigid Body Dynamics",
  description:
    "Terms governing the use of the Rigid Body Dynamics website, AI agents, and supporting services.",
};

const LAST_UPDATED = "8 May 2026";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    body: (
      <>
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of
          the Rigid Body Dynamics website, the AI agents we operate, and any
          related services (together, the &ldquo;Service&rdquo;). By using the
          Service, signing an order form with us, or instructing us to connect
          your WhatsApp, email, or other channels to our agents, you agree to
          these Terms.
        </p>
        <p>
          If you are agreeing on behalf of a company, you confirm that you have
          authority to bind that company. The Service is intended for business
          use by brand owners, manufacturers, distributors, and their authorized
          users — not for personal, household, or consumer use.
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "2. Key definitions",
    body: (
      <>
        <ul>
          <li>
            <span className="font-medium text-foreground">&ldquo;Customer&rdquo;</span> — the
            company that has signed an order form or otherwise contracted to
            use the Service.
          </li>
          <li>
            <span className="font-medium text-foreground">&ldquo;Authorized Users&rdquo;</span> —
            employees, contractors, or partners that the Customer permits to
            access the Service.
          </li>
          <li>
            <span className="font-medium text-foreground">&ldquo;Customer Data&rdquo;</span> —
            the operational data the Customer or its Authorized Users provide
            to the Service or that the Service ingests from connected channels
            (WhatsApp, email, voice, Excel, ERP, etc.).
          </li>
          <li>
            <span className="font-medium text-foreground">&ldquo;Agents&rdquo;</span> — the
            AI workflows we operate (for example the Procurement Agent,
            Production Planner, Dispatch Coordinator, Field Listener, Credit
            Watchdog, and Forecast Engine).
          </li>
          <li>
            <span className="font-medium text-foreground">&ldquo;Output&rdquo;</span> — the
            structured data, messages, summaries, plans, and actions the Agents
            produce from Customer Data.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "the-service",
    title: "3. The Service",
    body: (
      <>
        <p>
          The Service ingests messages, voice notes, photos, documents, and
          spreadsheets from the channels the Customer connects, and turns them
          into structured operational actions such as purchase orders, dispatch
          plans, credit holds, forecasts, and dashboards. The Service is
          designed to plug into existing workflows, with configurable approval
          steps for actions that have material business impact.
        </p>
        <p>
          We may improve, extend, or modify the Service from time to time. We
          will not materially reduce the core functionality the Customer is
          paying for during the term of an active order form without
          reasonable notice.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "4. Accounts and access",
    body: (
      <>
        <ul>
          <li>The Customer is responsible for keeping login credentials, API keys, and connected-channel tokens (e.g., WhatsApp Business numbers) confidential.</li>
          <li>The Customer is responsible for the activity of its Authorized Users and must promptly notify us of any unauthorized access.</li>
          <li>We may suspend access if we reasonably believe the Service is being used in a way that violates these Terms or threatens the security or integrity of the platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: "customer-obligations",
    title: "5. Customer obligations",
    body: (
      <>
        <p>The Customer agrees to:</p>
        <ul>
          <li>only connect channels and data sources that the Customer is entitled to share with us,</li>
          <li>provide accurate configuration data (vendor lists, SKUs, pricing, credit limits, territory mapping),</li>
          <li>have in place all notices, consents, and legal bases required to share the personal data of its employees, field staff, vendors, distributors, and customers with us under the Digital Personal Data Protection Act, 2023 (DPDP) and any other applicable law,</li>
          <li>review Output before it is used for high-impact actions where the Customer has chosen to enable human-in-the-loop approval, and</li>
          <li>comply with the terms of any third-party platform connected to the Service, including the WhatsApp Business Solution Terms and the platform policies of email and ERP providers.</li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable use",
    body: (
      <>
        <p>You will not, and will not allow any Authorized User to:</p>
        <ul>
          <li>use the Service to violate any law or third-party right,</li>
          <li>send unsolicited bulk messages, spam, or content prohibited by the connected channel&rsquo;s policies,</li>
          <li>upload malware, attempt to probe, scan, or test the vulnerability of the Service except under a written security testing agreement,</li>
          <li>reverse engineer, decompile, or attempt to extract the source code of the Service,</li>
          <li>use the Service to build a competing product or to benchmark it for that purpose,</li>
          <li>resell, sublicense, or share access with anyone outside the Customer&rsquo;s organization without our prior written consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "7. Customer Data and AI Output",
    body: (
      <>
        <p>
          As between the parties, the Customer owns all Customer Data and all
          Output generated from Customer Data. The Customer grants us a limited,
          worldwide, non-exclusive licence to host, process, and transmit
          Customer Data solely to operate, maintain, secure, and improve the
          Service for the Customer.
        </p>
        <p>
          AI Output is probabilistic and may contain errors. The Customer is
          responsible for reviewing Output before relying on it for legally or
          financially binding decisions. We will not use Customer Data to train
          shared, multi-tenant foundation models. We may use de-identified and
          aggregated metrics to monitor performance and improve the Service.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "8. Third-party platforms and integrations",
    body: (
      <>
        <p>
          The Service depends on third-party platforms (for example WhatsApp,
          Gmail and Microsoft 365, telecom providers, LLM and speech-to-text
          providers, ERP and accounting systems). The availability, performance,
          rate limits, and policies of those platforms are outside our control,
          and the Customer&rsquo;s use of them is subject to their own terms.
          Where a third-party platform suspends or changes access, we will use
          reasonable efforts to maintain continuity of the Service.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    title: "9. Fees, taxes, and payment",
    body: (
      <>
        <p>
          Fees are set out in the order form or proposal signed with the
          Customer. Unless stated otherwise, fees are exclusive of GST and
          other applicable taxes, are payable in Indian rupees, and are due
          within 15 days of invoice. Late payments may incur interest at the
          rate stated in the order form, or if none, at 1.5% per month. We may
          suspend the Service for invoices that are overdue by more than 30
          days after written notice.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "10. Our intellectual property",
    body: (
      <>
        <p>
          Rigid Body Dynamics owns all rights in the Service, the Agents, our
          models, prompts, dashboards, source code, and the Rigid Body
          Dynamics name and logos. Nothing in these Terms transfers any of
          those rights to the Customer. Feedback the Customer chooses to share
          may be used by us without restriction to improve the Service.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "11. Confidentiality",
    body: (
      <>
        <p>
          Each party will protect the other&rsquo;s confidential information
          using at least the same care it uses for its own confidential
          information of similar sensitivity, and not less than a reasonable
          standard of care. Confidential information may be used only to
          perform under these Terms and disclosed only to personnel and
          subprocessors with a need to know who are bound by similar
          obligations.
        </p>
      </>
    ),
  },
  {
    id: "service-levels",
    title: "12. Service availability and support",
    body: (
      <>
        <p>
          We aim to keep the Service available 24x7 except for scheduled
          maintenance and events outside our reasonable control. Specific
          service levels, response times, and support channels (including
          dedicated support for production and dispatch workflows) are set out
          in the order form. The Service is delivered as a managed service —
          we monitor agents around the clock and intervene where automated
          recovery is not possible.
        </p>
      </>
    ),
  },
  {
    id: "term-termination",
    title: "13. Term and termination",
    body: (
      <>
        <ul>
          <li>These Terms apply for as long as the Customer uses the Service.</li>
          <li>Either party may terminate for material breach if the breach is not cured within 30 days of written notice.</li>
          <li>We may terminate or suspend immediately if continued operation creates a security, legal, or third-party platform risk.</li>
          <li>On termination, the Customer&rsquo;s access ends, fees accrued up to the date of termination remain payable, and we will, on written request within 30 days, return or delete Customer Data in accordance with our retention policy.</li>
          <li>Sections that by their nature should survive termination (including IP, confidentiality, fees due, disclaimers, limitation of liability, indemnity, and governing law) survive termination.</li>
        </ul>
      </>
    ),
  },
  {
    id: "warranty",
    title: "14. Warranties and disclaimers",
    body: (
      <>
        <p>
          We will provide the Service with reasonable skill and care and in
          line with the description in our order form. Except as expressly
          stated, the Service is provided on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis. To the maximum extent permitted by
          law, we disclaim all other warranties, including implied warranties
          of merchantability, fitness for a particular purpose, and
          non-infringement, and we do not warrant that AI Output will be
          error-free, uninterrupted, or fit any specific business outcome.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "15. Limitation of liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by law, neither party is liable for
          indirect, incidental, special, consequential, or punitive damages,
          loss of profits, loss of revenue, loss of goodwill, or loss of data
          arising out of or related to the Service. Each party&rsquo;s total
          aggregate liability arising out of or related to these Terms in any
          12-month period is capped at the fees paid or payable by the
          Customer to us during the 12 months preceding the event giving rise
          to the claim. These caps do not apply to the Customer&rsquo;s
          payment obligations, breach of acceptable use, infringement of our
          intellectual property, or liabilities that cannot be limited under
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "16. Indemnification",
    body: (
      <>
        <p>
          The Customer will defend and indemnify us against third-party claims
          arising from (a) Customer Data, including any claim that providing
          Customer Data to us breached a third party&rsquo;s rights or
          applicable law, (b) the Customer&rsquo;s use of the Service in
          violation of these Terms or third-party platform policies, and (c)
          actions taken by the Customer or its Authorized Users in reliance on
          AI Output without applying the human review steps available in the
          Service. We will defend and indemnify the Customer against
          third-party claims that the Service, used as permitted under these
          Terms, infringes a third party&rsquo;s Indian intellectual property
          rights, subject to the liability cap in Section 15.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "17. Governing law and jurisdiction",
    body: (
      <>
        <p>
          These Terms are governed by the laws of India. The parties submit to
          the exclusive jurisdiction of the courts of competent jurisdiction in
          New Delhi, India, except that either party may seek urgent or
          equitable relief in any court with proper jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "18. General",
    body: (
      <>
        <ul>
          <li>If any provision is held unenforceable, the rest of these Terms remain in effect.</li>
          <li>Failure to enforce a provision is not a waiver of the right to enforce it later.</li>
          <li>The Customer may not assign these Terms without our prior written consent. We may assign in connection with a merger, acquisition, or sale of substantially all of our assets.</li>
          <li>These Terms, together with any signed order form, are the entire agreement between the parties on this subject and supersede earlier discussions and proposals.</li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "19. Changes",
    body: (
      <>
        <p>
          We may update these Terms from time to time. Material changes will
          be communicated by updating the &ldquo;Last updated&rdquo; date and,
          where required, notifying customers by email or in-product message.
          Continued use of the Service after a change takes effect constitutes
          acceptance of the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "20. Contact",
    body: (
      <>
        <p>
          Questions about these Terms?{" "}
          <Link
            href="https://calendar.app.google/7roAZLoLHpcUxiYu7"
            className="cursor-pointer text-foreground underline underline-offset-2 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-neutral-50">
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />

        <h1 className="mt-12 font-serif text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
          Terms &amp; Conditions
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
