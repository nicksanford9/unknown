"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone, Star, ShieldCheck, Clock } from "lucide-react";
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
    <section id="top" className="relative min-h-[92vh] overflow-hidden">
      {/* Background photo (stock or real), with brand-tinted gradient for legibility + cohesion */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${business.heroImageUrl})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, var(--brand-dark) 0%, color-mix(in srgb, var(--brand) 92%, transparent) 42%, color-mix(in srgb, var(--brand-dark) 55%, transparent) 100%)",
        }}
      />
      {/* subtle brass hairline flow accent */}
      <div
        className="absolute inset-y-0 left-0 w-px opacity-40"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p
            variants={item}
            className="eyebrow mb-6 flex items-center gap-3 text-white/80"
          >
            <span
              className="inline-block h-px w-8"
              style={{ background: "var(--accent)" }}
            />
            {business.city}, {business.state}
            {business.emergency247 && " · 24/7 Emergency Service"}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Trusted {nicheTitle}s in{" "}
            <span style={{ color: "var(--accent)" }}>{business.city}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-white/85 sm:text-xl"
          >
            {business.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a
              href={telHref(business.phone)}
              className="flex items-center gap-2.5 rounded-full px-7 py-4 font-body text-base font-semibold text-[var(--brand-dark)] shadow-xl shadow-black/20 transition-transform hover:scale-[1.03]"
              style={{ background: "var(--accent)" }}
            >
              <Phone className="h-5 w-5" />
              Call {business.phone}
            </a>
            <a
              href="#quote"
              className="rounded-full border border-white/30 bg-white/5 px-7 py-4 font-body text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Get a Free Quote
            </a>
          </motion.div>

          {/* Mono spec strip — the signature */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6"
          >
            {business.rating && (
              <SpecItem
                icon={<Star className="h-4 w-4" style={{ color: "var(--accent)" }} />}
                label="Rated"
                value={`${business.rating.toFixed(1)} / 5`}
                sub={business.reviewCount ? `${business.reviewCount} reviews` : undefined}
              />
            )}
            {business.yearsInBusiness && (
              <SpecItem
                icon={<Clock className="h-4 w-4" style={{ color: "var(--accent)" }} />}
                label="Serving since"
                value={`${new Date().getFullYear() - business.yearsInBusiness}`}
                sub={`${business.yearsInBusiness} yrs`}
              />
            )}
            {business.licensed && (
              <SpecItem
                icon={<ShieldCheck className="h-4 w-4" style={{ color: "var(--accent)" }} />}
                label="Status"
                value="Licensed"
                sub="& Insured"
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SpecItem({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div className="leading-tight">
        <div className="spec text-[0.65rem] uppercase tracking-widest text-white/55">
          {label}
        </div>
        <div className="spec text-sm font-semibold text-white">
          {value}
          {sub && <span className="ml-1.5 font-normal text-white/60">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
