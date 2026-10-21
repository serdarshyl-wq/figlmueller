import ServicesCustomMachinery from "@/components/sections/services/ServicesCustomMachinery";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: "Custom Machinery — Figlmueller Ind | L.L.C",
  description:
    "Custom machinery and technical systems for construction material production and site operation — every machine engineered to the project.",
};

export default function CustomMachineryPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesCustomMachinery />
      </main>
    </PageTransition>
  );
}
