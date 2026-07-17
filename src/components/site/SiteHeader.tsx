"use client";

import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import type { Business } from "@/lib/types";
import { telHref, cn } from "@/lib/utils";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Areas", href: "#areas" },
];

export function SiteHeader({ business }: { business: Business }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--brand)]/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo / name-as-logo */}
        <a href="#top" className="flex items-center gap-2.5 text-white">
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
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telHref(business.phone)}
            className="spec hidden items-center gap-2 text-sm font-medium text-white sm:flex"
          >
            <Phone className="h-4 w-4" style={{ color: "var(--accent)" }} />
            {business.phone}
          </a>
          <a
            href="#quote"
            className="hidden rounded-full px-5 py-2.5 font-body text-sm font-semibold text-[var(--brand-dark)] shadow-sm transition-transform hover:scale-[1.03] md:inline-block"
            style={{ background: "var(--accent)" }}
          >
            Get a Quote
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-md text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[var(--brand)]/98 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 font-body text-base font-medium text-white/90 hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
            <a
              href={telHref(business.phone)}
              className="spec mt-2 flex items-center gap-2 rounded-md px-3 py-3 text-base font-semibold text-white"
            >
              <Phone className="h-5 w-5" style={{ color: "var(--accent)" }} />
              {business.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
