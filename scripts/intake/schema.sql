-- Intake pipeline schema (docs/intake-pipeline.md §2). Idempotent.

create table if not exists places (
  place_id     text primary key,
  name         text not null,
  niche        text not null,            -- 'plumber'
  market       text not null,            -- 'birmingham-al'
  city         text,
  state        text,
  address      text,
  phone        text,
  phone_type   text,                     -- 'mobile'|'landline'|'fixed_line'|'voip'|'toll_free'|'unknown'
  website      text,
  facebook     text,
  instagram    text,
  email        text,
  category     text,                     -- primary type
  subtypes     text[],
  lat          double precision,
  lng          double precision,
  rating       numeric,
  review_count int,
  photo_count  int,
  reviews_link text,
  logo_url     text,
  verified     boolean,
  is_chain     boolean,
  founded_year int,
  business_status text,
  search_rank  jsonb,                    -- {"plumber": 4, ...} from Apify market pull
  attributes   jsonb,                    -- flattened `about` truths: {"Identifies as veteran-owned": true, "Online estimates": true, ...}
  hours        jsonb,                    -- {"Monday": ["8AM-5PM"], ...}
  open_24_7    boolean,
  booking_link text,
  street_view_url text,
  email_status text,                     -- Outscraper emails_validator verdict
  website_status text,                   -- 'up' | 'down:<code>' | 'error:<kind>' from check-websites
  website_checked_at timestamptz,
  outscraper_raw jsonb,
  apify_raw    jsonb,
  first_seen   timestamptz not null default now(),
  last_seen    timestamptz not null default now()
);

create table if not exists place_qualification (
  place_id     text primary key references places,
  verdict      text not null,            -- 'qualified' | 'rejected' | 'ambiguous'
  callable     boolean,                  -- mobile/unknown phone → true
  pitch_angle  text,                     -- 'no_website' | 'has_website'
  reject_reason text,
  decided_by   text not null,            -- 'script' | 'agent' | 'human'
  notes        text,
  decided_at   timestamptz not null default now()
);

create table if not exists prospects (
  place_id     text primary key references places,
  status       text not null default 'qualified',
  -- qualified → site_ready → call_queue → contacted → interested → demo_viewed
  -- → domain_paid → onboarding → active_client | not_interested | dead
  followup_at  timestamptz,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists enrichment (
  place_id     text primary key references places,
  found_facebook text,
  facebook_active boolean,
  owner_name   text,
  owner_name_confidence text,            -- 'high'|'medium'|'low'
  owner_name_evidence text,
  license_number text,
  years_in_business int,
  services_mentioned text[],
  special_notes text,
  searched_at  timestamptz not null default now()
);

create table if not exists place_reviews (
  place_id     text not null references places,
  review_id    text not null,
  author       text,
  rating       int,
  text         text,
  published_at text,                     -- Google's relative or ISO date, as scraped
  owner_response text,
  raw          jsonb,
  primary key (place_id, review_id)
);

create table if not exists place_photos (
  place_id     text not null references places,
  photo_url    text not null,
  storage_path text,
  label        text,                     -- photo-curator: 'job_work'|'truck_van'|'team_owner'|...
  quality_score int,
  service_hint text,
  primary key (place_id, photo_url)
);

create table if not exists site_configs (
  slug         text primary key,
  place_id     text unique references places,
  config       jsonb not null,           -- the Business shape the template renders
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_places_market on places (market, niche);
create index if not exists idx_prospects_status on prospects (status);
