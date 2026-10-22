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
  requiredFault,
  formatFault
}`;

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
