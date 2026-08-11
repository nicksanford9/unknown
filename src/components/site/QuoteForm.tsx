"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitLead, type LeadState } from "@/lib/actions";
import type { Business } from "@/lib/types";

const initial: LeadState = { status: "idle" };

export function QuoteForm({ business }: { business: Business }) {
  const [state, formAction, pending] = useActionState(submitLead, initial);

  if (state.status === "ok") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg bg-white/10 px-8 py-10 text-center backdrop-blur-sm">
        <CheckCircle2 className="h-10 w-10" style={{ color: "var(--accent-text)" }} />
        <p className="font-display text-xl font-bold text-white">Request sent.</p>
        <p className="font-body text-sm leading-relaxed text-white/80">
          {business.name} will get back to you shortly. Need help right now?
          Call {business.phone}.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-white/15 bg-white/10 px-4 py-3.5 font-body text-[0.95rem] text-white placeholder:text-white/45 backdrop-blur-sm focus:border-white/40 focus:outline-none";

  return (
    <form action={formAction} className="mx-auto max-w-xl text-left">
      <input type="hidden" name="slug" value={business.slug} />
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Your name" required className={field} />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          required
          className={field}
        />
      </div>
      <select name="service" defaultValue="" className={`${field} mt-3 appearance-none`}>
        <option value="" disabled className="text-ink">
          What do you need help with?
        </option>
        {business.services.map((s) => (
          <option key={s.title} value={s.title} className="text-ink">
            {s.title}
          </option>
        ))}
        <option value="Other" className="text-ink">
          Something else
        </option>
      </select>
      <textarea
        name="message"
        rows={3}
        placeholder="Briefly describe the problem (optional)"
        className={`${field} mt-3 resize-none`}
      />
      {state.status === "error" && (
        <p className="mt-3 font-body text-sm text-red-300">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-full px-8 py-4 font-body text-base font-semibold shadow-xl shadow-black/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {pending ? "Sending…" : "Request my free quote"}
      </button>
      <p className="mt-3 text-center font-body text-xs text-white/50">
        No spam, no obligation. We only use this to get back to you.
      </p>
    </form>
  );
}
