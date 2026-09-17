import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import ServicesOther from "@/components/sections/services/ServicesOther";
import AfterArrival from "@/components/layout/AfterArrival";
import applications from "@/data/applications.json";

export default function ServicesApplications() {
  return (
    <>
      <ServicesHero hero={applications.hero} />

      <AfterArrival>
        <ServicesOverview intro={applications.intro} />
        <ServicesFeatures blocks={applications.blocks} cta />
        <ServicesOther />
      </AfterArrival>
    </>
  );
}
