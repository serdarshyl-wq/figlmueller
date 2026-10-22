import { client } from "@/sanity/lib/client";

/*
 * The about page, as the site reads it.
 *
 * Each section is a document of its own in the studio and they are gathered
 * back into one shape here, the way the home page is - a section is edited on
 * its own, the page is still read in a single request, and a component is
 * handed the same object whatever the store is split into.
 */
const PICTURE = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const only = (type, projection) => `*[_type == "${type}"][0]${projection}`;

/*
 * A company carries the pictures of its own pass of the slider, so the row of
 * cards and the field that passes through them are read from one list.
 */

const QUERY = `{
  "opening": ${only(
    "aboutOpening",
    `{ headingLines, subtitle, body, imageAlt, image ${PICTURE} }`
  )},
  "mission": ${only(
    "aboutMission",
    `{ eyebrow, titleLines, heldWord, panels, backImageAlt,
       cardImage ${PICTURE}, backImage ${PICTURE} }`
  )},
  "philosophy": ${only(
    "aboutPhilosophy",
    `{ headingLeft, headingRight, body, imageAlt, image ${PICTURE} }`
  )},
  "ecosystem": ${only(
    "aboutEcosystem",
    `{
       eyebrow,
       heading,
       companies[]{
         "id": _key,
         name, body, word,
         image ${PICTURE},
         gallery[]${PICTURE}
       }
     }`
  )},
  "founder": ${only(
    "aboutFounder",
    `{ headingLines, leftLabel, rightLabel,
       blocks[]{ title, paragraphs, image ${PICTURE} } }`
  )}
}`;

const REVALIDATE_SECONDS = 60;

export async function getAboutPage() {
  try {
    return await client.fetch(
      QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error("[sanity] the about page could not be read:", error.message);
    return null;
  }
}
