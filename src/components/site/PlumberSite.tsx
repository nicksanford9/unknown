import type { Business } from "@/lib/types";
import { themeVars } from "@/lib/theme";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { Reviews } from "./Reviews";
import { ServiceArea } from "./ServiceArea";
import { CtaBand } from "./CtaBand";
import { SiteFooter } from "./SiteFooter";

/** Composes the full plumber template and applies the business's parametric theme. */
export function PlumberSite({ business }: { business: Business }) {
  return (
    <div style={themeVars(business.theme)} className="flex min-h-screen flex-col">
      <SiteHeader business={business} />
      <main className="flex-1">
        <Hero business={business} />
        <About business={business} />
        <Services business={business} />
        <Reviews business={business} />
        <ServiceArea business={business} />
        <CtaBand business={business} />
      </main>
      <SiteFooter business={business} />
    </div>
  );
}
