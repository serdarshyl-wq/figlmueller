export { legalPage } from "./page";

/*
 * The three the footer links to, in the order it links to them. They are
 * `legalPage` documents told apart by their route, and a fourth cannot be made
 * from the studio: a page without a route in the site would be written out and
 * then read by nobody.
 */
export const legalPages = [
  { slug: "privacy-policy", title: "Privacy policy" },
  { slug: "terms-of-use", title: "Terms of use" },
  { slug: "cookies", title: "Cookies" },
];
