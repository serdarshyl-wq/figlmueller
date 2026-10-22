import HeroIntro from "@/components/hero/HeroIntro";
import EngineeringIntro from "@/components/sections/homepage/EngineeringIntro";
import EngineeringShowcase from "@/components/sections/homepage/EngineeringShowcase";
import CitrineIntro from "@/components/sections/homepage/CitrineIntro";
import WeBuild from "@/components/sections/homepage/WeBuild";
import RegionalGrowth from "@/components/sections/homepage/RegionalGrowth";
import ContactIntro from "@/components/sections/homepage/ContactIntro";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getHomePage } from "@/sanity/lib/home";

/*
 * Read once, here, and handed down a section at a time.
 *
 * The sections are all client components - they are timelines - so none of
 * them can read the content store itself. This is the one place that does, and
 * every one of them takes what it was given or falls back to what it ships
 * with, so an empty field or an unreachable store is a section that reads the
 * way it reads today rather than a hole in the page.
 */
export default async function Home() {
  const content = await getHomePage();

  return (
    <PageTransition>
      <main className="flex-1">
        <HeroIntro content={content?.hero} />

        <AfterArrival>
          <EngineeringIntro content={content?.engineeringIntro} />
          <EngineeringShowcase content={content?.engineeringShowcase} />
          <CitrineIntro content={content?.citrine} />
          <WeBuild content={content?.weBuild} />
          <RegionalGrowth content={content?.regionalGrowth} />
          <ContactIntro
            content={content?.contactIntro}
            channels={content?.channels?.topics}
          />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
