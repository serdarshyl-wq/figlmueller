import ServicesApplications from "@/components/sections/services/ServicesApplications";
import PageTransition from "@/components/layout/PageTransition";
import { getOtherServices, getServicePage } from "@/sanity/lib/services";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/services-app-locations-areas", {
    title: "Applications — Figlmueller Ind | L.L.C",
    description:
      "Figlmueller machinery for infrastructure and civil engineering applications — flowable fill, backfill works, underground infrastructure and utility projects.",
  });

export default async function ApplicationsPage() {
  const [content, other] = await Promise.all([
    getServicePage("services-app-locations-areas"),
    getOtherServices("services-app-locations-areas"),
  ]);

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesApplications content={content} other={other} />
      </main>
    </PageTransition>
  );
}
