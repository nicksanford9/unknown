import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBusinesses, getBusinessBySlug } from "@/lib/businesses";
import { PlumberSite } from "@/components/site/PlumberSite";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBusinesses().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return { title: "Not found" };
  return {
    title: `${business.name} — ${business.niche}s in ${business.city}, ${business.state}`,
    description: business.tagline,
  };
}

export default async function BusinessPage({ params }: Params) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();
  return <PlumberSite business={business} />;
}
