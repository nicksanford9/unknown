// Core data model. Everything the template renders comes from a Business.
// This shape is what we normalize Apify's Google Maps output into and store in the DB.

export type Theme = {
  /** Primary brand color — from the logo if we have one, else the default hydro-navy. */
  brand: string;
  /** Darker brand shade for text-on-tint, hovers. */
  brandDark: string;
  /** Very light brand tint for section backgrounds. */
  brandTint: string;
  /** Warm craft accent (brass). Used for small marks, underlines, spec ticks. */
  accent: string;
};

export type Review = {
  author: string;
  rating: number; // 1..5
  text: string;
  /** ISO date or human "3 weeks ago". */
  date?: string;
};

export type Service = {
  /** lucide-react icon name, resolved in the Services component. */
  icon: string;
  title: string;
  description: string;
};

export type Hours = {
  /** e.g. "Mon–Fri". */
  days: string;
  /** e.g. "7:00 AM – 6:00 PM" or "24/7". */
  hours: string;
};

export type Business = {
  slug: string;
  name: string;
  niche: string; // "plumber" for now
  /** One-line what-they-do, niche-specific. */
  tagline: string;

  // Location
  city: string;
  state: string; // "AL"
  /** Neighborhoods / nearby cities we serve. */
  serviceAreas: string[];
  address?: string;

  // Contact
  phone: string;
  /** Their existing site — where "read more reviews" and the domain link point. */
  website?: string;
  email?: string;

  // Brand
  logoUrl?: string;
  theme: Theme;
  heroImageUrl: string;
  /** True when heroImageUrl is a real photo of theirs (not the shared stock image). */
  heroIsReal?: boolean;

  // Trust signals
  rating?: number; // e.g. 4.9
  reviewCount?: number;
  yearsInBusiness?: number;
  licensed?: boolean;
  emergency247?: boolean;

  // Content
  about: string;
  services: Service[];
  reviews: Review[];
  hours: Hours[];
};

/** Reviews only render when the business clears these bars — protects the sale from thin/low social proof. */
export const REVIEW_MIN_RATING = 4.5;
export const REVIEW_MIN_COUNT = 8;

export function shouldShowReviews(b: Business): boolean {
  const fiveStar = b.reviews.filter((r) => r.rating >= 5);
  return (
    (b.rating ?? 0) >= REVIEW_MIN_RATING &&
    (b.reviewCount ?? 0) >= REVIEW_MIN_COUNT &&
    fiveStar.length >= 3
  );
}
