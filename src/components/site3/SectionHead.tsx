import { Reveal } from "@/components/site2/Reveal";
import { cn } from "@/lib/utils";

export function SectionHead({
  label,
  title,
  sub,
  dark = false,
}: {
  label: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
      <p
        className={cn(
          "font-body text-base font-bold tracking-tight sm:text-lg",
          dark ? "text-white/75" : "text-[var(--brand)]"
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          "mt-3 text-balance font-display text-4xl font-black leading-[1.06] tracking-[-0.035em] sm:text-5xl lg:text-6xl",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-balance font-body text-lg leading-relaxed sm:text-xl",
            dark ? "text-white/75" : "text-ink-soft"
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
