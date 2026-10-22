import { client } from "@/sanity/lib/client";

/*
 * The services, as the site reads them: the page the three are reached from,
 * and a service page by the route it is read at.
 *
 * A service page is one document rather than a document a section - the three
 * are the same page three times over, and the editor opens the page they came
 * to change rather than a part of it.
 */
const PICTURE = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const INDEX_QUERY = `*[_type == "servicesIndex"][0]{
  heading,
  cards[]{ label, alt, image ${PICTURE} },
  enquiries
}`;

const PAGE_QUERY = `*[_type == "servicePage" && slug.current == $slug][0]{
  hero{ title, alt, image ${PICTURE} },
  intro,
  blocks[]{ "id": id.current, title, body, items, image ${PICTURE} },
  closing
}`;

const REVALIDATE_SECONDS = 60;

const read = async (query, params, what) => {
  try {
    return await client.fetch(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    console.error(`[sanity] ${what} could not be read:`, error.message);
    return null;
  }
};

export const getServicesIndex = () =>
  read(INDEX_QUERY, {}, "the services page");

export const getServicePage = (slug) =>
  read(PAGE_QUERY, { slug }, `the ${slug} page`);
