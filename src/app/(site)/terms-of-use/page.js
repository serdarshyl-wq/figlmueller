import LegalPage from "@/components/sections/legal/LegalPage";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getLegalPage } from "@/sanity/lib/legal";

export const metadata = {
  title: "Terms of use — Figlmueller Ind | L.L.C",
  description:
    "The terms on which the Figlmueller Ind | L.L.C website is made available.",
};

export default async function TermsOfUsePage() {
  const content = await getLegalPage("terms-of-use");

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <LegalPage content={content} />

        <AfterArrival />
      </main>
    </PageTransition>
  );
}
