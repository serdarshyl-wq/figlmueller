import ServicesApplications from "@/components/sections/services/ServicesApplications";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: "Applications — Figlmueller Ind | L.L.C",
  description:
    "Figlmueller machinery for infrastructure and civil engineering applications — flowable fill, backfill works, underground infrastructure and utility projects.",
};

export default function ApplicationsPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesApplications />
      </main>
    </PageTransition>
  );
}
