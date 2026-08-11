import type { Business } from "./types";
import { DEFAULT_THEME } from "./theme";

// Mock source of truth for now. Swaps to a Supabase query later — the template never changes.

const BUSINESSES: Business[] = [
  {
    slug: "birmingham-plumbing-demo",
    name: "Vulcan City Plumbing",
    niche: "plumber",
    tagline: "Fast, honest plumbing done right the first time.",

    city: "Birmingham",
    state: "AL",
    serviceAreas: [
      "Birmingham",
      "Hoover",
      "Vestavia Hills",
      "Homewood",
      "Mountain Brook",
      "Trussville",
      "Bessemer",
      "Pelham",
    ],
    address: "2200 1st Ave N, Birmingham, AL 35203",

    phone: "(205) 555-0142",
    website: "https://example.com",
    email: "service@vulcancityplumbing.com",

    logoUrl: undefined, // no logo → name-as-logo + default theme
    theme: DEFAULT_THEME,
    heroImageUrl:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=2000&q=80",
    heroIsReal: false,

    rating: 4.9,
    reviewCount: 137,
    yearsInBusiness: 18,
    licensed: true,
    emergency247: true,

    lat: 33.5186,
    lng: -86.8104,

    gallery: [
      {
        url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
        label: "Water heater installation",
      },
      {
        url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
        label: "Leak detection & repair",
      },
      {
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
        label: "Fixture upgrades",
      },
      {
        url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
        label: "Repiping",
      },
      {
        url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
        label: "Bathroom plumbing",
      },
      {
        url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
        label: "Emergency repairs",
      },
    ],

    about:
      "Vulcan City Plumbing has kept Birmingham homes running since 2007. We're a family-owned team of licensed plumbers who show up on time, quote before we work, and treat your home like our own. From a leaky faucet to a full repipe, we do it right the first time — no upsells, no surprises.",

    services: [
      {
        icon: "Droplets",
        title: "Leak Detection & Repair",
        description:
          "We find hidden leaks fast with modern tools and fix them before they damage your home.",
      },
      {
        icon: "ShowerHead",
        title: "Drain Cleaning",
        description:
          "Slow or clogged drains cleared the same day, plus camera inspection so it stays clear.",
      },
      {
        icon: "Flame",
        title: "Water Heater Service",
        description:
          "Repair, replacement, and tankless upgrades — hot water back on the same visit.",
      },
      {
        icon: "Wrench",
        title: "Repiping & Fixtures",
        description:
          "Old pipes and fixtures swapped for reliable, code-compliant plumbing that lasts.",
      },
      {
        icon: "ShieldAlert",
        title: "Emergency Plumbing",
        description:
          "Burst pipe or backup at 2am? We answer 24/7 and get to you fast to stop the damage.",
      },
      {
        icon: "Home",
        title: "Sewer & Repair",
        description:
          "Trenchless sewer repair and full line replacement done cleanly, with minimal digging.",
      },
    ],

    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        text: "Called at 7am with water everywhere. They were at my house within the hour, found the burst line, and had it fixed before lunch. Fair price and no mess left behind.",
        date: "2 weeks ago",
      },
      {
        author: "Danielle R.",
        rating: 5,
        text: "Replaced our water heater same day and walked me through every option first. Honest, clean, and genuinely kind. This is who we call now.",
        date: "1 month ago",
      },
      {
        author: "The Whitfields",
        rating: 5,
        text: "Quoted us before doing a single thing and stuck to it exactly. Fixed a slab leak two other companies wanted to charge triple for. Cannot recommend enough.",
        date: "1 month ago",
      },
      {
        author: "Sam K.",
        rating: 5,
        text: "Professional from the first call. Showed up on time, wore boot covers, and fixed our main line right. Rare to find this kind of service anymore.",
        date: "2 months ago",
      },
      {
        author: "Angela P.",
        rating: 4,
        text: "Good work on our drains. Took a little longer than expected but the result has held up great.",
        date: "3 months ago",
      },
    ],

    hours: [
      { days: "Mon – Fri", hours: "7:00 AM – 6:00 PM" },
      { days: "Saturday", hours: "8:00 AM – 2:00 PM" },
      { days: "Emergencies", hours: "24/7" },
    ],
  },
];

// v2 comparison demo — same business, rewritten copy, rendered by the site2 template.
BUSINESSES.push({
  ...BUSINESSES[0],
  slug: "birmingham-plumbing-demo2",
  template: "v2",
  tagline: "On time, up front, and fixed for good.",
  about:
    "When a pipe lets go at midnight, you don't want a call center — you want a plumber who picks up. Vulcan City Plumbing has been answering Birmingham's calls since 2007: family-owned, licensed, and honest about the price before we touch a wrench. We quote it straight, fix it right, and clean up like we were never there.",
});

// Focused content/design comparison: homeowner-first proof and service photography.
BUSINESSES.push({
  ...BUSINESSES[0],
  slug: "birmingham-plumbing-demo1",
  template: "v3",
  tagline:
    "Clear options before the work starts. Careful repairs that hold up after we leave.",
  about:
    "Plumbing trouble already disrupts your day. Getting it fixed shouldn't add more uncertainty. Vulcan City Plumbing gives Birmingham homeowners a clear diagnosis, practical repair options, and the price before work begins. We protect the work area, explain what we found in plain English, and test the repair before we pack up.",
  services: [
    {
      icon: "Droplets",
      title: "Leak Detection & Repair",
      description:
        "We trace the source instead of guessing, explain what failed, and repair the problem with as little disruption to your home as possible.",
    },
    {
      icon: "ShowerHead",
      title: "Drain Cleaning",
      description:
        "We clear stubborn kitchen, bath, and main-line clogs, then check what caused the blockage so you know the next sensible step.",
    },
    {
      icon: "Flame",
      title: "Water Heater Service",
      description:
        "No hot water, strange noises, or a leaking tank? We assess the system and compare repair and replacement options without pressure.",
    },
    {
      icon: "Wrench",
      title: "Repiping & Fixtures",
      description:
        "From one worn fixture to aging supply lines, we plan clean, code-conscious upgrades around your home and budget.",
    },
    {
      icon: "ShieldAlert",
      title: "Emergency Plumbing",
      description:
        "When water cannot wait, call any time. We help you limit the damage and dispatch the right response for the problem.",
    },
    {
      icon: "Home",
      title: "Sewer Line Repair",
      description:
        "We diagnose backups and damaged lines, show you what we found, and walk through repair choices before excavation begins.",
    },
  ],
});

export function getBusinessBySlug(slug: string): Business | undefined {
  return BUSINESSES.find((b) => b.slug === slug);
}

export function getAllBusinesses(): Business[] {
  return BUSINESSES;
}
