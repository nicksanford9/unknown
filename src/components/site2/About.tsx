import { Check, Star } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

/** v2 About: a story and concrete promises — not a grid of numbers nobody chose a plumber for. */
export function About({ business }: { business: Business }) {
  const promises = [
    "You approve the exact price before any work starts",
    "Licensed, insured plumbers — never day labor",
    business.emergency247
      ? "Real 24/7 emergency response, nights and weekends"
      : "Same-day service on most calls",
    "We leave your home cleaner than we found it",
  ];

  const since = business.yearsInBusiness
    ? new Date().getFullYear() - business.yearsInBusiness
    : null;

  return (
    <section id="about" className="bg-card py-16 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p
            className="font-body text-sm font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--accent-ink)" }}
          >
            {since ? `Family-owned since ${since}` : `About ${business.name}`}
          </p>
          <h2 className="mt-3 font-display text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl">
            A neighbor with a wrench, not a franchise with a script.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-ink-soft">
            {business.about}
          </p>

          <ul className="mt-8 space-y-3.5">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                  style={{ background: "var(--brand-tint)" }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
                </span>
                <span className="font-body text-[1.02rem] leading-relaxed text-ink">
                  {p}
                </span>
              </li>
            ))}
          </ul>

          {business.rating && business.reviewCount && (
            <div className="mt-9 flex items-center gap-3 border-t border-line pt-7">
              <span className="flex items-center gap-1" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-5 w-5"
                    style={{ color: "var(--accent-ink)", fill: "var(--accent-ink)" }}
                  />
                ))}
              </span>
              <span className="font-body text-[0.98rem] text-ink">
                <strong className="font-bold">{business.rating.toFixed(1)} on Google</strong>
                <span className="text-ink-soft">
                  {" "}· {business.reviewCount} reviews from {business.city} homeowners
                </span>
              </span>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80"
              alt={`${business.name} at work`}
              className="aspect-[4/5] w-full rounded-xl object-cover"
            />
            <div
              className="absolute -bottom-5 left-5 right-5 rounded-lg px-6 py-4 shadow-xl shadow-black/15 sm:left-8 sm:right-auto"
              style={{ background: "var(--brand)", color: "var(--on-brand)" }}
            >
              <p className="font-display text-lg font-bold">
                {business.yearsInBusiness} years in {business.city}
              </p>
              <p className="mt-0.5 font-body text-sm opacity-80">
                Same crew. Same phone number. Same promise.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
