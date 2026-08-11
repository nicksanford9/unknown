import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** Job photo grid. Hidden entirely when there's nothing to show. */
export function Gallery({ business }: { business: Business }) {
  const photos = business.gallery ?? [];
  if (photos.length < 3) return null;

  return (
    <section id="work" className="bg-card py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead label="Recent work" title="Jobs we're proud to put our name on." />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {photos.slice(0, 6).map((photo, i) => (
            <Reveal key={photo.url} delay={(i % 3) * 0.07}>
              <figure className="group relative overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.label}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
                  <span className="spec text-[0.7rem] uppercase tracking-[0.14em] text-white/90">
                    {photo.label}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
