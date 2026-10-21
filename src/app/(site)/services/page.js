import ServicesIndex from "@/components/sections/services/ServicesIndex";
import ServicesEnquiries from "@/components/sections/services/ServicesEnquiries";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";

export const metadata = {
  title: "Services — Figlmueller Ind | L.L.C",
  description:
    "Automation and control, custom machinery and applications — the three lines of work Figlmueller Ind builds for.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesIndex />

        <AfterArrival>
          <ServicesEnquiries />
        </AfterArrival>
      </main>
    </PageTransition>
  );
}
