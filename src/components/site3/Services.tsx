import Image, { type StaticImageData } from "next/image";
import { Home, ShieldAlert, Wrench, type LucideIcon } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "@/components/site2/Reveal";
import { SectionHead } from "./SectionHead";
import leakImage from "../../../public/images/plumber-demo1/leak-detection.png";
import drainImage from "../../../public/images/plumber-demo1/drain-cleaning.png";
import heaterImage from "../../../public/images/plumber-demo1/water-heater-service.png";

const PHOTOS: Record<number, StaticImageData> = {
  0: leakImage,
  1: drainImage,
  2: heaterImage,
};

const ICONS: Record<string, LucideIcon> = { Wrench, ShieldAlert, Home };

export function Services({ business }: { business: Business }) {
  return (
    <section id="services" className="bg-paper py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          label="How we can help"
          title="The right fix starts with finding the real problem."
          sub="Start with what you are seeing, hearing, or smelling. We will help narrow it down and explain the repair choices clearly."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {business.services.map((service, index) => {
            const photo = PHOTOS[index];
            const Icon = ICONS[service.icon] ?? Wrench;
            return (
              <Reveal key={service.title} delay={(index % 3) * 0.08}>
                <article className="group h-full overflow-hidden rounded-2xl border border-line bg-card transition-transform duration-300 hover:-translate-y-1">
                  {photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo}
                        alt={`${service.title} in progress`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                  ) : (
                    <div
                      className="grid aspect-[4/3] place-items-center"
                      style={{ background: "var(--brand-tint)" }}
                    >
                      <Icon className="h-10 w-10" style={{ color: "var(--brand)" }} />
                    </div>
                  )}
                  <div className="p-7 sm:p-8">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-4 font-body leading-relaxed text-ink-soft">
                      {service.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
