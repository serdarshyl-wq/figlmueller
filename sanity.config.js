"use client";

/*
 * The studio, as the site serves it at /admin.
 *
 * This file configures the studio only. The site's own reads go through
 * `src/sanity/lib/client.js`; nothing here is imported by a page.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { dataset, projectId } from "@/sanity/env";
import { madeInCode, schema } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

/* The library keeps its tags as documents of their own. They are made in the
   library, where they belong, so they are taken out of the new-document menu
   with the rest. */
const ONE_OF_EACH = [...madeInCode.map((type) => type.name), "media.tag"];

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  schema,
  /*
   * The editing tool, and a library beside it.
   *
   * The GROQ console that used to sit here is a developer's instrument - it
   * carries its own editor and parser into the page the client waits on, and
   * the client has no use for it. Queries are tried against the api instead.
   *
   * The library is the one thing the studio has no answer for on its own: a
   * picture or a film uploaded into a field can only be found again through
   * that field. Media puts all of them on one screen - what they weigh, where
   * they are used, and what can be deleted - which is what stops a dataset
   * filling up with files nobody can account for.
   */
  plugins: [structureTool({ structure }), media()],
  document: {
    /* There is one of each page section and the site reads them by name. Taking
       them out of the new-document menu is what stops a second one being made
       by accident and then edited for an afternoon without appearing
       anywhere. */
    newDocumentOptions: (previous) =>
      previous.filter((item) => !ONE_OF_EACH.includes(item.templateId)),
  },
});
