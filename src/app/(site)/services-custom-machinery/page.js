import ServicesCustomMachinery from "@/components/sections/services/ServicesCustomMachinery";
import PageTransition from "@/components/layout/PageTransition";
import { getServicePage } from "@/sanity/lib/services";

export const metadata = {
  title: "Custom Machinery — Figlmueller Ind | L.L.C",
  description:
    "Custom machinery and technical systems for construction material production and site operation — every machine engineered to the project.",
};

export default async function CustomMachineryPage() {
  const content = await getServicePage("services-custom-machinery");

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesCustomMachinery content={content} />
      </main>
    </PageTransition>
  );
}
