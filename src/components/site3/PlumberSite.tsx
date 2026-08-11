import type { Business } from "@/lib/types";
import { themeVars } from "@/lib/theme";
import { SiteHeader } from "@/components/site2/SiteHeader";
import { EmergencyStrip } from "@/components/site2/EmergencyStrip";
import { Process } from "@/components/site2/Process";
import { Gallery } from "@/components/site2/Gallery";
import { Reviews } from "@/components/site2/Reviews";
import { ServiceArea } from "@/components/site2/ServiceArea";
import { Faq } from "@/components/site2/Faq";
import { CtaBand } from "@/components/site2/CtaBand";
import { SiteFooter } from "@/components/site2/SiteFooter";
import { TextBubble } from "@/components/site2/TextBubble";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";

export function PlumberSite({ business }: { business: Business }) {
  return (
    <div style={themeVars(business.theme)} className="flex min-h-screen flex-col">
      <SiteHeader business={business} />
      <main className="flex-1">
        <Hero business={business} />
        <EmergencyStrip business={business} />
        <About business={business} />
        <Services business={business} />
        <Process business={business} />
        <Gallery business={business} />
        <Reviews business={business} />
        <ServiceArea business={business} />
        <Faq business={business} />
        <CtaBand business={business} />
      </main>
      <SiteFooter business={business} />
      <TextBubble business={business} />
    </div>
  );
}
