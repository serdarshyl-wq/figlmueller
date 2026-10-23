import ServicesIndex from "@/components/sections/services/ServicesIndex";
import ServicesEnquiries from "@/components/sections/services/ServicesEnquiries";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getServicesIndex } from "@/sanity/lib/services";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/services", {
    title: "Services — Figlmueller Ind | L.L.C",
    description:
      "Automation and control, custom machinery and applications — the three lines of work Figlmueller Ind builds for.",
  });

export default async function ServicesPage() {
  const content = await getServicesIndex();

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesIndex content={content} />

        <AfterArrival>
          <ServicesEnquiries content={content?.enquiries} />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
