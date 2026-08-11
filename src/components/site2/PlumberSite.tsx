import type { Business } from "@/lib/types";
import { themeVars } from "@/lib/theme";
import { SiteHeader } from "./SiteHeader";
import { EmergencyStrip } from "./EmergencyStrip";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { Process } from "./Process";
import { Gallery } from "./Gallery";
import { Reviews } from "./Reviews";
import { ServiceArea } from "./ServiceArea";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { SiteFooter } from "./SiteFooter";
import { TextBubble } from "./TextBubble";

/** Composes the full plumber template and applies the business's parametric theme. */
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
