"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, X, FileText } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref, smsHref } from "@/lib/utils";

/** Floating "text us" bubble — the chat-widget feel without chat infrastructure. */
export function TextBubble({ business }: { business: Business }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-72 overflow-hidden rounded-xl border border-line bg-card shadow-2xl shadow-black/15"
          >
            <div
              className="px-5 py-4"
              style={{ background: "var(--brand)", color: "var(--on-brand)" }}
            >
              <p className="font-display text-base font-bold">{business.name}</p>
              <p className="mt-0.5 font-body text-xs opacity-75">
                Usually replies within minutes
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <a
                href={smsHref(business.phone)}
                className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 font-body text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                <MessageCircle className="h-4.5 w-4.5" style={{ color: "var(--accent-ink)" }} />
                Text us — {business.phone}
              </a>
              <a
                href={telHref(business.phone)}
                className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 font-body text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                <Phone className="h-4.5 w-4.5" style={{ color: "var(--accent-ink)" }} />
                Call now
              </a>
              <a
                href="#quote"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 font-body text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                <FileText className="h-4.5 w-4.5" style={{ color: "var(--accent-ink)" }} />
                Request a quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        className="grid h-14 w-14 place-items-center rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
