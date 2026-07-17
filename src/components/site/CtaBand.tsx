import { Phone, ArrowRight } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function CtaBand({ business }: { business: Business }) {
  return (
    <section
      id="quote"
      className="relative overflow-hidden py-24 sm:py-28"
      style={{ background: "var(--brand)" }}
    >
      <div
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow mb-5 text-white/70">Ready when you are</p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Got a plumbing problem? Let&apos;s fix it today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-white/80">
            Call now for fast, upfront pricing — or request a free quote and
            we&apos;ll get right back to you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={telHref(business.phone)}
              className="flex items-center gap-2.5 rounded-full px-8 py-4 font-body text-base font-semibold text-[var(--brand-dark)] shadow-xl shadow-black/20 transition-transform hover:scale-[1.03]"
              style={{ background: "var(--accent)" }}
            >
              <Phone className="h-5 w-5" />
              Call {business.phone}
            </a>
            <a
              href={`mailto:${business.email ?? ""}`}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 font-body text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Request a Free Quote
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
