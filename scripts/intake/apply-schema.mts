import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sql } from "./db.mts";

const ddl = readFileSync(resolve(import.meta.dirname, "schema.sql"), "utf8");
await sql.unsafe(ddl);
const tables = await sql`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name`;
console.log("tables:", tables.map((t) => t.table_name).join(", "));
await sql.end();
