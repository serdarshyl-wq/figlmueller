import { NextStudio } from "next-sanity/studio";

import config from "../../../../../sanity.config";

/*
 * Every path under /admin is this one page: the studio routes itself once it
 * is running, so the segment is optional and catches all of them.
 *
 * Nothing on it is rendered from data, so it is built once and served as it is;
 * what the editor sees is fetched by the studio in the browser, with their own
 * Sanity login behind it.
 */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
