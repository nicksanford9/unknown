# Prospect Intake Pipeline — Proposal v0.1

Scope: everything from "raw Outscraper/Apify pull" to "prospect with a finished personalized site, ready for the call queue." Software product (Atlas Local app) comes after; see `docs/product-plan.md`.

---

## 1. Data sources — Outscraper vs Apify

### What each gives us

| Need | Outscraper (GMaps + contacts/phone enrichment) | Apify `compass/google-maps-extractor` (tested live) |
|---|---|---|
| Core place data (name, address, lat/lng, categories, hours, rating, review count, photo count) | ✅ | ✅ (`title`, `categories`, `location`, `openingHours`, `totalScore`, `reviewsCount`, `imagesCount`) |
| **Phone type (mobile vs landline)** | ✅ phone enricher — the killer field | ❌ not available |
| Emails, Facebook/Instagram links | ✅ contacts enrichment | ❌ |
| Logo URL | ✅ `logo` column | ❌ (only `imageUrl` = main cover photo) |
| Owner name/link | ✅ `owner_title`/`owner_link` (often blank) | ❌ |
| Verified/claimed status | ✅ `verified` | ✅ inverse: `claimThisBusiness` |
| Search rank | ❌ (not positional) | ✅ `rank` per search term — useful for the SEO comparison pitch |
| Full review text | Paid add-on | ✅ via the **full** actor `compass/crawler-google-places` (not the lite extractor) |
| Photos (actual images) | Paid add-on | ✅ same full actor, `maxImages` |
| Cost | Paid account | 3 × $5 free trial credits |

### Conclusion (confirms your instinct)

- **Outscraper = source of truth for the master list** (phone type, emails, socials, logo — all the qualification fields live there).
- **Apify = reviews + photos for qualified prospects only**, using `compass/crawler-google-places` fed `placeId`s (place IDs match across both sources — join key). The lite extractor we tested returns no reviews/photos, so the deep scrape must use the full actor.
- One extra thing Apify gives us that's worth keeping: `rank` per search term. A full-market Apify pull (like the Birmingham one running now) doubles as the ranking snapshot for the "here's where you sit vs competitors" pitch. That's ~$1–2 of free credit per metro. Worth doing once per market.

### Findings from the first real pull (Birmingham plumbers, 2026-07-17)

`Outscraper-20260717211023m39_plumber.csv` — 120 columns, 430 rows → **236 unique place_ids** (zip-code query mode duplicates heavily; dedupe on `place_id` is mandatory, and per-zip `query` column tells you which zips a business surfaced in).

- **Phone types (deduped)**: 101 landline, 71 mobile, 37 fixed line, 17 blank, 6 voip, 4 toll-free. Treat blank→mobile as planned; treat voip like landline (office system).
- **Tier sizes (type=Plumber, 174 of 236)**: Tier A (mobile/blank + no website) ≈ **38**, Tier B (mobile + website) ≈ 27, Tier C (landline etc.) ≈ 109.
- **Facebook**: 102/236 have one — but **0 of the 38 Tier A** do. Outscraper's contact enrichment only finds Facebook when there's a website to crawl, so the agentic Facebook hunt is not optional; it's the only source for exactly the leads we care about.
- **`full_name`/`first_name`/`title` (leads_n_contacts enrichment)**: real person names on 62/236. **Decision: skipped for v1** — owner names come from the enrichment agent (review replies etc.); revisit these columns later as a cross-check.
- **`owner_title`** is the GMB listing owner = business name, not a person. Ignore for owner hunting.
- **`chain_info.chain`** True/False flag (16 True) — free franchise auto-reject signal.
- **`company_insights.founded_year`** on 60/236 — years-in-business for site copy.
- **`whitepages_phones.*`** columns are ~empty (6/430) — drop that enrichment from future pulls, it costs money for nothing.
- **Logo URLs come at 44px** (`.../s44-p-k-no-ns-nd/photo.jpg`). **Remove the size segment entirely** (`.../photo.jpg`) — verified live: returns the original upload (512px on the sample) vs 44px. Do this before color extraction/header use.
- **Website tech columns** (`website_generator`, `website_has_gtm`, `website_has_fb_pixel`) — free ammo for the Tier B pitch ("your Wix site has no tracking installed…").
- **Apify overlap**: only 76 place_ids shared between the Outscraper 236 and the Apify 184 — the two searches surface meaningfully different sets. Load both into `places`; union coverage is real, and Apify-only rows still carry the rank snapshot.

---

## 2. Supabase schema

Principle: **never delete, never move rows between tables — status columns + reasons.** Raw data is append-only; everything downstream is derived and re-derivable.

### Tables

**`places`** — every business ever scraped, one row per Google `place_id`. Raw payloads as JSONB so we keep every column without a 200-column table, and Outscraper schema changes can't break us.
```sql
place_id text primary key,
name text, niche text, city text, state text,
phone text, phone_type text,           -- 'mobile' | 'landline' | 'fixed_line' | 'unknown'
website text, facebook text, instagram text, email text,
category text, subtypes text[],
lat float8, lng float8,
rating numeric, review_count int, photo_count int,
logo_url text, verified bool, search_rank jsonb,   -- {"plumber": 4, ...} from Apify
outscraper_raw jsonb, apify_raw jsonb,
first_seen timestamptz, last_seen timestamptz
```

**`place_qualification`** — the trim-down verdict, auditable and reversible:
```sql
place_id text pk references places,
verdict text,          -- 'qualified' | 'rejected' | 'bench'
tier text,             -- A/B/C priority for the call queue (see §3)
reject_reason text,    -- 'not_plumber' | 'franchise_national' | 'closed' | 'duplicate' | ...
decided_by text,       -- 'script' | 'agent' | 'human'
notes text, decided_at timestamptz
```

**`prospects`** — only qualified businesses enter here. Lifecycle from the product plan pipeline:
`imported → qualified → site_ready → call_queue → contacted → interested → demo_viewed → domain_paid → onboarding → active_client → not_interested → dead`
- **Not interested** → `status='not_interested'` + `followup_at` (a "no" today is often a "yes" in 6 months; you also don't want to re-import them as fresh next pull).
- **Becomes client** → `status='active_client'` and later gets an `organization_id` when the Atlas Local app exists. The prospect row is the sales history; the organization is the product tenant. Different jobs, both live.

**`enrichment`** — agent findings, one row per prospect, structured + confidence:
```sql
place_id text pk,
found_facebook text, facebook_active bool,
owner_name text, owner_name_confidence text,   -- 'high'|'medium'|'low' + source
license_number text, years_in_business int,
services_mentioned text[],       -- from review text
special_notes text,              -- anything interesting the agent found
searched_at timestamptz
```

**`place_reviews`** / **`place_photos`** — deep-scraped content for qualified prospects (cap 200 each). Photos get `storage_path` (Supabase Storage), agent `label` ('job_site','truck','team','logo','irrelevant'...) and `quality_score` once curated.

**`site_configs`** — exactly what the template renders (basically the `Business` type in `src/lib/types.ts` as JSONB + slug + published flag). Keeps creative decisions separate from scraped truth, and means regenerating a site never touches raw data.

---

## 3. The trim-down (qualification) — script + agent split

**Stage 1 — script (deterministic, uniform across markets):**
1. Dedupe on `place_id`; drop permanently closed.
2. Normalize phone type: `mobile` → mobile; `fixed_line`/`landline`/`toll_free` → landline; **blank/unknown → treat as mobile** (agreed — don't throw away leads over missing enrichment).
3. Category triage into three buckets using `category` + `subtypes` + name:
   - **auto-keep**: primary category/type is Plumber, or subtypes contain plumber/drainage/gasfitter and name contains plumbing-ish terms
   - **auto-reject**: clearly other trades with zero plumbing signal (roofers, septic-tank-only, restoration companies, supply stores, city water works) — blocklist we grow per market
   - **ambiguous → Stage 2**: HVAC+plumbing combos, "handyman", contractors, anything unclear
4. National-franchise flag (Roto-Rooter, Mr. Rooter, Benjamin Franklin…): auto-reject for sales (they'll never buy), keep in `places` for market stats.

**Stage 2 — agent adjudicates the ambiguous bucket** (name + categories + description + website + a skim of reviews): is this actually a plumbing business a homeowner would call? Writes verdict + reason to `place_qualification` with `decided_by='agent'`.

**Stage 3 — tiering (not rejection).** Landlines stay in the DB — you're right that they're the market's top performers and we need them for the ranking-comparison pitch. They're just not in the A call queue.
- **Tier A**: mobile/unknown phone + no website — the core free-website pitch
- **Tier B**: mobile + has a website (site may be garbage — agent glances and notes; "your site is hurting you" is a pitch too)
- **Tier C**: landline/fixed — not called initially; retained for market stats and maybe a later, different pitch

Everything about Stage 1 is config, not code: `scripts/intake/config/plumber.json` holds the allow/block lists so the next niche is a new config file, not a new script.

---

## 4. Enrichment agent (per Tier A/B prospect)

One agent run per prospect, with web search, producing one `enrichment` row:

1. **Facebook hunt** — search `"<name>" <city>` and `"<phone>"`; verify a candidate page by phone/address match before accepting. Note if it's active (posts within ~6 months). Outscraper-blank-but-Facebook-active + no website is your best lead profile — this flips prospects into Tier A+.
2. **Owner name** — sources in priority order: Outscraper `owner_title` if it's a person; how the business signs review replies; names customers repeatedly use in reviews ("John was great" × 8); Facebook page. Record confidence — you only say "Hey John" on the phone if confidence is high.
3. **Generic search checklist** — AL plumbing license (Alabama Plumbers & Gas Fitters Examining Board lookup), years in business ("serving Birmingham since…"), BBB/Angi/Yelp presence, and a free-text `special_notes` for anything unusual (award, news story, veteran-owned, father-son shop…) — cold-call gold.
4. **Services mentioned** — while skimming reviews: tally service keywords (water heater, sewer line, gas, tankless, slab leak…) into `services_mentioned` — feeds site personalization (§6).

Runs as a Task-tool agent batch (Sonnet is fine for this; ~50 prospects per market is cheap on the Max plan).

---

## 5. Logo pipeline

Per prospect with a `logo_url`:
1. **Script**: download → detect the known generic placeholders (Google's default avatars have a handful of exact patterns — hash match) → extract palette (sharp/node-vibrant: primary + secondary + a light tint) → check contrast/usability of the palette.
2. **Vision agent** on the survivors: "real logo, or generic icon/photo-as-logo?" + quality call. Verdict:
   - **Real logo** → resize/pad to fit the header slot (contain into fixed height, trim whitespace, detect if it needs a light or dark background) → Supabase Storage → `site_configs.logoUrl` + extracted theme colors.
   - **Not a logo but has brand colors** (e.g. a blue van photo, a colored monogram) → use extracted colors for the theme, name-as-logo in the header (template already supports `logoUrl: undefined`).
   - **Generic/unusable** → default theme, name-as-logo.

---

## 6. Site personalization — services, photos, copy

**Services library first**: expand `Services` to a master library of ~18–20 plumber services (each with icon, title, 2 copy variants, one stock photo). Template still renders exactly 6.

**Selection rules, in priority order:**
1. A **good photo of theirs** showing a service → that service makes the six (photo evidence beats everything).
2. `services_mentioned` from reviews (≥2 mentions) → include.
3. Category subtypes (e.g. "Water heater repair service", "Gasfitter") → include.
4. Fill remaining slots from the default-six generic list.
Always keep Emergency + Drain Cleaning unless evidence says otherwise — they're the universal money services.

**Photo curation (vision agent, per prospect with photos):** label each scraped photo (job work / before-after / truck-van / team-owner / logo / storefront / irrelevant), score quality, then pick: best wide job/team shot → hero (`heroIsReal: true`), best owner/team/truck shot → about, service-relevant shots → service cards. No good photos (the common case) → stock set. Rotate 2–3 stock heroes/abouts so ten Birmingham demos don't all look identical when you screen-share.

**Copy**: templated with slots (name, city, years, licensed, 24/7, services) + agent polish pass only where enrichment found something worth weaving in ("family-owned since 1998"). Never fabricate claims — licensed/years only appear when we actually found them.

**Service areas**: static list of Birmingham-metro suburbs with lat/lng (one-time setup per metro); pick the 6–8 nearest to the business, always include the anchor city. Pure script, no agent needed.

**Reviews section**: current `shouldShowReviews` gate (≥4.5 rating, ≥8 reviews, ≥3 five-star) is right. Show the best 3–5 five-star reviews (agent picks: specific, service-mentioning, well-written, ideally owner-name-mentioning), slideshow if >3, "Read all N reviews on Google" button → their reviews link. Below the gate → section hides, trust bar just shows the rating if decent.

---

## 7. Pipeline flow (per market)

```
Outscraper pull ──→ data/raw/outscraper/           Apify market pull ──→ data/raw/apify/
        │                                                   │ (rank snapshot)
        ▼                                                   ▼
 [script] load-raw → places table  ◄────── join on place_id ┘
        ▼
 [script] qualify pass 1  → auto-keep / auto-reject / ambiguous
 [agent]  qualify pass 2  → ambiguous adjudicated       } place_qualification
 [script] tiering A/B/C
        ▼
 [agent]  enrichment (Tier A/B: facebook, owner, license, services)
        ▼
 [apify]  deep scrape reviews+photos (placeIds, cap 200 each) → place_reviews/place_photos
        ▼
 [script+agent] logo pipeline → theme
 [agent]  photo curation → hero/about/service picks
 [script+agent] site build → site_configs → live at /{slug}
        ▼
 call queue (Tier A first) — you, on the phone
```

## 8. Agents & skills layout

- `.claude/skills/intake-market/` — the orchestrator skill: "intake plumbers for {city}" runs the whole flow above, knows the order, invokes the agents below in batches.
- `.claude/agents/prospect-qualifier.md` — Stage-2 category adjudication.
- `.claude/agents/enrichment-scout.md` — §4 (web search enabled).
- `.claude/agents/photo-curator.md` — §6 photo labeling/picking (vision).
- `.claude/agents/logo-analyst.md` — §5 verdicts (vision).

Scaffolds for these are in the repo as drafts; they get finalized as the scripts land.

## 9. Open decisions for you

1. **Deep-scrape spend**: reviews+photos for all qualified (~$2–4/market of Apify credit) or Tier A only?
2. **Tier B pitch**: include has-website businesses in the first Birmingham call batch, or A-only until the process is proven?
3. **Stock photos**: need to actually source the stock set (heroes, abouts, one per service in the library). Licensed source preference? (Unsplash is fine to start.)
4. **Supabase**: I propose creating the schema above in the existing project now so the loader script has a target. Any objection?
