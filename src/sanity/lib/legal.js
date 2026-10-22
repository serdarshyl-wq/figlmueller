import { client } from "@/sanity/lib/client";

/*
 * A legal page, as the site reads it: one document, found by the route it is
 * read at - the same way a service page is.
 */
const QUERY = `*[_type == "legalPage" && slug.current == $slug][0]{
  eyebrow,
  heading,
  lead,
  updated,
  indexLabel,
  clauses[]{ heading, body, points }
}`;

const REVALIDATE_SECONDS = 60;

export async function getLegalPage(slug) {
  try {
    return await client.fetch(
      QUERY,
      { slug },
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch (error) {
    console.error(`[sanity] the ${slug} page could not be read:`, error.message);
    return null;
  }
}
