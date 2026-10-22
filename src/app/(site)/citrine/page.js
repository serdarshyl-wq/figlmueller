import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import CitrineClosing from "@/components/sections/citrine/CitrineClosing";
import { servicePageContent } from "@/components/sections/services/content";
import citrine from "@/data/citrine.json";
import { getServicePage } from "@/sanity/lib/services";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";

export const metadata = {
  title: "Citrine® Machine — Figlmueller Ind | L.L.C",
  description:
    "Citrine® — a fully mobile, PLC-controlled material production platform on a single trailer.",
};

export default async function CitrinePage() {
  /* Written in the studio as a page of its own, over what the site ships
     with - so an unfilled field is the built page rather than a hole. */
  const page = servicePageContent(citrine, await getServicePage("citrine"));

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesHero hero={page.hero} />

        <AfterArrival>
          <ServicesOverview intro={page.intro} />
          <ServicesFeatures blocks={page.blocks} cta />
          <CitrineClosing closing={page.closing} />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
