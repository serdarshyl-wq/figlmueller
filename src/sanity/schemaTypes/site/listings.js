import { line, section } from "../fields";

/*
 * What each page is called in a search result and on a browser tab.
 *
 * It is not written on the page and it is not read by anybody who is already
 * on it - which is exactly why it is easy to forget and worth keeping in one
 * list, where all of them can be read against each other.
 *
 * A page is chosen from the routes the site actually has rather than typed:
 * a line written against a path that does not exist would never be read by
 * anything. Anything left out keeps what the page was built with.
 */
const PAGES = [
  { title: "Home", value: "/" },
  { title: "About", value: "/about" },
  { title: "Services", value: "/services" },
  { title: "Automation & Control", value: "/services-automation-control" },
  { title: "Custom Machinery", value: "/services-custom-machinery" },
  { title: "Applications", value: "/services-app-locations-areas" },
  { title: "Citrine® Machine", value: "/citrine" },
  { title: "Contact", value: "/contact" },
  { title: "Let's talk", value: "/connect-us" },
  { title: "Resources", value: "/resources" },
  { title: "Privacy policy", value: "/privacy-policy" },
  { title: "Terms of use", value: "/terms-of-use" },
  { title: "Cookies", value: "/cookies" },
];

const listing = {
  type: "object",
  name: "listing",
  fields: [
    {
      name: "page",
      title: "Which page",
      type: "string",
      options: { list: PAGES },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return "Pick the page this is written for.";

          const mine = context.path?.find((step) => step && step._key)?._key;
          const twice = (context.document?.pages || []).some(
            (item) => item?._key !== mine && item?.page === value
          );

          return twice ? "That page is already written out above." : true;
        }),
    },
    line(
      "title",
      "Title",
      70,
      "What the browser tab says and what a search result is headed by. A result shows about sixty letters of it, so the words that matter go first."
    ),
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "The sentence under the title in a search result. About a hundred and sixty letters are shown; it does not appear on the page itself.",
      validation: (rule) => rule.max(200),
    },
  ],
  preview: {
    select: { title: "title", subtitle: "page" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Nothing written yet",
      subtitle,
    }),
  },
};

export const listings = section("seoListings", "Search listings", [
  {
    name: "pages",
    title: "The pages",
    type: "array",
    of: [listing],
    validation: (rule) => rule.max(PAGES.length),
    description:
      "One line per page. A page that is not written here keeps the wording the site was built with.",
  },
]);
