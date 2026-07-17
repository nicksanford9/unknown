# scripts/intake — pipeline scripts (planned)

Deterministic stages of the intake pipeline (`docs/intake-pipeline.md`). Each script is idempotent and re-runnable per market.

Planned:
- `load-raw.ts` — Outscraper/Apify files → `places` upsert
- `qualify.ts` — dedupe, phone-type normalize, category triage vs `config/<niche>.json`
- `tier.ts` — A/B/C tiering → `prospects`
- `deep-scrape.ts` — Apify crawler-google-places by placeId (reviews+photos, cap 200)
- `logo-colors.ts` — placeholder detection + palette extraction (sharp)
- `build-site.ts` — assemble `site_configs`
- `config/plumber.json` — category allow/block lists, default services, franchise blocklist
