import type { Business } from "@/lib/types";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    title: "Call or request a quote",
    text: "Reach a real person, not a phone tree. Tell us what's going on.",
  },
  {
    title: "We diagnose it",
    text: "On-time arrival, honest assessment, and clear options explained.",
  },
  {
    title: "Upfront price",
    text: "You approve the exact price before any work starts. No surprises.",
  },
  {
    title: "Fixed right",
    text: "Done cleanly, tested, and backed by our workmanship guarantee.",
  },
];

/** Numbered because it IS a sequence — what actually happens when you call. */
export function Process({ business }: { business: Business }) {
  return (
    <section
      id="process"
      className="py-16 sm:py-28"
      style={{ background: "var(--brand-tint)" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-5" style={{ color: "var(--accent-ink)" }}>
            How it works
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            No surprises. Just fixed.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div
                className="border-t-2 pt-5"
                style={{ borderColor: "color-mix(in srgb, var(--brand) 18%, transparent)" }}
              >
                <div className="spec text-sm font-semibold" style={{ color: "var(--accent-ink)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-[0.95rem] leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
