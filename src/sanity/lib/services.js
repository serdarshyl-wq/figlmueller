import { client } from "@/sanity/lib/client";
import { servicePages } from "@/sanity/schemaTypes/services";

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
  blocks[]{ "id": id.current, title, body, items, alt, image ${PICTURE} },
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

/*
 * The band at the foot of a service page: its two words, and the other service
 * pages under the names they carry on their own heads.
 *
 * The order is the site's rather than the store's - these are routes, and they
 * are read in the order the site lists them in - but what each one is called
 * is written in the studio, so renaming a page renames it here too.
 */
const OTHER_QUERY = `{
  "heading": *[_type == "servicesIndex"][0].otherHeading,
  "pages": *[_type == "servicePage" && slug.current in $slugs]{
    "slug": slug.current,
    "label": hero.title
  }
}`;

export async function getOtherServices(slug) {
  const written = await read(
    OTHER_QUERY,
    { slugs: servicePages.map((page) => page.slug) },
    "the other services"
  );

  const named = new Map(
    (written?.pages ?? []).map((page) => [page.slug, page.label])
  );

  return {
    heading: written?.heading,
    services: servicePages
      .filter((page) => page.slug !== slug)
      .map((page) => ({
        label: named.get(page.slug) || page.title,
        href: `/${page.slug}`,
      })),
  };
}

export const getServicePage = (slug) =>
  read(PAGE_QUERY, { slug }, `the ${slug} page`);
