import {
  Droplets,
  ShowerHead,
  Flame,
  Wrench,
  ShieldAlert,
  Home,
  type LucideIcon,
} from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const ICONS: Record<string, LucideIcon> = {
  Droplets,
  ShowerHead,
  Flame,
  Wrench,
  ShieldAlert,
  Home,
};

/** First card carries a photo (preview of the photo-card treatment — one for review, then all). */
const SERVICE_PHOTOS: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
};

export function Services({ business }: { business: Business }) {
  return (
    <section id="services" className="py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          label="Services"
          title={`Whatever's leaking, clogged, or cold — we fix it.`}
          sub={`From a dripping faucet to a full repipe, ${business.name} handles it with upfront pricing and no upsells.`}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {business.services.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Wrench;
            const photo = SERVICE_PHOTOS[i];
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.08}>
                <div className="card-flat h-full overflow-hidden">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={service.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : null}
                  <div className="p-7">
                    {!photo && (
                      <div
                        className="mb-6 grid h-12 w-12 place-items-center rounded-md"
                        style={{ background: "var(--brand-tint)" }}
                      >
                        <Icon className="h-6 w-6" style={{ color: "var(--brand)" }} />
                      </div>
                    )}
                    <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-3 font-body text-[0.975rem] leading-relaxed text-ink-soft">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
