// Website liveness check for businesses that claim a site.
// Usage: tsx scripts/intake/check-websites.mts --market birmingham-al
// Writes places.website_status: 'up' | 'down:<httpcode>' | 'error:<kind>'

import { sql } from "./db.mts";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
const market = args.get("market");
if (!market) throw new Error("--market required");

const rows = await sql`
  select place_id, website from places
  where market = ${market} and website is not null`;

/** Outscraper exports mangle URLs (`?`→%3F, `&`→%26). We only care if their web presence
 *  is alive, so test the homepage origin with a real browser UA. */
function homepage(url: string): string {
  const decoded = url.replace(/%3F/gi, "?").replace(/%26/gi, "&").replace(/%3D/gi, "=");
  return new URL(decoded).origin;
}

const BLOCKED = new Set([401, 403, 405, 429, 999]); // bot-shield responses: site is almost certainly up

async function check(url: string): Promise<string> {
  try {
    const res = await fetch(homepage(url), {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (res.ok) return "up";
    return BLOCKED.has(res.status) ? "blocked" : `down:${res.status}`;
  } catch (e: any) {
    const kind = e?.cause?.code ?? e?.name ?? "unknown";
    return `error:${kind}`;
  }
}

const counts: Record<string, number> = {};
let i = 0;
const queue = [...rows];
await Promise.all(Array.from({ length: 10 }, async () => {
  for (let r = queue.shift(); r; r = queue.shift()) {
    const status = await check(r.website);
    await sql`update places set website_status = ${status}, website_checked_at = now() where place_id = ${r.place_id}`;
    counts[status.split(":")[0]] = (counts[status.split(":")[0]] ?? 0) + 1;
    if (++i % 25 === 0) console.log(`${i}/${rows.length}`);
  }
}));

console.log(`checked ${rows.length} sites:`, counts);
const bad = await sql`
  select p.name, p.website, p.website_status from places p
  join place_qualification q using (place_id)
  where p.market = ${market} and q.verdict = 'qualified' and p.website_status <> 'up'
  order by q.callable desc nulls last`;
console.log("\nqualified businesses with non-working sites:");
for (const b of bad) console.log(`  ${b.website_status.padEnd(22)} ${b.name}  ${b.website}`);
await sql.end();
