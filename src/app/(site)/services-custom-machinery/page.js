import ServicesCustomMachinery from "@/components/sections/services/ServicesCustomMachinery";
import PageTransition from "@/components/layout/PageTransition";
import { getOtherServices, getServicePage } from "@/sanity/lib/services";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/services-custom-machinery", {
    title: "Custom Machinery — Figlmueller Ind | L.L.C",
    description:
      "Custom machinery and technical systems for construction material production and site operation — every machine engineered to the project.",
  });

export default async function CustomMachineryPage() {
  const [content, other] = await Promise.all([
    getServicePage("services-custom-machinery"),
    getOtherServices("services-custom-machinery"),
  ]);

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesCustomMachinery content={content} other={other} />
      </main>
    </PageTransition>
  );
}
