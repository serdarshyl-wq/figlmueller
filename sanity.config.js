"use client";

/*
 * The studio, as the site serves it at /admin.
 *
 * This file configures the studio only. The site's own reads go through
 * `src/sanity/lib/client.js`; nothing here is imported by a page.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "@/sanity/env";
import { madeInCode, schema } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

const ONE_OF_EACH = madeInCode.map((type) => type.name);

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  schema,
  /*
   * The editing tool and nothing else. The GROQ console that used to sit
   * beside it is a developer's instrument - it carries its own editor and
   * parser into the page the client waits on, and the client has no use for
   * it. Queries are tried against the api instead.
   */
  plugins: [structureTool({ structure })],
  document: {
    /* There is one of each page section and the site reads them by name. Taking
       them out of the new-document menu is what stops a second one being made
       by accident and then edited for an afternoon without appearing
       anywhere. */
    newDocumentOptions: (previous) =>
      previous.filter((item) => !ONE_OF_EACH.includes(item.templateId)),
  },
});
