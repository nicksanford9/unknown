# Project Review Notes — 2026-07-23

## Overall assessment

The direction is strong. The core product loop, evidence-based site generation, and config-driven rendering system all make sense together.

The biggest opportunity now is to complete one trustworthy, measurable vertical slice before expanding the feature set:

```text
Raw prospect data
  → validated site config
  → private prospect demo
  → working lead form
  → owner notification
  → conversion tracking
```

This would test the central business promise and expose the important operational problems before building the broader Atlas Local platform.

---

## Highest-priority changes

### 1. Keep prospect demos private until approved

Generated pages that resemble a real business could create trust, trademark, incorrect-information, and search-indexing problems.

Recommended behavior:

- Default every generated site to `published = false`.
- Add `noindex` metadata to all unapproved demos.
- Use authenticated access or an unguessable preview URL.
- Publish only after the business approves its information and use of its identity.
- Protect the internal site directory or exclude it from production.
- Visibly label previews as drafts where appropriate.

The internal directory currently lives at `src/app/page.tsx` and should not remain publicly discoverable in a production deployment.

### 2. Create one evidence-backed claim model

The written plans correctly say not to fabricate facts, but the rendering model does not yet enforce that rule.

For example, `licensed?: boolean` currently becomes “Licensed & Insured.” A license does not establish insurance. Other potentially unsupported promises include:

- “Usually same-day.”
- “We’ll get right back to you.”
- “Hot water back on the same visit.”
- “We answer 24/7 and get to you fast.”
- “No upsells, no surprises.”
- “Family-owned.”

These are fine for the fictional demo but must not leak into generated real-business pages without evidence.

Instead of scattered booleans, use an explicit claim structure:

```ts
type VerifiedClaim = {
  kind:
    | "license"
    | "insurance"
    | "founded-year"
    | "emergency-hours"
    | "ownership-attribute"
    | "service-guarantee"
    | "same-day-service";
  value: string;
  displayText: string;
  source: string;
  verifiedAt: string;
  confidence: "high" | "medium" | "low";
};
```

Rendering components should only display claims that pass the relevant evidence and confidence rules. AI-written copy should also be checked against the same allowed-claims collection.

This is more than a safety feature: provenance can become an internal differentiator because every generated claim is traceable.

### 3. Build a real conversion path next

The current “Request a Free Quote” action opens an email client. When a business has no email, it produces an empty `mailto:` link. This does not yet fulfill the product promise of a basic contact form and lead notifications.

The next vertical slice should be:

```text
Form submission
  → server-side validation
  → spam protection and rate limiting
  → stored lead
  → owner notification
  → delivery status
  → conversion event
```

Important form fields for V1:

- Name.
- Phone.
- Email, optional if phone is supplied.
- Requested service.
- ZIP code or service address.
- Short message.
- Contact preference.
- Consent language and recorded consent metadata if SMS follow-up is possible.

The form should have clear pending, success, validation-error, and delivery-failure states. Do not imply a response time unless the business has explicitly committed to one.

### 4. Resolve data and rendering mismatches

Several fields or rules in the written system do not yet match the current components:

- `logoUrl` exists but the header and footer always render a generated initial.
- “Read all reviews” points to `website`, not the stored Google `reviews_link`.
- The header always shows a Reviews link even when the review-quality gate suppresses that section.
- Review dates are collected but not displayed.
- `yearsInBusiness` is converted back into a founding year, which can drift or become off by one. Store `foundedYear` and calculate display text from it.
- “137+ neighbors” should say something factual such as “137 Google reviews.” Reviewers are not necessarily neighbors.
- The service-area section claims “usually same-day” without a supporting field.
- CTA content is hard-coded to plumbing instead of coming through the site configuration or niche pack.
- The renderer is still a monolithic `Business` template rather than the documented ordered section configuration and registry.
- The database has `published`, but the current mock renderer does not demonstrate publication enforcement.

### 5. Add runtime validation between JSON and React

TypeScript cannot validate `site_configs.config` after JSON is loaded from a database. Add a runtime schema at the storage/rendering boundary.

Validation should cover:

- Required business identity and contact fields.
- URLs and allowed URL protocols.
- Valid colors and contrast requirements.
- Known section and variant names.
- Valid icon identifiers.
- Ratings and review counts.
- Section-specific props.
- Limits on text and list lengths.
- Verified claims and provenance.
- Whether an unpublished config can be rendered publicly.

Invalid configurations should fail safely with an internal diagnostic, not produce a partially broken public page.

Unknown variants should be rejected during site generation and deployment checks, as the site-system specification already proposes.

### 6. Harden the database schema before it becomes authoritative

The schema is a good start, but it currently relies heavily on comments rather than database constraints.

Add constraints or lookup tables for:

- Prospect statuses.
- Qualification verdicts.
- `decided_by` values.
- Pitch angles.
- Phone types.
- Owner-name confidence.
- Ratings between 1 and 5.
- Photo-quality ranges.
- Review-quality ranges.
- Nonnegative counts.

Also add:

- Row-level security separating public published configs from private prospect and enrichment information.
- A status/activity history table instead of only mutating the current prospect status.
- Per-field or per-section provenance.
- `locked_sections`, as promised by the site-system plan.
- A safe migration system rather than treating one schema file as the long-term deployment mechanism.
- Explicit ownership and access rules for scraped PII.
- Retention/deletion policies for contacts who request removal.

The `updated_at` values also need triggers or application logic; their defaults only populate the initial insert.

### 7. Reduce the first paid-product scope

The proposed $297 plan currently contains several substantial products:

- Reputation management.
- SMS compliance and delivery infrastructure.
- Call tracking and forwarding.
- A lead inbox/CRM.
- Google Business Profile management.
- Content generation and publishing.
- Website analytics.
- Monthly reporting.
- An AI assistant.

Each can be valuable, but together they create a large integration, support, and compliance surface before the sales motion is proven.

A tighter first paid promise could be:

```text
Website leads + missed-call recovery + review requests
                 ↓
      One inbox and one outcome report
```

An even narrower initial version may be appropriate if A2P registration makes missed-call texting slow to launch:

```text
Website lead capture + review requests + response tracking
```

Start the Google API approval process early, but do not make the first sale depend on it.

---

## Product and sales ideas

### Prospect comparison page

Wrap each generated site in a private sales view that shows:

- Current online presence.
- Proposed site.
- Three specific, verified improvements.
- One clear action to claim or approve it.

Avoid generic automated grades. Concrete evidence is stronger: broken link, missing mobile CTA, no analytics, expired certificate, incomplete hours, or no working contact path.

### Demo engagement signals

Track:

- First and most recent demo view.
- Repeat visits.
- Sections viewed.
- CTA clicks.
- Correction/approval form starts.
- Sharing with another person.

A prospect who revisits or forwards the demo should move up the call queue. Tracking must be disclosed and should avoid unnecessary fingerprinting.

### Correction and approval workflow

Turn the demo into a collaboration prompt:

> Is this phone number, service area, availability, and service list correct?

This creates engagement while improving source data. The owner could:

- Confirm business details.
- Correct services and hours.
- Approve specific photos.
- Provide a logo.
- Approve or reject claims.
- Request publication.

### Separate demo truth from marketing polish

Each section should record content provenance such as:

- `verified-business-data`
- `google-profile`
- `business-provided`
- `review-derived`
- `generic-niche-copy`
- `stock-image`
- `business-image`

The internal preview could show these labels while the finished public page remains clean.

### Test two sales messages

Test at least these two openers in the first 20–30 conversations:

1. “We already built you a better website.”
2. “We help make sure missed callers and website leads get a response.”

The website may be a strong attention-getter, while lead recovery may be the stronger recurring value proposition. Track actual outcomes rather than choosing only on intuition.

### Define “free website” precisely

Document what the free tier includes:

- Hosting duration.
- Included edits.
- Form-submission limits.
- Notification method.
- Storage and bandwidth limits.
- Support response expectations.
- Custom-domain handling and renewals.
- Data export.
- What happens if Atlas Local closes.
- What changes if a customer cancels the paid product.

An undefined free offer can become an indefinite support liability.

### Assisted onboarding first

Design for personally onboarding the first ten customers. Record every confusing step and repeated request. Automate the proven repetition afterward.

This is especially important for:

- Domain configuration.
- Call forwarding.
- A2P registration.
- Google authorization.
- Consent-language approval.
- Business-hours and holiday-hours confirmation.

---

## UX and frontend observations

### Strengths

- The overall visual system has a clear point of view rather than looking like a generic theme.
- The type roles, restrained palette, spacing, and trust-data treatment are coherent.
- Reduced-motion handling is present.
- The template has sensible content-quality gates for reviews.
- The call action is prominent.
- Components are reasonably small and understandable.
- Per-business theme variables are a good foundation.

### Improvements

- Render a real logo when approved and available.
- Generate navigation from the sections that actually render.
- Add `aria-expanded` and `aria-controls` to the mobile menu button.
- Close the menu on Escape and consider focus behavior while it is open.
- Add scroll margin to anchored sections so the fixed header does not obscure headings.
- Avoid making non-interactive service-area pills appear interactive on hover.
- Add a visible mobile call/quote action after the user scrolls past the hero, then test whether it helps rather than assuming it does.
- Ensure all theme combinations meet text and focus contrast requirements.
- Do not use the accent color for body-sized text until contrast has been validated.
- Add custom not-found and global error experiences before production.
- Consider whether extensive reveal animations help a lead-generation page; the visual benefit should justify the client-side JavaScript.

### Images and performance

The hero currently uses a remote Unsplash URL as a CSS background. This:

- Bypasses Next image optimization.
- Creates a third-party hotlink dependency.
- Makes sizing and responsive delivery less controlled.
- Can delay the largest visual element.
- Complicates long-term licensing records.

Recommended approach:

- Store approved stock and business assets in controlled storage.
- Keep source, license, attribution requirements, and approval status with each asset.
- Generate appropriately sized variants.
- Use the Next image component where practical.
- Preload only the actual above-the-fold image.
- Provide stable fallbacks if an asset fails.

---

## SEO and metadata

Dynamic title and description generation is already present, which is a good start.

Before approved sites are public, add:

- `noindex` for all private demos and the internal index.
- Canonical URLs for published custom domains.
- Per-site Open Graph images.
- Business-specific social metadata.
- Sitemap inclusion only for published sites.
- Robots behavior that cannot accidentally expose previews.
- Structured local-business data only from verified facts.

Do not publish structured data containing generated or inferred information. Address, hours, service area, phone, rating, and review data should all be verified and current.

One architectural question is important: when a site uses a customer’s custom domain, metadata and canonical URLs must be derived from the request/domain mapping rather than the Atlas Local preview URL.

---

## Intake-pipeline observations

### What is working conceptually

- Raw data is retained and derived states are auditable.
- Outscraper and Apify have clearly separated roles.
- Qualification is intentionally binary at first instead of using an invented score.
- Ambiguous classifications go through explicit adjudication.
- The planned data ladders prevent low-quality inputs from producing broken sections.
- The review gate is sensible.
- The division between a reusable niche pack and per-site config should scale better than forked templates.

### Changes to consider

- Treat `unknown` phone type as unknown, not semantically mobile. It can still be callable under a separate policy flag.
- Keep `callable` as an operational decision derived from phone type, consent/policy, and campaign rules.
- Record the exact source and timestamp for every enriched fact.
- Store source URLs rather than only free-text evidence.
- Add retry state, error state, and run IDs to each pipeline stage.
- Make every stage produce a count summary: read, inserted, updated, skipped, rejected, ambiguous, and failed.
- Add dry-run support before database writes.
- Add fixture-based tests using a small sanitized data sample.
- Add a generated-config validation step before setting `site_ready`.
- Preserve manual changes at field or section level, not merely through a broad site lock.
- Define how stale facts are refreshed and when previously generated sites are rebuilt.
- Ensure scraped contact information never enters public site configs accidentally.

### Deep-scrape recommendation

Start with callable qualified prospects rather than every qualified business. Expand after measuring:

- Cost per site-ready prospect.
- Percentage with usable photos.
- Percentage with usable review copy.
- Effect of personalization on demos viewed and calls converted.

Market-wide competitors can still remain in the lighter dataset for ranking comparisons.

---

## Compliance and operational risks

These are product-design inputs, not details to defer until launch.

### Messaging

- Do not activate automated SMS before registration and consent requirements are satisfied.
- Store consent source, timestamp, disclosure version, and the action that produced consent.
- Implement STOP and HELP centrally.
- Maintain account-level and global suppression.
- Set quiet hours by recipient timezone.
- Avoid treating a general website inquiry as consent for unrelated marketing.
- Decide what happens to the provisioned number and conversation history when a customer leaves.

### Reviews

- Never gate public review requests based on satisfaction.
- Do not offer review incentives.
- Send the same honest-review opportunity to all qualifying customers.
- Make private feedback available without hiding the public-review option.
- Confirm that the intended use of scraped review text and customer photos is permitted under provider terms and applicable platform policies before displaying it publicly.

### Prospect outreach and scraped data

- Define suppression and do-not-contact handling.
- Keep the source and collection date for contact data.
- Avoid exposing enrichment notes or owner-name guesses publicly.
- Use an owner name in outreach only at a sufficiently high confidence level.
- Establish a process for correction and deletion requests.

### Claims about Google visibility

Keep the current prohibition on guaranteed rankings. Reports should separate direct measurements from estimates and inferred opportunities.

---

## Architecture recommendations

### Preserve the config-driven destination

The written site-system specification is better than the current monolithic `Business` object. Continue toward:

```ts
type SiteConfig = {
  schemaVersion: number;
  business: BusinessIdentity;
  sections: SiteSection[];
  claims: VerifiedClaim[];
  assets: SiteAsset[];
  publication: PublicationState;
};
```

Useful characteristics:

- Discriminated unions for section props.
- An explicit registry of supported section/variant pairs.
- A schema version and migrations for stored configs.
- A build record describing what data produced the config.
- Provenance and lock state for generated content.
- No direct passage of raw database rows into client components.

### Minimize client boundaries

Most of the site can remain server-rendered. Keep client components limited to interactions such as:

- Mobile navigation.
- Forms.
- Optional carousel behavior.
- Carefully justified animation.

Avoid making the entire renderer a client component as configuration complexity grows.

### Add automated quality gates

Before marking a prospect site ready:

1. Validate its configuration.
2. Render it.
3. Confirm required links and anchors.
4. Check for unsupported claims.
5. Check image availability.
6. Run accessibility checks.
7. Capture desktop and mobile screenshots.
8. Flag excessive text wrapping or overflow.
9. Confirm it is private/noindex.
10. Record the result against the build run.

---

## Current technical health

### Lint

`pnpm lint` currently fails with four `@typescript-eslint/no-explicit-any` errors:

- `scripts/intake/check-websites.mts`: one error.
- `scripts/intake/load-raw.mts`: two errors.
- `scripts/intake/qualify.mts`: one error.

These are straightforward, but lint should be green before using it as a pipeline gate.

### Build

The initial production build began but did not return a final result during the review. A later attempt reported that another Next build was already running, even though no matching process was subsequently visible. This appears to have left or encountered a build lock.

A clean production build still needs to be confirmed.

### Visual verification

The workspace sandbox prohibited binding the development server to `0.0.0.0:3000`, so a fresh desktop/mobile browser review could not be completed during this pass.

### Existing working-tree changes

The following pre-existing modifications were observed and intentionally left untouched:

- `.claude/skills/intake-market/SKILL.md`
- `_shot.mjs`

---

## Suggested implementation order

1. Decide preview privacy, approval, and publication rules.
2. Define the validated `SiteConfig` and verified-claim models.
3. Add runtime schema validation.
4. Refactor navigation and sections to use the section registry.
5. Implement a working lead form and notification path.
6. Add publication enforcement and `noindex` behavior.
7. Feed one real prospect through the complete path.
8. Add automated desktop/mobile screenshots and quality checks.
9. Run five Birmingham prospects through the pipeline.
10. Conduct the first sales calls and record objections/outcomes.
11. Choose the narrow paid-product wedge using those results.
12. Build the smallest retention loop customers demonstrated they value.

---

## Decisions and questions to resolve

### Publication and ownership

1. Are prospect demos strictly private until owner approval?
2. What approval is required before using a business name, logo, photos, and reviews?
3. Who owns the generated website and its content?
4. What happens to the site if the customer cancels or Atlas Local stops operating?
5. Will custom-domain customers control their registrar account directly?

### Free tier

6. What exactly is included for free?
7. How many edits, leads, notifications, and assets are included?
8. Is support included, and at what response level?
9. Can Atlas Local place modest attribution on free sites?
10. Is the free website permanent, or conditional on reasonable use?

### Paid product

11. What is the first paid promise: more reviews, recovered calls, faster lead response, or Google visibility?
12. Which single metric will demonstrate value during the first month?
13. Which features are required for the first three paying customers?
14. Which planned features can wait until customers explicitly request them?

### Calls and messaging

15. Who owns and controls a provisioned phone number?
16. Can customers port the number away when they leave?
17. How will call forwarding be tested during onboarding?
18. What is the fallback while A2P registration is pending?
19. Who responds when automation fails or sends an incorrect message?

### Intake and sales

20. Should the first call batch mix no-website and weak-website prospects?
21. What constitutes a successful first batch: conversations, demos viewed, appointments, or paid conversions?
22. Will the first ten customers receive fully assisted onboarding?
23. How will objections and call outcomes feed back into qualification and site generation?

### Data and content

24. Are provider terms compatible with the planned public use of scraped reviews and photos?
25. How long may prospect enrichment and contact data be retained?
26. What confidence threshold permits a fact to appear publicly?
27. Who approves stock-photo licensing and maintains the asset record?
28. How frequently are hours, ratings, reviews, and business status refreshed?

---

## Recommended immediate milestone

Complete one real Birmingham prospect end to end:

```text
Source data
  → qualification
  → enrichment with provenance
  → curated approved assets
  → validated site configuration
  → private/noindex preview
  → correction and approval
  → working form submission
  → stored lead and notification
  → tracked demo and conversion events
```

Do this before adding multiple visual variants, a large admin interface, full Google management, or a generalized AI assistant. One complete and trustworthy loop will provide more useful information than several partially implemented product surfaces.
