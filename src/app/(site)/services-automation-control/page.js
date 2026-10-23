import ServicesAutomationControl from "@/components/sections/services/ServicesAutomationControl";
import PageTransition from "@/components/layout/PageTransition";
import { getOtherServices, getServicePage } from "@/sanity/lib/services";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/services-automation-control", {
    title: "Automation & Control — Figlmueller Ind | L.L.C",
    description:
      "PLC-driven automation and control built into every Figlmueller machine — one interface for the full production cycle.",
  });

export default async function AutomationControlPage() {
  const [content, other] = await Promise.all([
    getServicePage("services-automation-control"),
    getOtherServices("services-automation-control"),
  ]);

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesAutomationControl content={content} other={other} />
      </main>
    </PageTransition>
  );
}
