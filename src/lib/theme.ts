import type { Theme } from "./types";

/** Default "water & brass" theme — used when a business has no usable logo color. */
export const DEFAULT_THEME: Theme = {
  brand: "#0A3049", // deep hydro-navy (water)
  brandDark: "#06212F",
  brandTint: "#EAF1F5",
  accent: "#B5813E", // refined brass (pipe fittings, the craft)
};

/** Turn a theme into the CSS custom properties the template reads. Spread onto a wrapper's style. */
export function themeVars(theme: Theme): React.CSSProperties {
  return {
    ["--brand" as string]: theme.brand,
    ["--brand-dark" as string]: theme.brandDark,
    ["--brand-tint" as string]: theme.brandTint,
    ["--accent" as string]: theme.accent,
  };
}
