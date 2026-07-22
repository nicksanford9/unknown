# Site System — Spec v0.1

How generated prospect/client websites work. Companion to `docs/intake-pipeline.md` (which produces the data these sites render).

## 1. Core model

One rendering engine, config-driven. A site is an **ordered list of sections**; each section names a **variant** (which component renders it) and carries its **props** (content). Niches differ by **content packs** and which variants exist — never by forked templates.

```
site_configs.config = {
  "business": { name, phone, city, theme, logoUrl?, ... },   // shared identity block
  "sections": [
    { "section": "hero",        "variant": "photo-overlay", "props": { headline, imageUrl, imageIsReal } },
    { "section": "trust-bar",   "variant": "badges",        "props": { badges: [...] } },
    { "section": "about",       "variant": "standard",      "props": { paragraph, imageUrl, copySource: "real"|"generic" } },
    { "section": "services",    "variant": "icon-grid",     "props": { services: [six] } },
    { "section": "reviews",     "variant": "carousel",      "props": { reviews: [...] } },   // omitted if below quality gate
    { "section": "service-area","variant": "list-map",      "props": { areas: [...] } },
    { "section": "cta",         "variant": "quote-form",    "props": { ... } }
  ]
}
```

- **Renderer**: `/{slug}` loads the config from Supabase and maps `section/variant` → React component via a registry. Unknown variant = build error, not a broken page.
- **Adding a design** = adding a component + registry entry. **Adding a niche section** (before/after gallery, financing banner) = new section type only that niche's pack uses.
- **Per-site override**: any section of any site can be hand-edited in its config (hot prospect polish) without touching code.
- v1 ships **one good variant per section** for plumbers. The variant field exists so alternates can come later without migration.

## 2. Data ladders (how the builder picks content)

Best variant the data supports wins; every rung is backed by a real field in the DB:

| Section | Ladder |
|---|---|
| Header/logo | real logo (logo-analyst verdict) → name-as-logo. Theme colors: from logo → niche default palette. |
| Hero image | their best photo (photo-curator pick, quality ≥4) → stock rotation (deterministic by slug, so demos differ). |
| Hero headline | 24/7 (from real hours) → emergency-lead; rating ≥4.7 & ≥25 reviews → trust-lead; else local-lead. |
| Trust badges | only verified facts: veteran/women/Black-owned (Google attributes), "Since YYYY" (founded_year), 24/7 (hours), online estimates, service guarantee, rating. Show best 3–4. **"Licensed & Insured" only with a found license number.** Never invent. |
| About copy | "real story" paragraph (enrichment found owner/founded/specialty) → generic-local template (name/city/services slotted in). `copySource` recorded. |
| About image | their team/owner photo → street-view of shop (if presentable) → stock. |
| Services | photo evidence → review mentions (≥2) → category subtypes → pack defaults. Always exactly 6. Emergency + Drain Cleaning sticky. |
| Reviews | render only if rating ≥4.5, count ≥8, ≥3 five-star (see `shouldShowReviews`); best 3–5 picked for specificity; "Read all N on Google" link. Otherwise section omitted, rating may still appear in trust bar. |
| Service area | 6–8 nearest suburbs from per-metro list + anchor city. |
| CTA | quote form (v1) → booking-link deep-link (if they already use one, later). |

## 3. Niche pack (per niche, data not code)

`src/packs/plumber.ts`:
- **Services library** (~18 entries): id, title, icon, 2 copy variants, stock image ref. Plumber v1 list: emergency plumbing, drain cleaning, water heater repair/install, tankless water heaters, leak detection, repiping, sewer line repair, gas line services, toilet repair, faucet & fixture install, garbage disposal, sump pump, water filtration, slab leak repair, hydro jetting, backflow testing, bathroom plumbing remodel, commercial plumbing.
- **Copy templates**: hero headlines (3 flavors), generic about paragraphs (2–3), why-us card library (~10), CTA wording.
- **Stock set**: hero ×3, about ×2, one image per service (see `docs/image-brief.md`).
- **Default theme**: palette + accent (current hydro-navy + brass for plumbers).
- **Section order** incl. any niche-specific sections.
- Intake config already exists separately (`scripts/intake/config/plumber.json`).

## 4. Builder

`scripts/intake/build-site.mts` (stage 9 of intake): prospect row + enrichment + curated photos + pack → applies ladders → writes `site_configs` (slug = kebab name-city, collision-suffixed). Idempotent; re-running upgrades sites as new data lands (enrichment findings automatically flip about copy from generic → real, etc.). Manual config edits are preserved via a `locked_sections` list on the config.

## 5. Current template → target

Existing components (`src/components/site/*`: Hero, About, Services, Reviews, ServiceArea, CtaBand, SiteHeader, SiteFooter) become the v1 variants, refactored to take props from config instead of the monolithic mock `Business`, with a design-quality pass in the process. `src/lib/businesses.ts` (mock) is replaced by a Supabase query.

## 6. Build order

1. Config types + section registry + `/{slug}` reading from Supabase (mock row seeded through the real path).
2. Plumber pack skeleton (services library + copy templates; stock images arrive via image brief).
3. Section components refactored to variants + design pass (generic rungs first — day-one look for 100% of businesses).
4. `build-site.mts` with the ladders above.
5. Generate 5 real Birmingham prospect sites → screenshot → review → iterate.
6. `/admin` prospect browser (list, verdicts, pitch angles, website status, site links).

## Non-goals (v1)

Multiple variants per section, per-site visual editor, custom domains/middleware, non-plumber packs, CMS. All post-first-sale.
