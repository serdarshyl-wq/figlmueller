import { client } from "@/sanity/lib/client";

/*
 * The home page, as the site reads it.
 *
 * Each section is a document of its own in the studio, and they are gathered
 * back into one shape here - so a section is edited on its own but the page is
 * still read in a single request, and a page component is handed the same
 * object whatever the store is split into.
 *
 * Assets are resolved to their own facts here rather than in the page: a
 * picture comes back as a URL with the size it was uploaded at, which is what
 * `next/image` needs to hold its space before it loads, and a film comes back
 * as a URL. Nothing downstream has to know it is talking to Sanity.
 */
const PICTURE = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const CUT = `{ "url": file.asset->url }`;

const only = (type, projection) => `*[_type == "${type}"][0]${projection}`;

const QUERY = `{
  "hero": ${only(
    "homeOpeningFilm",
    `{ headingLines, scrollLabel, video{ wide ${CUT}, tall ${CUT} } }`
  )},
  "engineeringIntro": ${only(
    "homeAllInOnePlace",
    `{ titleLines, what, experience, closerLines }`
  )},
  "engineeringShowcase": ${only(
    "homeSiteReadyMachinery",
    `{ headingLines, body, imageAlt, image ${PICTURE} }`
  )},
  "citrine": ${only("homeCitrine", `{ leadIn, heading, cta }`)},
  "weBuild": ${only(
    "homeWeBuild",
    `{ headingWords, disciplines, footnotes, cta }`
  )},
  "regionalGrowth": ${only(
    "homeRegionalGrowth",
    `{ headingLines, mapCentre, markers, ctaLines, ctaHref, noteLeft, noteRight }`
  )},
  "contactIntro": ${only(
    "homeNextGenMachinery",
    `{ displayLines, heading, lead, actions, imageAlt, image ${PICTURE} }`
  )}
}`;

/*
 * Read again at most once a minute. The page is built once and served from the
 * cache; a minute after an editor publishes, the next reader gets the new one.
 * A content store being unreachable must not take the site down with it - the
 * sections all fall back to what they ship with, so `null` is a valid answer.
 */
const REVALIDATE_SECONDS = 60;

export async function getHomePage() {
  try {
    return await client.fetch(
      QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the home page could not be read:", error.message);
    return null;
  }
}
