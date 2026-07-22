// Load raw Outscraper CSV and/or Apify JSON pulls into `places`.
// Usage: tsx scripts/intake/load-raw.mts --niche plumber --market birmingham-al \
//          [--outscraper data/raw/outscraper/x.csv] [--apify data/raw/apify/x.json]
// Idempotent: upserts on place_id. Outscraper fields win; Apify fills gaps.

import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { sql } from "./db.mts";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
const niche = args.get("niche");
const market = args.get("market");
if (!niche || !market) throw new Error("--niche and --market are required");

const num = (v: unknown) => (v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v));
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Google-hosted logo URLs embed a size segment (s44-p-k-no…); removing it returns the original upload. */
function fullResLogo(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/s\d+(-[a-z0-9-]+)*\/(?=[^/]+$)/i, "/");
}

function normalizePhoneType(carrier: string | null): string {
  if (!carrier) return "unknown";
  const c = carrier.toLowerCase().replace(/\s+/g, "_");
  return ["mobile", "landline", "fixed_line", "voip", "toll_free"].includes(c) ? c : "unknown";
}

/** Flattens Outscraper's `about` JSON ({"Service options": {"Online estimates": true}}) to one level of true-flags. */
function flattenAbout(aboutJson: string | null): Record<string, true> | null {
  if (!aboutJson) return null;
  try {
    const flat: Record<string, true> = {};
    for (const group of Object.values(JSON.parse(aboutJson))) {
      if (group && typeof group === "object")
        for (const [k, v] of Object.entries(group)) if (v === true) flat[k] = true;
    }
    return Object.keys(flat).length ? flat : null;
  } catch {
    return null;
  }
}

function parseHours(hoursJson: string | null): { hours: object | null; open247: boolean } {
  if (!hoursJson) return { hours: null, open247: false };
  try {
    const h = JSON.parse(hoursJson);
    const open247 = Object.values(h).flat().some((s) => String(s).toLowerCase().includes("24 hours"));
    return { hours: h, open247 };
  } catch {
    return { hours: null, open247: false };
  }
}

let loadedOutscraper = 0;
let loadedApify = 0;

if (args.get("outscraper")) {
  const rows: Record<string, string>[] = parse(readFileSync(args.get("outscraper")!, "utf8"), {
    columns: true,
    skip_empty_lines: true,
  });
  const byId = new Map<string, Record<string, string>>();
  for (const r of rows) if (r.place_id && !byId.has(r.place_id)) byId.set(r.place_id, r);
  console.log(`outscraper: ${rows.length} rows → ${byId.size} unique place_ids`);

  for (const r of byId.values()) {
    const { hours, open247 } = parseHours(str(r.working_hours));
    await sql`
      insert into places (place_id, name, niche, market, city, state, address, phone, phone_type,
        website, facebook, instagram, email, category, subtypes, lat, lng, rating, review_count,
        photo_count, reviews_link, logo_url, verified, is_chain, founded_year, business_status,
        attributes, hours, open_24_7, booking_link, street_view_url, email_status, outscraper_raw)
      values (${r.place_id}, ${r.name}, ${niche}, ${market}, ${str(r.city)}, ${str(r.state)},
        ${str(r.address)}, ${str(r.phone)}, ${normalizePhoneType(str(r["phone.phones_enricher.carrier_type"]))},
        ${str(r.website)}, ${str(r.company_facebook)}, ${str(r.company_instagram)}, ${str(r.email)},
        ${str(r.type)}, ${(str(r.subtypes) ?? "").split(",").map((s) => s.trim()).filter(Boolean)},
        ${num(r.latitude)}, ${num(r.longitude)}, ${num(r.rating)}, ${num(r.reviews)},
        ${num(r.photos_count)}, ${str(r.reviews_link)}, ${fullResLogo(str(r.logo))},
        ${r.verified === "True"}, ${r["chain_info.chain"] === "True"},
        ${num(r["company_insights.founded_year"])}, ${str(r.business_status)},
        ${sql.json(flattenAbout(str(r.about)))}, ${sql.json(hours)}, ${open247},
        ${str(r.booking_appointment_link)}, ${str(r.street_view)}, ${str(r["email.emails_validator.status"])},
        ${sql.json(r)})
      on conflict (place_id) do update set
        attributes = excluded.attributes, hours = excluded.hours, open_24_7 = excluded.open_24_7,
        booking_link = excluded.booking_link, street_view_url = excluded.street_view_url,
        email_status = excluded.email_status,
        name = excluded.name, city = excluded.city, state = excluded.state, address = excluded.address,
        phone = excluded.phone, phone_type = excluded.phone_type, website = excluded.website,
        facebook = excluded.facebook, instagram = excluded.instagram, email = excluded.email,
        category = excluded.category, subtypes = excluded.subtypes, lat = excluded.lat, lng = excluded.lng,
        rating = excluded.rating, review_count = excluded.review_count, photo_count = excluded.photo_count,
        reviews_link = excluded.reviews_link, logo_url = excluded.logo_url, verified = excluded.verified,
        is_chain = excluded.is_chain, founded_year = excluded.founded_year,
        business_status = excluded.business_status, outscraper_raw = excluded.outscraper_raw,
        last_seen = now()`;
    loadedOutscraper++;
  }
}

if (args.get("apify")) {
  const rows: any[] = JSON.parse(readFileSync(args.get("apify")!, "utf8"));
  // A place can appear under several search terms; collect rank per term, keep one row.
  const byId = new Map<string, { row: any; ranks: Record<string, number> }>();
  for (const r of rows) {
    if (!r.placeId) continue;
    const e = byId.get(r.placeId) ?? { row: r, ranks: {} };
    if (r.searchString && r.rank != null) {
      e.ranks[r.searchString] = Math.min(e.ranks[r.searchString] ?? Infinity, r.rank);
    }
    byId.set(r.placeId, e);
  }
  console.log(`apify: ${rows.length} rows → ${byId.size} unique place_ids`);

  for (const { row: r, ranks } of byId.values()) {
    const status = r.permanentlyClosed ? "CLOSED_PERMANENTLY" : r.temporarilyClosed ? "CLOSED_TEMPORARILY" : "OPERATIONAL";
    await sql`
      insert into places (place_id, name, niche, market, city, state, address, phone, phone_type,
        website, category, subtypes, lat, lng, rating, review_count, photo_count, business_status,
        search_rank, apify_raw)
      values (${r.placeId}, ${r.title}, ${niche}, ${market}, ${str(r.city)}, ${str(r.state)},
        ${str(r.address)}, ${str(r.phone)}, ${"unknown"}, ${str(r.website)}, ${str(r.categoryName)},
        ${r.categories ?? []}, ${r.location?.lat ?? null}, ${r.location?.lng ?? null},
        ${num(r.totalScore)}, ${num(r.reviewsCount)}, ${num(r.imagesCount)}, ${status},
        ${sql.json(ranks)}, ${sql.json(r)})
      on conflict (place_id) do update set
        search_rank = excluded.search_rank, apify_raw = excluded.apify_raw,
        -- fill gaps only; Outscraper stays authoritative for shared fields
        website = coalesce(places.website, excluded.website),
        rating = coalesce(places.rating, excluded.rating),
        review_count = coalesce(places.review_count, excluded.review_count),
        photo_count = coalesce(places.photo_count, excluded.photo_count),
        last_seen = now()`;
    loadedApify++;
  }
}

const [{ count }] = await sql`select count(*)::int as count from places where market = ${market}`;
console.log(`upserted: ${loadedOutscraper} outscraper, ${loadedApify} apify. places rows for ${market}: ${count}`);
await sql.end();
