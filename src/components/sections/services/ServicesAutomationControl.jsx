import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import ServicesOther from "@/components/sections/services/ServicesOther";
import AfterArrival from "@/components/layout/AfterArrival";
import { servicePageContent } from "@/components/sections/services/content";
import automation from "@/data/automation-control.json";

export default function ServicesAutomationControl({ content }) {
  const page = servicePageContent(automation, content);

  return (
    <>
      <ServicesHero hero={page.hero} />

      <AfterArrival>
        <ServicesOverview intro={page.intro} />
        <ServicesFeatures blocks={page.blocks} cta />
        <ServicesOther />
      </AfterArrival>
    </>
  );
}
