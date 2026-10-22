import LegalPage from "@/components/sections/legal/LegalPage";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getLegalPage } from "@/sanity/lib/legal";

export const metadata = {
  title: "Privacy policy — Figlmueller Ind | L.L.C",
  description:
    "How Figlmueller Ind | L.L.C handles the information sent through this website.",
};

export default async function PrivacyPolicyPage() {
  const content = await getLegalPage("privacy-policy");

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <LegalPage content={content} />

        {/* A page of type has nothing heavy enough to hold back - the hold
            itself stays, for the scroll lock and the page's own memory. */}
        <AfterArrival />
      </main>
    </PageTransition>
  );
}
