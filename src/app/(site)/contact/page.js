import ContactChannels from "@/components/sections/contact/ContactChannels";
import ContactAddresses from "@/components/sections/contact/ContactAddresses";
import PageTransition from "@/components/layout/PageTransition";
import AfterArrival from "@/components/layout/AfterArrival";
import { getContactPage } from "@/sanity/lib/contact";
import { listingFor } from "@/sanity/lib/site";

/* What this page is called in a search result is written in the studio -
   under Site-wide, Search listings - over what it was built with. */
export const generateMetadata = () =>
  listingFor("/contact", {
    title: "Contact — Figlmueller Ind | L.L.C",
    description:
      "Machinery enquiries, technical discussions, project partnerships and custom system development — Figlmueller Ind, Dubai.",
  });

export default async function ContactPage() {
  /* Both bands are written in the studio; either one left empty is the list
     the page ships with rather than a hole in it. */
  const content = await getContactPage();

  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <h1 className="sr-only">Contact Figlmueller Ind</h1>

        {/* The page opens on the same list the home page closes with, held to
            one screen. */}
        <ContactChannels
          className="contact-page-channels h-svh"
          topics={content?.channels?.topics}
        />

        {/* Not held back with the arrival: below the full width the two bands
            are read one after the other, so the addresses are on the first
            screen and would be seen appearing a second after the page had
            landed. They are a block of type - there is nothing here worth
            holding a transition for. The hold itself stays, for the scroll lock
            and the page's own memory. */}
        <ContactAddresses addresses={content?.addresses?.addresses} />

        <AfterArrival />
      </main>
    </PageTransition>
  );
}
