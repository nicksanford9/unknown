import { MapPin } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

export function ServiceArea({ business }: { business: Business }) {
  return (
    <section id="areas" className="bg-card py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "var(--accent)" }}>
            Service area
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            Proudly serving {business.city} &amp; surrounding areas.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-ink-soft">
            If you&apos;re in the greater {business.city} area, we&apos;ve got you
            covered — usually same-day.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-3">
            {business.serviceAreas.map((area) => (
              <span
                key={area}
                className="flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 font-body text-[0.95rem] font-medium text-ink transition-colors hover:border-[var(--brand)]/30"
              >
                <MapPin className="h-4 w-4" style={{ color: "var(--accent)" }} />
                {area}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
