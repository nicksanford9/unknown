import { ImageResponse } from "next/og";
import { getBusinessBySlug } from "@/lib/businesses";
import { DEFAULT_THEME } from "@/lib/theme";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Business card preview";

/** Link-preview card — what a prospect sees when the demo URL is texted to them. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBusinessBySlug(slug);
  const theme = b?.theme ?? DEFAULT_THEME;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(160deg, ${theme.brandDark} 0%, ${theme.brand} 100%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 88,
            height: 6,
            background: theme.accent,
            marginBottom: 42,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, textAlign: "center", maxWidth: 1000 }}>
          {b?.name ?? "Your new website"}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 32, marginTop: 24, opacity: 0.85 }}>
          {b ? `${b.city}, ${b.state}` : ""}
          {b?.rating ? ` · ${b.rating.toFixed(1)} stars (${b.reviewCount} reviews)` : ""}
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 40, color: theme.accent, fontWeight: 700 }}>
          {b?.phone ?? ""}
        </div>
      </div>
    ),
    size,
  );
}
