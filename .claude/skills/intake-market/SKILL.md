---
name: intake-market
description: Run the full prospect intake pipeline for a niche + market (e.g. "plumbers in Birmingham AL") — load raw scrapes, qualify, tier, enrich, deep-scrape reviews/photos, and build site configs. Use when the user says to intake/process a new market or a new Outscraper/Apify pull.
---

# Intake a market

Pipeline spec: `docs/intake-pipeline.md`. Status: **draft — scripts in `scripts/intake/` land incrementally; run whatever stages exist, do the rest manually per the spec.**

Stages (in order, each idempotent, each writes to Supabase):

1. **Load raw** — Outscraper export from `data/raw/outscraper/`, Apify market pull from `data/raw/apify/` → upsert into `places` (join on `place_id`; keep full payloads in the JSONB columns).
2. **Qualify pass 1 (script)** — dedupe, drop closed, phone-type normalize (blank/unknown → mobile), category triage vs `scripts/intake/config/<niche>.json` allow/block lists → auto-keep / auto-reject / ambiguous.
3. **Qualify pass 2 (agent)** — batch the ambiguous bucket to `prospect-qualifier` agents (~15 businesses per agent). Write verdicts to `place_qualification`.
4. **Tier** — A: mobile+no website; B: mobile+website; C: landline (kept, not called). Insert Tier A/B into `prospects` as `status='qualified'`.
5. **Enrich** — one `enrichment-scout` agent per Tier A/B prospect (batch ~10 at a time, they use web search).
6. **Deep scrape** — Apify `compass/crawler-google-places` with the qualified `placeId`s, `maxReviews: 200`, `maxImages: 200` → `place_reviews`, `place_photos` (+ Supabase Storage for images). Tokens in `.env.local` (`APIFY_TOKEN_*`, rotate on exhaustion).
7. **Logo + theme** — color-extract script, then `logo-analyst` on non-generic results.
8. **Photo curation** — `photo-curator` per prospect that has photos.
9. **Site build** — assemble `site_configs` per prospect (services selection rules, service areas, reviews gate — all in the pipeline doc §6) → verify each renders at `/{slug}`.

Report at the end: counts per stage (loaded / qualified / rejected+why / tiers / enriched / sites built) and anything needing human review.
