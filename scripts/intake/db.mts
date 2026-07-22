import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

/** Loads .env.local (scripts run outside Next, so no automatic env loading). */
function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  const text = readFileSync(resolve(import.meta.dirname, "../../.env.local"), "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

export const env = loadEnv();

export const sql = postgres(env.SUPABASE_DB_URL, {
  ssl: "require",
  max: 4,
  prepare: false, // pgbouncer-compatible
});
