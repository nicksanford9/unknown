// Apply agent/human qualification verdicts on top of pass 1.
// Usage: tsx scripts/intake/apply-verdicts.mts --file data/processed/verdicts-x.json --by agent
// File format: [{"place_id": "...", "verdict": "qualified"|"rejected", "reason": "...", "confidence": "high"|"low"}]

import { readFileSync } from "node:fs";
import { sql } from "./db.mts";
import { pitchAngle } from "./lib.mts";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
const file = args.get("file");
const by = args.get("by") ?? "agent";
if (!file) throw new Error("--file required");

import { CALLABLE_TYPES } from "./lib.mts";
const verdicts: { place_id: string; verdict: string; reason?: string; confidence?: string }[] =
  JSON.parse(readFileSync(file, "utf8"));

let applied = 0;
for (const v of verdicts) {
  const [p] = await sql`select phone_type, website from places where place_id = ${v.place_id}`;
  if (!p) { console.warn(`unknown place_id ${v.place_id} — skipped`); continue; }
  const callable = v.verdict === "qualified" ? CALLABLE_TYPES.has(p.phone_type) : null;
  const pitch = v.verdict === "qualified" ? pitchAngle(p.website) : null;
  await sql`
    insert into place_qualification (place_id, verdict, callable, pitch_angle, reject_reason, decided_by, notes)
    values (${v.place_id}, ${v.verdict}, ${callable}, ${pitch}, ${v.reason ?? null}, ${by}, ${v.confidence ?? null})
    on conflict (place_id) do update set
      verdict = excluded.verdict, callable = excluded.callable, pitch_angle = excluded.pitch_angle,
      reject_reason = excluded.reject_reason, decided_by = excluded.decided_by,
      notes = excluded.notes, decided_at = now()
      where place_qualification.decided_by <> 'human'`;
  if (v.verdict === "qualified" && callable) {
    await sql`insert into prospects (place_id) values (${v.place_id}) on conflict do nothing`;
  }
  applied++;
}
console.log(`applied ${applied} verdicts as '${by}'`);
await sql.end();
