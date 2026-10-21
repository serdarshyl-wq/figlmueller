import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServicesFeatures from "@/components/sections/services/ServicesFeatures";
import CitrineClosing from "@/components/sections/citrine/CitrineClosing";
import citrine from "@/data/citrine.json";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";

export const metadata = {
  title: "Citrine® Machine — Figlmueller Ind | L.L.C",
  description:
    "Citrine® — a fully mobile, PLC-controlled material production platform on a single trailer.",
};

export default function CitrinePage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesHero hero={citrine.hero} />

        <AfterArrival>
          <ServicesOverview intro={citrine.intro} />
          <ServicesFeatures blocks={citrine.blocks} cta />
          <CitrineClosing closing={citrine.closing} />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
