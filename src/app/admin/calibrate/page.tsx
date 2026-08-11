import { sql } from "@/lib/server-db";
import { CalibrationTable, type Lead } from "@/components/admin/CalibrationTable";

export const dynamic = "force-dynamic";

export const metadata = { title: "Lead calibration — Atlas Local" };

export default async function CalibratePage() {
  const rows = await sql`
    select p.place_id, p.name, p.city, p.phone, p.phone_type, p.website,
           p.website_status, p.rating, p.review_count, p.photo_count,
           p.reviews_link, p.category, p.is_chain,
           q.verdict as pipeline_verdict, q.pitch_angle, q.reject_reason,
           h.tier, h.voice_note
    from places p
    left join place_qualification q using (place_id)
    left join human_calibration h using (place_id)
    where p.market = 'birmingham-al'
    order by (q.verdict = 'qualified') desc nulls last,
             (p.phone_type = 'mobile') desc nulls last,
             p.review_count asc nulls first`;

  const leads: Lead[] = rows.map((r) => ({
    placeId: r.place_id,
    name: r.name,
    city: r.city,
    phone: r.phone,
    phoneType: r.phone_type,
    website: r.website,
    websiteStatus: r.website_status,
    rating: r.rating === null ? null : Number(r.rating),
    reviewCount: r.review_count,
    photoCount: r.photo_count,
    reviewsLink: r.reviews_link,
    category: r.category,
    isChain: r.is_chain,
    pipelineVerdict: r.pipeline_verdict,
    pitchAngle: r.pitch_angle,
    rejectReason: r.reject_reason,
    tier: r.tier,
    voiceNote: r.voice_note,
  }));

  return <CalibrationTable initialLeads={leads} />;
}
