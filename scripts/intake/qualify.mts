// Qualification pass 1 (deterministic) — docs/intake-pipeline.md §3.
// Usage: tsx scripts/intake/qualify.mts --niche plumber --market birmingham-al
// Writes place_qualification (never overwrites agent/human verdicts), inserts
// qualified+callable into prospects, dumps the ambiguous bucket for the agent pass.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { sql } from "./db.mts";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
const niche = args.get("niche");
const market = args.get("market");
if (!niche || !market) throw new Error("--niche and --market are required");

const cfg = JSON.parse(readFileSync(resolve(import.meta.dirname, `config/${niche}.json`), "utf8"));
import { CALLABLE_TYPES, pitchAngle } from "./lib.mts";

const places = await sql`select * from places where market = ${market} and niche = ${niche}`;
const counts: Record<string, number> = {};
const ambiguous: any[] = [];

for (const p of places) {
  let verdict = "ambiguous";
  let reason: string | null = null;

  const name = (p.name ?? "").toLowerCase();
  const subtypes: string[] = (p.subtypes ?? []).map((s: string) => s.toLowerCase());
  const hasPlumbSubtype = subtypes.some((s) =>
    cfg.ambiguous_subtype_signals.some((sig: string) => s.includes(sig)),
  );

  if (p.business_status !== "OPERATIONAL") {
    verdict = "rejected"; reason = "closed";
  } else if (p.is_chain || cfg.franchise_names.some((f: string) => name.includes(f))) {
    verdict = "rejected"; reason = "franchise_national";
  } else if (cfg.keep_categories.includes(p.category)) {
    verdict = "qualified";
  } else if (cfg.ambiguous_categories.includes(p.category) || hasPlumbSubtype || p.category == null) {
    // Cheap URL tell (user-suggested): a supply/hardware/remodel-looking domain with no
    // niche token anywhere is a terrible fit — skip the agent pass for these.
    const url = (p.website ?? "").toLowerCase();
    const nicheAnywhere = name.includes(cfg.niche_token) || url.includes(cfg.niche_token);
    if (!nicheAnywhere && cfg.reject_url_tokens.some((t: string) => url.includes(t))) {
      verdict = "rejected"; reason = "not_" + niche;
    } else {
      verdict = "ambiguous";
    }
  } else {
    verdict = "rejected"; reason = "not_" + niche;
  }

  const callable = verdict === "qualified" ? CALLABLE_TYPES.has(p.phone_type) : null;
  const pitch = verdict === "qualified" ? pitchAngle(p.website) : null;

  await sql`
    insert into place_qualification (place_id, verdict, callable, pitch_angle, reject_reason, decided_by)
    values (${p.place_id}, ${verdict}, ${callable}, ${pitch}, ${reason}, 'script')
    on conflict (place_id) do update set
      verdict = excluded.verdict, callable = excluded.callable, pitch_angle = excluded.pitch_angle,
      reject_reason = excluded.reject_reason, decided_by = 'script', decided_at = now()
      where place_qualification.decided_by = 'script'`;

  if (verdict === "qualified" && callable) {
    await sql`insert into prospects (place_id) values (${p.place_id}) on conflict do nothing`;
  }
  if (verdict === "ambiguous") {
    ambiguous.push({
      place_id: p.place_id, name: p.name, category: p.category, subtypes: p.subtypes,
      website: p.website, rating: p.rating, review_count: p.review_count,
      description: p.outscraper_raw?.description ?? p.apify_raw?.description ?? null,
      about: p.outscraper_raw?.about ?? null,
    });
  }
  const key = verdict + (reason ? `:${reason}` : "");
  counts[key] = (counts[key] ?? 0) + 1;
}

mkdirSync(resolve("data/processed"), { recursive: true });
const ambPath = resolve(`data/processed/ambiguous-${market}.json`);
writeFileSync(ambPath, JSON.stringify(ambiguous, null, 1));

const [q] = await sql`
  select count(*) filter (where q.verdict = 'qualified') ::int as qualified,
         count(*) filter (where q.verdict = 'qualified' and q.callable) ::int as callable,
         count(*) filter (where q.verdict = 'qualified' and q.callable and q.pitch_angle = 'no_website') ::int as no_website,
         count(*) filter (where q.verdict = 'ambiguous') ::int as ambiguous,
         count(*) filter (where q.verdict = 'rejected') ::int as rejected
  from place_qualification q join places p using (place_id)
  where p.market = ${market}`;

console.log("pass-1 verdicts this run:", counts);
console.log("db totals:", q);
console.log(`ambiguous bucket → ${ambPath} (${ambiguous.length} for agent pass)`);
await sql.end();
