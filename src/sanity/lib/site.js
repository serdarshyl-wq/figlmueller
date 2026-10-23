import { client } from "@/sanity/lib/client";

/*
 * What is read under every page: the foot of the site.
 *
 * It is asked for where the foot is drawn rather than in each page, so no page
 * has to know it is there. The read is the same on every page, so Next serves
 * all but the first of them from its own cache.
 */
const FOOTER = `*[_type == "siteFooter"][0]{
  notice,
  noticeEmail,
  socials[]{ place, href },
  links[]{ label, href },
  copyright,
  rights,
  madeBy
}`;

const REVALIDATE_SECONDS = 60;

export async function getSiteFooter() {
  try {
    return await client.fetch(
      FOOTER,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the footer could not be read:", error.message);
    return null;
  }
}
