import ResourcesHero from "@/components/sections/resources/ResourcesHero";
import ResourcesGallery from "@/components/sections/resources/ResourcesGallery";
import ResourcesClosing from "@/components/sections/resources/ResourcesClosing";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getResourcesPage } from "@/sanity/lib/resources";

export const metadata = {
  title: "Resources — Figlmueller Ind | L.L.C",
  description:
    "Technical resources from Figlmueller Ind — built for contractors, consultants, partners and technical visitors.",
};

export default async function ResourcesPage() {
  /* Read once, here: the three sections are timelines and cannot read the
     store themselves. Each takes what it is given or what it ships with. */
  const content = await getResourcesPage();

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ResourcesHero content={content?.hero} />

        <AfterArrival>
          <ResourcesGallery content={content?.gallery} />
          <ResourcesClosing content={content?.closing} />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
