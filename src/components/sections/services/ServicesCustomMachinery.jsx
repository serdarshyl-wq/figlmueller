import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import ServicesOther from "@/components/sections/services/ServicesOther";
import AfterArrival from "@/components/layout/AfterArrival";
import machinery from "@/data/custom-machinery.json";

export default function ServicesCustomMachinery() {
  return (
    <>
      <ServicesHero hero={machinery.hero} />

      <AfterArrival>
        <ServicesOverview intro={machinery.intro} />
        <ServicesFeatures blocks={machinery.blocks} cta />
        <ServicesOther />
      </AfterArrival>
    </>
  );
}
