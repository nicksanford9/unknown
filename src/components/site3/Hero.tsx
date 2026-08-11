"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";

export function Hero({ business }: { business: Business }) {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="top" className="relative min-h-[88vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${business.heroImageUrl})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--brand-dark) 96%, transparent) 0%, color-mix(in srgb, var(--brand-dark) 86%, transparent) 48%, color-mix(in srgb, var(--brand-dark) 42%, transparent) 100%)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: reduce ? 0 : 0.1 }}
        className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8"
      >
        <div className="max-w-3xl">
          <motion.p
            variants={item}
            className="flex items-center gap-2 font-body text-base font-semibold text-white/80"
          >
            <MapPin className="h-4 w-4" style={{ color: "var(--accent-text)" }} />
            Local plumbing help for {business.city} homeowners
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-5 text-balance font-display text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5rem]"
          >
            Know what&apos;s wrong. Know what it costs. Get it fixed.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-balance font-body text-lg leading-relaxed text-white/82 sm:text-xl"
          >
            {business.tagline}
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={telHref(business.phone)}
              className="flex items-center justify-center gap-2.5 rounded-full px-7 py-4 font-body text-base font-bold shadow-xl shadow-black/20 transition-transform hover:scale-[1.02]"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <Phone className="h-5 w-5" />
              Call {business.phone}
            </a>
            <a
              href="#quote"
              className="rounded-full border border-white/25 bg-white px-7 py-4 text-center font-body text-base font-bold text-ink transition-colors hover:bg-white/90"
            >
              Tell us what&apos;s going on
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
