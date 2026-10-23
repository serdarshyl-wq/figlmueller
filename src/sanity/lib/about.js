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

const QUERY = `{
  "opening": ${only(
    "aboutOpening",
    `{ headingLines, subtitle, body, imageAlt, image ${PICTURE} }`
  )},
  "mission": ${only(
    "aboutMission",
    `{ eyebrow, titleLines, heldWord, panels, backImageAlt, cardImageAlt,
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
         name, body, word, alt,
         image ${PICTURE}
       },
       passes[]{ company, pictures[]${PICTURE} }
     }`
  )},
  "founder": ${only(
    "aboutFounder",
    `{ headingLines, leftLabel, rightLabel,
       blocks[]{ title, paragraphs, alt, image ${PICTURE} } }`
  )}
}`;

const REVALIDATE_SECONDS = 60;

/*
 * The slider is written under the companies as a pass apiece, each one holding
 * the company it belongs to by name and nothing else but pictures. They are
 * handed back to their company here, so the section is given one list the way
 * it reads it - a company with no pass gets an empty field and is simply not
 * passed through.
 */
function joinPasses(page) {
  const ecosystem = page?.ecosystem;
  if (!ecosystem) return page;

  const { passes = [], companies = [], ...rest } = ecosystem;

  return {
    ...page,
    ecosystem: {
      ...rest,
      companies: companies.map((company) => ({
        ...company,
        gallery:
          passes.find((pass) => pass?.company === company?.name)?.pictures ??
          [],
      })),
    },
  };
}

export async function getAboutPage() {
  try {
    return joinPasses(
      await client.fetch(
        QUERY,
        {},
        { next: { revalidate: REVALIDATE_SECONDS } }
      )
    );
  } catch (error) {
    console.error("[sanity] the about page could not be read:", error.message);
    return null;
  }
}
