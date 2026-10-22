import ServicesApplications from "@/components/sections/services/ServicesApplications";
import PageTransition from "@/components/layout/PageTransition";
import { getServicePage } from "@/sanity/lib/services";

export const metadata = {
  title: "Applications — Figlmueller Ind | L.L.C",
  description:
    "Figlmueller machinery for infrastructure and civil engineering applications — flowable fill, backfill works, underground infrastructure and utility projects.",
};

export default async function ApplicationsPage() {
  const content = await getServicePage("services-app-locations-areas");

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesApplications content={content} />
      </main>
    </PageTransition>
  );
}
