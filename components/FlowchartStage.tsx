"use client";

import { useState } from "react";

const CARDS = [
  {
    title: "Supply Chain Visibility",
    heading: "See your entire supply chain on one screen",
    description:
      "Procurement status, production schedules, warehouse stock levels, distribution progress, retail delivery -- all live, all in one view. No more calling your warehouse manager at 9 PM to ask how much finished goods inventory you have. No more waiting for the Monday morning Excel dump.",
  },
  {
    title: "Disruption Prediction",
    heading: "Know what will go wrong before it does",
    description:
      "The AI monitors every signal in your supply chain and predicts disruptions before they cascade. Bad batch of raw material from a supplier? The system auto-adjusts procurement from alternates. Demand spike from a distributor? Raw material orders trigger automatically. You stop firefighting and start planning.",
  },
  {
    title: "Operations Automation",
    heading: "Replace 10 admin staff with AI agents",
    description:
      "Order processing, procurement scheduling, production planning, dispatch coordination -- all handled by purpose-built AI agents that work 24/7. Your operations team stops doing data entry and starts doing strategy. The same work that required 15 people now runs with 3 people supervising AI.",
  },
  {
    title: "Fast Scheme Feedback",
    heading: "Measure scheme impact in hours, not weeks",
    description:
      "Your salespeople visit retailers and send feedback through WhatsApp messages, phone calls, Excel uploads, even photos of handwritten tally sheets. Our AI ingests all of it -- every channel, every format -- and gives you pinpoint understanding of what is actually happening on the ground. Launch a scheme at 9 AM, see retailer response data by 5 PM.",
  },
  {
    title: "Credit Control",
    heading: "Stop chasing payments manually",
    description:
      "Outstanding payments, credit limits, payment behavior patterns -- all tracked automatically across every distributor and retailer. The system flags overdue accounts, enforces credit limits on new orders, and gives you a clear picture of your cash flow exposure at any moment. Your finance team stops making collection calls and starts managing strategy.",
  },
  {
    title: "Unlimited Scaling",
    heading: "Go from 500 crore to 2000 crore without adding back-office staff",
    description:
      "Add new product lines. Enter new states. Onboard 50 more distributors. The platform scales with you -- no new hires needed for coordination. Your back-office becomes your competitive advantage instead of your bottleneck. The companies that will win in Indian FMCG are the ones that can scale operations without scaling headcount.",
  },
] as const;

export default function FlowchartStage() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <section
      aria-label="Platform capabilities"
      className="relative w-full bg-[#070707] py-24 sm:py-32"
    >
      <div className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-300/80">
              What you get
            </p>
            <h2 className="mt-3 text-3xl font-normal tracking-tight text-white sm:text-5xl">
              Six capabilities. One operations advantage.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Tap any card to see what changes in your day-to-day.
            </p>
          </div>

          {/* Attached grid: gap shows as thin joins between cells */}
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card, index) => {
              const isFlipped = Boolean(flipped[index]);
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() =>
                    setFlipped((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  aria-pressed={isFlipped}
                  aria-label={`${card.title}. ${isFlipped ? "Show summary" : "Show details"}`}
                  className="group relative min-h-[300px] w-full cursor-pointer bg-black p-0 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <div className="perspective-[1000px] h-full min-h-[300px] w-full p-4 sm:p-5">
                    <div
                      className={[
                        "relative h-full min-h-[260px] w-full transition-transform duration-500 [transform-style:preserve-3d]",
                        isFlipped ? "[transform:rotateY(180deg)]" : "",
                      ].join(" ")}
                    >
                      {/* Front: title + heading */}
                      <div
                        className="absolute inset-0 flex flex-col border-0 bg-black p-5 backface-hidden sm:p-6"
                        aria-hidden={isFlipped}
                      >
                        <span className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-heading mt-3 text-xl font-normal leading-tight text-white sm:text-2xl">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                          {card.heading}
                        </p>
                        <span className="mt-auto pt-6 text-xs text-white/45">
                          Click to read more
                        </span>
                      </div>

                      {/* Back: white background + description */}
                      <div
                        className="absolute inset-0 flex flex-col overflow-y-auto border-0 bg-white p-5 backface-hidden [transform:rotateY(180deg)] sm:p-6"
                        aria-hidden={!isFlipped}
                      >
                        <p className="text-sm leading-relaxed text-neutral-800">
                          {card.description}
                        </p>
                        <span className="mt-auto pt-4 text-xs text-neutral-500">
                          Click to flip back
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
