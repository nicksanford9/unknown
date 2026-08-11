"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";

export function Hero({ business }: { business: Business }) {
  const reduce = useReducedMotion();
  const nicheTitle =
    business.niche.charAt(0).toUpperCase() + business.niche.slice(1);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="top" className="relative min-h-[88vh] overflow-hidden">
      {/* Background photo (stock or real), with brand-tinted overlay for legibility + cohesion */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${business.heroImageUrl})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--brand-dark) 88%, transparent) 0%, color-mix(in srgb, var(--brand) 82%, transparent) 55%, color-mix(in srgb, var(--brand-dark) 92%, transparent) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-3xl flex-col items-center"
        >
          <motion.h1
            variants={item}
            className="font-display text-[2.6rem] font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Trusted {nicheTitle}s in{" "}
            <span style={{ color: "var(--accent-text)" }}>{business.city}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl font-body text-lg leading-relaxed text-white/85 sm:text-xl"
          >
            {business.tagline}
          </motion.p>

          {/* CTAs — colors are computed from the business theme, never assumed */}
          <motion.div
            variants={item}
            className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={telHref(business.phone)}
              className="flex w-full max-w-xs items-center justify-center gap-2.5 rounded-full px-7 py-4 font-body text-base font-semibold shadow-xl shadow-black/20 transition-transform hover:scale-[1.03] sm:w-auto"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <Phone className="h-5 w-5" />
              Call {business.phone}
            </a>
            <a
              href="#quote"
              className="w-full max-w-xs rounded-full bg-white px-7 py-4 text-center font-body text-base font-semibold text-[#131719] shadow-lg shadow-black/10 transition-colors hover:bg-white/90 sm:w-auto"
            >
              Get a Free Quote
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
