import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import ServicesOther from "@/components/sections/services/ServicesOther";
import AfterArrival from "@/components/layout/AfterArrival";
import automation from "@/data/automation-control.json";

export default function ServicesAutomationControl() {
  return (
    <>
      <ServicesHero hero={automation.hero} />

      <AfterArrival>
        <ServicesOverview intro={automation.intro} />
        <ServicesFeatures blocks={automation.blocks} cta />
        <ServicesOther />
      </AfterArrival>
    </>
  );
}
