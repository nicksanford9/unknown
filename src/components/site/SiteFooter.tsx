import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";

export function SiteFooter({ business }: { business: Business }) {
  return (
    <footer
      className="py-16 text-white/70"
      style={{ background: "var(--brand-dark)" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span
                className="grid h-9 w-9 place-items-center rounded-md font-display text-lg font-black"
                style={{ background: "var(--accent)", color: "var(--brand-dark)" }}
                aria-hidden
              >
                {business.name.charAt(0)}
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                {business.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-white/60">
              {business.tagline}
            </p>
            {business.licensed && (
              <p className="spec mt-5 text-xs uppercase tracking-wider text-white/45">
                Licensed &amp; Insured
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="spec text-xs uppercase tracking-wider text-white/45">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm">
              <li>
                <a
                  href={telHref(business.phone)}
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  {business.phone}
                </a>
              </li>
              {business.email && (
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    {business.email}
                  </a>
                </li>
              )}
              {business.address && (
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "var(--accent)" }}
                  />
                  {business.address}
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="spec text-xs uppercase tracking-wider text-white/45">
              Hours
            </h3>
            <ul className="mt-4 space-y-3 font-body text-sm">
              {business.hours.map((h) => (
                <li
                  key={h.days}
                  className="flex items-center justify-between gap-4 text-white/70"
                >
                  <span className="flex items-center gap-3">
                    <Clock
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />
                    {h.days}
                  </span>
                  <span className="spec text-white/85">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-body text-xs text-white/45">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p className="spec text-xs text-white/40">
            {business.city}, {business.state}
          </p>
        </div>
      </div>
    </footer>
  );
}
