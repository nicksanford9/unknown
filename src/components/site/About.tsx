import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";
import { StatCounter } from "./StatCounter";

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
    <section id="about" className="bg-card py-16 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "var(--accent-ink)" }}>
            About {business.name}
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            The plumber your neighbors already trust.
          </h2>
          <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-ink-soft">
            {business.about}
          </p>
        </Reveal>

        {/* Spec sheet — open rows, engineered rather than boxed */}
        <Reveal delay={0.15} className="self-center">
          <dl className="grid grid-cols-2 gap-x-10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-t-2 py-6"
                style={{ borderColor: "color-mix(in srgb, var(--brand) 14%, transparent)" }}
              >
                <dd
                  className="font-display text-5xl font-black tracking-tight"
                  style={{ color: "var(--brand)" }}
                >
                  <StatCounter value={s.value} />
                </dd>
                <dt className="spec mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
