import LegalPage from "@/components/sections/legal/LegalPage";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getLegalPage } from "@/sanity/lib/legal";

export const metadata = {
  title: "Cookies — Figlmueller Ind | L.L.C",
  description:
    "What the Figlmueller Ind | L.L.C website keeps on your device, and what it does not.",
};

export default async function CookiesPage() {
  const content = await getLegalPage("cookies");

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <LegalPage content={content} />

        <AfterArrival />
      </main>
    </PageTransition>
  );
}
