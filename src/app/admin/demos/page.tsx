import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllBusinesses } from "@/lib/businesses";

export default function Home() {
  const businesses = getAllBusinesses();
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
      <p className="eyebrow text-muted">Prospect Sites · internal</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink">
        Live demo sites
      </h1>
      <p className="mt-3 font-body text-ink-soft">
        Preview of generated prospect websites. This index is internal — each site
        below is what a business would receive.
      </p>

      <ul className="mt-10 divide-y divide-line rounded-2xl border border-line bg-card">
        {businesses.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/${b.slug}`}
              className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-paper"
            >
              <div>
                <div className="font-display text-lg font-bold text-ink">
                  {b.name}
                </div>
                <div className="spec mt-1 text-xs uppercase tracking-wider text-muted">
                  {b.niche} · {b.city}, {b.state} · /{b.slug}
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
