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
import { schema } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

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
});
