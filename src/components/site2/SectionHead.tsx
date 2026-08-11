import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/** v2 section header — centered, generous, readable. No micro-labels. */
export function SectionHead({
  label,
  title,
  sub,
  align = "center",
  dark = false,
}: {
  label: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        centered && "mx-auto flex flex-col items-center text-center"
      )}
    >
      <p
        className="font-body text-sm font-bold uppercase tracking-[0.14em]"
        style={{ color: dark ? "var(--accent-text)" : "var(--accent-ink)" }}
      >
        {label}
      </p>
      <h2
        className={cn(
          "mt-3 font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "mt-5 max-w-2xl font-body text-lg leading-relaxed",
            dark ? "text-white/80" : "text-ink-soft"
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
