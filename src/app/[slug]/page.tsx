import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBusinesses, getBusinessBySlug } from "@/lib/businesses";
import { PlumberSite } from "@/components/site/PlumberSite";
import { PlumberSite as PlumberSiteV2 } from "@/components/site2/PlumberSite";
import { PlumberSite as PlumberSiteV3 } from "@/components/site3/PlumberSite";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBusinesses().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return { title: "Not found" };
  const title = `${business.name} — ${business.niche.charAt(0).toUpperCase() + business.niche.slice(1)} in ${business.city}, ${business.state}`;
  return {
    title,
    description: business.tagline,
    openGraph: {
      title,
      description: business.tagline,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description: business.tagline },
  };
}

/** LocalBusiness structured data — real fields only, nothing invented. */
function jsonLd(b: NonNullable<ReturnType<typeof getBusinessBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: b.name,
    telephone: b.phone,
    description: b.tagline,
    address: b.address
      ? {
          "@type": "PostalAddress",
          streetAddress: b.address,
          addressLocality: b.city,
          addressRegion: b.state,
          addressCountry: "US",
        }
      : undefined,
    geo:
      b.lat != null && b.lng != null
        ? { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng }
        : undefined,
    areaServed: b.serviceAreas.map((a) => ({ "@type": "City", name: a })),
    aggregateRating:
      b.rating && b.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: b.rating,
            reviewCount: b.reviewCount,
          }
        : undefined,
    url: b.website,
    email: b.email,
  };
}

export default async function BusinessPage({ params }: Params) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(business)) }}
      />
      {business.template === "v3" ? (
        <PlumberSiteV3 business={business} />
      ) : business.template === "v2" ? (
        <PlumberSiteV2 business={business} />
      ) : (
        <PlumberSite business={business} />
      )}
    </>
  );
}
