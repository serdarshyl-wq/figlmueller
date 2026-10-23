import ConnectPanel from "@/components/sections/connect/ConnectPanel";
import PageTransition from "@/components/layout/PageTransition";
import { getConnectPanel } from "@/sanity/lib/connect";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/connect-us", {
    title: "Connect — Figlmueller Ind | L.L.C",
    description:
      "Project enquiries — tell us about yourself and we will get back to you as soon as we can.",
  });

export default async function ConnectUsPage() {
  /* The form is a timeline of its own and cannot read the store: it is read
     here and handed down, and falls back to what it ships with. */
  const content = await getConnectPanel();

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ConnectPanel content={content} />
      </main>
    </PageTransition>
  );
}
