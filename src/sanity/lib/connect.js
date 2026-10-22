import { client } from "@/sanity/lib/client";

/*
 * The enquiry sheet, as the site reads it. One document: what it is called,
 * the two screens of the form, and everything the form says back.
 */
const QUERY = `*[_type == "connectPanel"][0]{
  headingWords,
  steps[]{ lead, action, fields[]{ name, label, optional } },
  enquiryLegend,
  enquiryTypes,
  messageLabel,
  attachLabel,
  previousLabel,
  sendingLabel,
  sentMessage,
  failedMessage,
  requiredFault,
  formatFault
}`;

/*
 * Where a filled-in form is sent. Read on its own, by the route that sends it,
 * and never handed to the browser: the address belongs in the mail rather than
 * in the page, where it would be read off by anything crawling the site.
 */
const INBOX = `*[_type == "connectPanel"][0].inbox`;

const REVALIDATE_SECONDS = 60;

export async function getConnectPanel() {
  try {
    return await client.fetch(
      QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the enquiry sheet could not be read:", error.message);
    return null;
  }
}

/* Asked for as the enquiry is sent, so a change in the studio takes effect on
   the next one rather than at the next build. */
export async function getEnquiryInbox() {
  try {
    return await client.fetch(INBOX, {}, { cache: "no-store" });
  } catch (error) {
    console.error("[sanity] the enquiry inbox could not be read:", error.message);
    return null;
  }
}
