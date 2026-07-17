import {
  Droplets,
  ShowerHead,
  Flame,
  Wrench,
  ShieldAlert,
  Home,
  Pipette,
  type LucideIcon,
} from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  Droplets,
  ShowerHead,
  Flame,
  Wrench,
  ShieldAlert,
  Home,
  Pipette,
};

export function Services({ business }: { business: Business }) {
  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-5" style={{ color: "var(--accent)" }}>
            What we do
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            Full-service plumbing, done right.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-ink-soft">
            From emergency repairs to full installations, {business.name} handles
            every job with the same care and honest pricing.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {business.services.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Wrench;
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-2xl border border-line bg-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--brand)]/25 hover:shadow-xl hover:shadow-[var(--brand)]/5">
                  <div
                    className="grid h-13 w-13 place-items-center rounded-xl transition-colors"
                    style={{ background: "var(--brand-tint)" }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "var(--brand)" }} />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-body text-[0.975rem] leading-relaxed text-ink-soft">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
