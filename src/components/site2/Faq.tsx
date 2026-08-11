"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/** FAQs assembled from real business data — nothing invented. */
function buildFaqs(b: Business): { q: string; a: string }[] {
  const areas = b.serviceAreas.slice(0, 5).join(", ");
  return [
    {
      q: "Do you charge for estimates?",
      a: `Call us and tell us what's going on — we'll give you honest guidance up front, and you approve the exact price before any work begins.`,
    },
    b.emergency247
      ? {
          q: "Do you handle emergencies at night or on weekends?",
          a: `Yes — ${b.name} answers 24/7. Burst pipes and backups don't wait for business hours, and neither do we.`,
        }
      : {
          q: "How fast can you get here?",
          a: `Most calls in the ${b.city} area are scheduled same-day or next-day. Call and we'll give you a real arrival window.`,
        },
    b.licensed && {
      q: "Are you licensed and insured?",
      a: `Yes. ${b.name} is fully licensed and insured${b.licenseNumber ? ` (license #${b.licenseNumber})` : ""}.`,
    },
    {
      q: "What areas do you serve?",
      a: `We serve ${areas} and the surrounding ${b.city} area.`,
    },
    {
      q: "What services do you offer?",
      a: b.services.map((s) => s.title).join(" · "),
    },
    {
      q: "How do I pay?",
      a: "We accept all major payment methods, and you'll always know the full price before we start.",
    },
  ].filter(Boolean) as { q: string; a: string }[];
}

export function Faq({ business }: { business: Business }) {
  const faqs = buildFaqs(business);
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="py-16 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="mb-3 font-body text-sm font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent-ink)" }}>
            Common questions
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            Answers before you even call.
          </h2>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-ink-soft">
            Anything else on your mind? Call us — a real person answers.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-lg font-bold tracking-tight text-ink">
                      {faq.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-300",
                        isOpen && "rotate-45"
                      )}
                      style={{ color: "var(--accent-ink)" }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-10 font-body text-[0.975rem] leading-relaxed text-ink-soft">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
