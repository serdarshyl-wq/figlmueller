import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/*
 * The read side: what the site itself uses to ask the content store for a page.
 *
 * `useCdn` is on, which means queries are answered from Sanity's edge cache
 * rather than from the API itself - the right trade for a site whose content
 * changes a few times a month and is read all day. The studio at /admin does
 * not go through this client; it holds its own, which always reads live, so
 * what an editor sees while editing is never a cached copy of their own work.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
