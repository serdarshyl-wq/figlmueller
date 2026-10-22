import { client } from "@/sanity/lib/client";

/*
 * The contact page, as the site reads it: the list of reasons to write, and
 * the four addresses under it.
 *
 * The first of the two is read by the home page as well - it is the screen it
 * closes on - so it is written once in the studio and asked for in both
 * places rather than kept in step by hand.
 */
export const CHANNELS = `*[_type == "contactChannels"][0]{
  topics[]{ label, details[]{ kind, value } }
}`;

const QUERY = `{
  "channels": ${CHANNELS},
  "addresses": *[_type == "contactAddresses"][0]{ addresses[]{ label, email } }
}`;

const REVALIDATE_SECONDS = 60;

export async function getContactPage() {
  try {
    return await client.fetch(
      QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the contact page could not be read:", error.message);
    return null;
  }
}
