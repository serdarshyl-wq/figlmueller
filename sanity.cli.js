import { defineCliConfig } from "sanity/cli";

/*
 * For the `sanity` command line - deploying GraphQL, managing datasets, pulling
 * and pushing documents. The studio itself is served by this Next app, so there
 * is no studio to deploy to sanity.studio from here.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
