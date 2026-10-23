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
  rights
}`;

/*
 * What a page is called in a search result. Asked for by the page's own route,
 * because that is what a line is written against in the studio - and answered
 * with what the page was built with where nothing has been written for it, so
 * no page is ever left without a title.
 */
const LISTINGS = `*[_type == "seoListings"][0].pages[]{ page, title, description }`;

/*
 * The bar at the top. A panel's pictures come back as plain addresses, because
 * that is all the panel does with them - it lights one behind the lines.
 */
const NAV = `*[_type == "siteNav"][0]{
  links[]{
    label,
    href,
    submenu[]{ label, href, section, "image": image.asset->url }
  }
}`;

const REVALIDATE_SECONDS = 60;

export async function listingFor(route, shipped) {
  try {
    const pages = await client.fetch(
      LISTINGS,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    const written = pages?.find((listing) => listing?.page === route);

    return {
      title: written?.title || shipped.title,
      description: written?.description || shipped.description,
    };
  } catch (error) {
    console.error("[sanity] the search listings could not be read:", error.message);
    return shipped;
  }
}

export async function getSiteNav() {
  try {
    return await client.fetch(
      NAV,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the menu could not be read:", error.message);
    return null;
  }
}

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
