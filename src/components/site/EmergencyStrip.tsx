import { Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref } from "@/lib/utils";

/** Thin urgency bar under the header — only for genuinely 24/7 businesses. */
export function EmergencyStrip({ business }: { business: Business }) {
  if (!business.emergency247) return null;
  return (
    <a
      href={telHref(business.phone)}
      className="relative z-40 flex items-center justify-center gap-2 px-4 py-2.5 text-center transition-opacity hover:opacity-90"
      style={{ background: "var(--accent)", color: "var(--on-accent)" }}
    >
      <Phone className="h-3.5 w-3.5" />
      <span className="spec text-[0.72rem] font-semibold uppercase tracking-[0.14em]">
        Emergency? We answer 24/7 — {business.phone}
      </span>
    </a>
  );
}
