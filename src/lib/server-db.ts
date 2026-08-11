import "server-only";
import postgres from "postgres";

/** App-side Postgres client (Supabase). Server components / actions only. */
export const sql = postgres(process.env.SUPABASE_DB_URL!, {
  ssl: "require",
  max: 2,
  prepare: false, // pgbouncer-compatible
});
