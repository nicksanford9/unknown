/** Shared pipeline helpers (importable without side effects). */

export const CALLABLE_TYPES = new Set(["mobile", "unknown"]);

/** A Facebook/Instagram URL in the website field means no real site — the strongest lead profile. */
export function pitchAngle(website: string | null): string {
  if (!website) return "no_website";
  return /facebook\.com|fb\.com|instagram\.com/i.test(website) ? "facebook_only" : "has_website";
}
