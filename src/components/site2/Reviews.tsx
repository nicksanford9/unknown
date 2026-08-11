import { Star, ArrowUpRight } from "lucide-react";
import type { Business } from "@/lib/types";
import { shouldShowReviews } from "@/lib/types";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Reviews({ business }: { business: Business }) {
  // Guard: thin or weak social proof is worse than none on a sales page.
  if (!shouldShowReviews(business)) return null;

  const fiveStar = business.reviews.filter((r) => r.rating >= 5).slice(0, 6);

  return (
    <section
      id="reviews"
      className="py-16 sm:py-28"
      style={{ background: "var(--brand-tint)" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          label="Reviews"
          title={`${business.rating?.toFixed(1)} stars from ${business.reviewCount}+ neighbors.`}
          sub={`Straight from Google — real ${business.city} homeowners, real jobs.`}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fiveStar.map((review, i) => (
            <Reveal key={review.author + i} delay={(i % 3) * 0.08}>
              <figure className="card-flat flex h-full flex-col p-7 sm:p-8">
                <span
                  aria-hidden
                  className="font-display text-5xl font-black leading-none"
                  style={{ color: "var(--accent-ink)", opacity: 0.85 }}
                >
                  “
                </span>
                <blockquote className="mt-3 flex-1 font-body text-[1.05rem] leading-relaxed text-ink-soft">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <span className="font-display font-bold text-ink">
                    {review.author}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--accent-ink)", fill: "var(--accent-ink)" }}
                      />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {business.website && (
          <Reveal className="mt-12 flex justify-center">
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-[var(--brand)]/25 bg-card px-7 py-3.5 font-body text-sm font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white"
            >
              Read all reviews
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
