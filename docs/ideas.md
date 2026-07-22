# Future ideas backlog

Not scheduled — parked here so they don't get lost. Pull one in when its moment comes.

- **Screenshot + grade prospect websites** (Playwright is already a dev dep; `_shot.mjs` exists). For `has_website` prospects: capture homepage, agent grades design/mobile/speed/clarity → concrete call ammo ("built in 2011, doesn't work on phones") and a before/after demo asset.
- **Scrape prospect Facebook pages** — for `facebook_only` + enrichment-found pages: recent posts, responsiveness, photos we could reuse (with permission), owner name confirmation.
- **Lead scoring** — deliberately cut from v1 (user wants binary). Revisit after ~50 calls: weight signals by what actually predicted a yes.
- **Rank-comparison pitch page** — we store per-term search rank from the Apify market pull; render "here's where you sit in Birmingham" as a demo screen for calls/follow-up texts.
- **`full_name` columns cross-check** — Outscraper's leads_n_contacts person names (62/236) vs enrichment-scout owner findings; whichever survives the cross-check goes on the call sheet.
- **Street-view fallback imagery** — 217/236 have a street-view URL; possible about-section image when a business has zero photos.
- **Booking-link CTA** — 48 businesses already pay for a booking tool; their generated site's CTA could deep-link into it (also a "they spend money on tools" buyer signal).
- **Email outreach lane** — emails + validity status are stored; a follow-up email with the site link after a no-answer call.
