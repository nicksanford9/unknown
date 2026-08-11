import { ClipboardCheck, House, MessageSquareText } from "lucide-react";
import type { Business } from "@/lib/types";
import { Reveal } from "@/components/site2/Reveal";
import { SectionHead } from "./SectionHead";

const PROOF = [
  {
    icon: MessageSquareText,
    title: "Options explained first",
    text: "You hear what failed, what can wait, and what each repair choice means before deciding.",
  },
  {
    icon: ClipboardCheck,
    title: "Price approved before work",
    text: "The scope and price are clear before tools come out—so the invoice is not the surprise.",
  },
  {
    icon: House,
    title: "Your home left in order",
    text: "Work areas are protected, the repair is tested, and the space is cleaned before the crew leaves.",
  },
];

export function About({ business }: { business: Business }) {
  return (
    <section id="about" className="bg-card py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          label={`Why homeowners call ${business.name}`}
          title="A plumbing visit should remove uncertainty—not add to it."
          sub={business.about}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROOF.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <article className="h-full rounded-2xl border border-line bg-paper p-7 text-center sm:p-8">
                <div
                  className="mx-auto grid h-12 w-12 place-items-center rounded-full"
                  style={{ background: "var(--brand-tint)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "var(--brand)" }} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-3 font-body leading-relaxed text-ink-soft">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
