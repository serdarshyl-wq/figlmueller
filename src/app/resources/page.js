import ResourcesHero from "@/components/sections/resources/ResourcesHero";
import ResourcesGallery from "@/components/sections/resources/ResourcesGallery";
import ResourcesClosing from "@/components/sections/resources/ResourcesClosing";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";

export const metadata = {
  title: "Resources — Figlmueller Ind | L.L.C",
  description:
    "Technical resources from Figlmueller Ind — built for contractors, consultants, partners and technical visitors.",
};

export default function ResourcesPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ResourcesHero />

        <AfterArrival>
          <ResourcesGallery />
          <ResourcesClosing />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
