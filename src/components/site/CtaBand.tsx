import { Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { QuoteForm } from "./QuoteForm";

export function CtaBand({ business }: { business: Business }) {
  return (
    <section
      id="quote"
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: "var(--brand)" }}
    >
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow mb-5 justify-center text-white/70">Ready when you are</p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Got a plumbing problem? Let&apos;s fix it today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-white/80">
            Call now for fast, upfront pricing — or send the details and
            we&apos;ll get right back to you.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={telHref(business.phone)}
              className="flex items-center gap-2.5 rounded-full px-8 py-4 font-body text-base font-semibold shadow-xl shadow-black/20 transition-transform hover:scale-[1.03]"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <Phone className="h-5 w-5" />
              Call {business.phone}
            </a>
          </div>
          <div className="mx-auto mt-10 max-w-xl border-t border-white/15 pt-10">
            <QuoteForm business={business} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
