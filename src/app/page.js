import HeroIntro from "@/components/hero/HeroIntro";
import EngineeringIntro from "@/components/sections/homepage/EngineeringIntro";
import EngineeringShowcase from "@/components/sections/homepage/EngineeringShowcase";
import CitrineIntro from "@/components/sections/homepage/CitrineIntro";
import WeBuild from "@/components/sections/homepage/WeBuild";
import RegionalGrowth from "@/components/sections/homepage/RegionalGrowth";
import ContactIntro from "@/components/sections/homepage/ContactIntro";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";

export default function Home() {
  return (
    <PageTransition>
      <main className="flex-1">
        <HeroIntro />

        <AfterArrival>
          <EngineeringIntro />
          <EngineeringShowcase />
          <CitrineIntro />
          <WeBuild />
          <RegionalGrowth />
          <ContactIntro />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
