import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

export function About({ business }: { business: Business }) {
  const stats = [
    business.yearsInBusiness && {
      value: `${business.yearsInBusiness}`,
      label: "Years in business",
    },
    business.reviewCount && {
      value: `${business.reviewCount}+`,
      label: "Jobs reviewed",
    },
    business.emergency247 && { value: "24/7", label: "Emergency response" },
    business.rating && { value: business.rating.toFixed(1), label: "Average rating" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section id="about" className="bg-card py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "var(--accent)" }}>
            About {business.name}
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            The plumber your neighbors already trust.
          </h2>
          <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-ink-soft">
            {business.about}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {stats.map((s) => (
              <div key={s.label} className="bg-card p-7">
                <div
                  className="font-display text-4xl font-black tracking-tight"
                  style={{ color: "var(--brand)" }}
                >
                  {s.value}
                </div>
                <div className="spec mt-2 text-xs uppercase tracking-wider text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
