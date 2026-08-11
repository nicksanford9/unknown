import type { Theme } from "./types";

/** Default "water & brass" theme — used when a business has no usable logo color. */
export const DEFAULT_THEME: Theme = {
  brand: "#0A3049", // deep hydro-navy (water)
  brandDark: "#06212F",
  brandTint: "#EAF1F5",
  accent: "#B5813E", // refined brass (pipe fittings, the craft)
};

// ---------------------------------------------------------------------------
// Contrast math (WCAG relative luminance). Business themes come from scraped
// logos, so nothing about a color can be assumed — every text-on-color pair
// is computed, never hardcoded, or a white logo would give white-on-white.
// ---------------------------------------------------------------------------

const INK = "#131719"; // near-black used when dark text reads better

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** White or near-black — whichever reads better on the given background. */
export function readableOn(bg: string): string {
  return contrast(bg, "#FFFFFF") >= contrast(bg, INK) ? "#FFFFFF" : INK;
}

/** Mix a color toward white (amt 0..1). */
function lighten(hex: string, amt: number): string {
  const rgb = hexToRgb(hex).map((v) => v + (255 - v) * amt) as [number, number, number];
  return rgbToHex(rgb);
}

/** Mix a color toward near-black (amt 0..1). */
function darken(hex: string, amt: number): string {
  const ink = hexToRgb(INK);
  const rgb = hexToRgb(hex).map((v, i) => v + (ink[i] - v) * amt) as [number, number, number];
  return rgbToHex(rgb);
}

/** Accent used as text/icons on white or near-white sections — darken until it reads. */
function accentForLightBg(accent: string): string {
  let c = accent;
  for (let i = 0; i < 8 && contrast(c, "#FFFFFF") < 3; i++) c = darken(c, 0.18);
  return c;
}

/**
 * Accent used AS TEXT on the dark brand background (e.g. the city in the
 * headline). If the logo's accent is too dark to read there, step it lighter
 * until it clears 3:1; give up into white if the color just can't get there.
 */
function accentForDarkBg(accent: string, darkBg: string): string {
  let c = accent;
  for (let i = 0; i < 8 && contrast(c, darkBg) < 3; i++) c = lighten(c, 0.18);
  return contrast(c, darkBg) >= 3 ? c : "#FFFFFF";
}

/** Turn a theme into the CSS custom properties the template reads. Spread onto a wrapper's style. */
export function themeVars(theme: Theme): React.CSSProperties {
  return {
    ["--brand" as string]: theme.brand,
    ["--brand-dark" as string]: theme.brandDark,
    ["--brand-tint" as string]: theme.brandTint,
    ["--accent" as string]: theme.accent,
    // Derived, contrast-safe pairs — components use these instead of guessing:
    ["--on-accent" as string]: readableOn(theme.accent),
    ["--on-brand" as string]: readableOn(theme.brand),
    ["--on-brand-dark" as string]: readableOn(theme.brandDark),
    ["--accent-text" as string]: accentForDarkBg(theme.accent, theme.brandDark),
    ["--accent-ink" as string]: accentForLightBg(theme.accent),
  };
}
