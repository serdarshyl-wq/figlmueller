"use client";

/*
 * The studio, as the site serves it at /admin.
 *
 * This file configures the studio only. The site's own reads go through
 * `src/sanity/lib/client.js`; nothing here is imported by a page.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema, singletons } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

const ONE_OF_EACH = singletons.map((section) => section.name);

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    /* A console for GROQ, pinned to the same API date the site reads at - so a
       query tried here answers the way it will answer in the site. */
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    /* There is one of each page section and the site reads them by name. Taking
       them out of the new-document menu is what stops a second one being made
       by accident and then edited for an afternoon without appearing
       anywhere. */
    newDocumentOptions: (previous) =>
      previous.filter((item) => !ONE_OF_EACH.includes(item.templateId)),
  },
});
