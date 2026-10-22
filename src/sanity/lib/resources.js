import { client } from "@/sanity/lib/client";

/*
 * The resources page, as the site reads it: the film it opens on, the list it
 * is for, and the sign-off - three documents in the studio, one object here.
 *
 * The film comes back as two URLs, the way the home page's does: the screen
 * takes the tall cut if it is taller than it is wide, and the wide one
 * otherwise.
 */
const PICTURE = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

/* The film, and behind it the same film as an MP4: the browser is given both
   and takes the first it can read. */
const CUT = `{
  "files": [file, backup][defined(asset)]{
    "url": asset->url,
    "type": asset->mimeType
  }
}`;

const only = (type, projection) => `*[_type == "${type}"][0]${projection}`;

const QUERY = `{
  "hero": ${only(
    "resourcesHero",
    `{ statements, stackRows, poster ${PICTURE}, video{ wide ${CUT}, tall ${CUT} } }`
  )},
  "gallery": ${only(
    "resourcesGallery",
    `{
       ctaLabel, panelNote,
       items[]{
         title, "slug": slug.current,
         image ${PICTURE},
         body[]{ text, image ${PICTURE} }
       }
     }`
  )},
  "closing": ${only("resourcesClosing", `{ lines, word }`)}
}`;

const REVALIDATE_SECONDS = 60;

export async function getResourcesPage() {
  try {
    return await client.fetch(
      QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error(
      "[sanity] the resources page could not be read:",
      error.message
    );
    return null;
  }
}
