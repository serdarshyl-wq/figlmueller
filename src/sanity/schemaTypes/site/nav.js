import { line, section } from "../fields";

/*
 * The bar at the top of every page.
 *
 * An item is a word and where it goes. Give it lines of its own and it stops
 * being a link and becomes a panel that drops down instead - and where every
 * line of that panel carries a picture, the panel lights up with it as each is
 * pointed at. One line without a picture and the panel is read plain, because
 * a half-lit panel reads like something is missing.
 *
 * On a phone the same items are read down the sheet, in the same order.
 */
const child = {
  type: "object",
  name: "navChild",
  fields: [
    line("label", "Words", 34, null),
    line(
      "href",
      "Goes to",
      120,
      "A path on this site, such as /services-custom-machinery."
    ),
    line(
      "section",
      "And then down to",
      48,
      "Optional: the name of a part of that page - ecosystem, mission-vision - so the link lands on it rather than at the top."
    ),
    {
      name: "image",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
      description:
        "Lit behind the panel while this line is pointed at. Either every line of a panel has one or none of them do.",
    },
  ],
  preview: {
    select: { title: "label", subtitle: "href", media: "image" },
  },
};

const item = {
  type: "object",
  name: "navItem",
  fields: [
    line("label", "Words", 34, "Read in the bar."),
    line("href", "Goes to", 120, "A path on this site, such as /about."),
    {
      name: "submenu",
      title: "What opens under it",
      type: "array",
      of: [child],
      validation: (rule) => rule.max(8),
      description:
        "Left empty, the item is a plain link. Written, it drops a panel down over the page.",
    },
  ],
  preview: {
    select: { title: "label", subtitle: "href", submenu: "submenu" },
    prepare: ({ title, subtitle, submenu }) => ({
      title,
      subtitle: submenu?.length
        ? `${subtitle}  ·  ${submenu.length} under it`
        : subtitle,
    }),
  },
};

export const nav = section("siteNav", "Menu", [
  {
    name: "links",
    title: "The items",
    type: "array",
    of: [item],
    validation: (rule) => rule.min(2).max(8),
    description:
      "Read across the bar in the order they are written, split either side of the mark in the middle - the first half to the left of it, the rest to the right. An odd number leaves the extra one on the left.",
  },
]);
