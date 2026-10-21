import AboutHero from "@/components/sections/about/AboutHero";
import AboutMission from "@/components/sections/about/AboutMission";
import AboutPhilosophy from "@/components/sections/about/AboutPhilosophy";
import AboutEcosystem from "@/components/sections/about/AboutEcosystem";
import AboutShowcase from "@/components/sections/about/AboutShowcase";
import AboutFounder from "@/components/sections/about/AboutFounder";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getAboutPage } from "@/sanity/lib/about";

export const metadata = {
  title: "About — Figlmueller Ind | L.L.C",
  description:
    "Figlmueller Ind | L.L.C — industrial engineering for modern construction machinery, Dubai, UAE.",
};

export default async function AboutPage() {
  const content = await getAboutPage();

  return (
    <PageTransition>
      <main className="flex-1">
        <AboutHero content={content?.opening} />

        <AfterArrival>
          <AboutMission content={content?.mission} />
          <AboutPhilosophy content={content?.philosophy} />
          <AboutEcosystem content={content?.ecosystem} />
          <AboutShowcase content={content?.showcase} />
          <AboutFounder content={content?.founder} />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
