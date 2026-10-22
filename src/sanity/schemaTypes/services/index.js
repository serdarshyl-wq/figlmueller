import { allServices } from "./allServices";

/*
 * The services, as the studio lists them: the page the three are reached from,
 * then the three pages themselves.
 *
 * The three are `servicePage` documents rather than types of their own - they
 * are the same page three times over - and they are listed by the route they
 * are read at, because that is what ties a document to a page. A fourth one
 * cannot be made from the studio: a page without a route in the site would be
 * edited for an afternoon and appear nowhere.
 */
export const servicesSections = [allServices];

export const servicePages = [
  { slug: "services-automation-control", title: "Automation & Control" },
  { slug: "services-custom-machinery", title: "Custom Machinery" },
  { slug: "services-app-locations-areas", title: "Applications" },
];
