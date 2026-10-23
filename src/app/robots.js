/*
 * What a crawler is told at /robots.txt.
 *
 * The site itself is open: every page on it is meant to be found. What is kept
 * out is the part that is not a page - the studio, which already carries its
 * own noindex, and the route the enquiry form posts to.
 *
 * There is no sitemap line yet. A sitemap is a list of absolute addresses and
 * the site does not have a domain to write them against; it is added with the
 * domain.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
  };
}
