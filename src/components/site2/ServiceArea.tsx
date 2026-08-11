import { MapPin } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

export function ServiceArea({ business }: { business: Business }) {
  const hasMap = business.lat != null && business.lng != null;
  return (
    <section id="areas" className="bg-card py-16 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="mb-3 font-body text-sm font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent-ink)" }}>
            Service area
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            Proudly serving {business.city}{" "}&amp; surrounding areas.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-ink-soft">
            If you&apos;re in the greater {business.city}{" "}area, we&apos;ve got
            you covered — usually same-day.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {business.serviceAreas.map((area) => (
              <span
                key={area}
                className="flex items-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-[var(--brand)]/30"
              >
                <MapPin className="h-3.5 w-3.5" style={{ color: "var(--accent-ink)" }} />
                {area}
              </span>
            ))}
          </div>
        </Reveal>

        {hasMap && (
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-lg border border-line">
              <iframe
                title={`${business.name} service area map`}
                src={`https://www.google.com/maps?q=${business.lat},${business.lng}&z=10&output=embed`}
                className="h-[340px] w-full sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ filter: "grayscale(0.35) contrast(1.02)" }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-lg"
                style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--brand) 15%, transparent)" }}
                aria-hidden
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
