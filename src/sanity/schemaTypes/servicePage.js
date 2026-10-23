import { line, lines, paragraph } from "./fields";

/*
 * A service page, as the site already reads one.
 *
 * The shape is taken from the four files in `src/data` rather than invented:
 * a head with a picture and a name, an opening line and paragraph, a run of
 * systems that carry either a paragraph or a list, and - on the Citrine page -
 * a sign-off. Nothing here asks the editor for anything the page does not
 * render, and nothing the page renders is missing.
 *
 * The slug is what ties a document to its route: `services-custom-machinery` is
 * read by its own page. It is typed rather than generated from the title,
 * because the routes exist already and the title is not what they were named
 * after.
 *
 * Every picture the page shows is held here, and asked for: a head with no
 * photograph behind it and a system with no picture beside it are both holes in
 * the page rather than a lighter version of it. The site still carries what it
 * was built with, but as a last resort rather than as the usual answer.
 */
export const servicePage = {
  name: "servicePage",
  title: "Service page",
  type: "document",
  groups: [
    { name: "head", title: "Head", default: true },
    { name: "body", title: "Body" },
  ],
  fields: [
    {
      name: "title",
      title: "Page name",
      description: "For the studio's own lists - not shown on the site.",
      type: "string",
      group: "head",
      validation: (rule) => rule.required().max(48),
    },
    {
      name: "slug",
      title: "Route",
      description:
        "The path this page is read at, without the leading slash: services-custom-machinery. Changing it takes the page off its route - leave it as it is.",
      type: "slug",
      group: "head",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    },
    {
      name: "hero",
      title: "Head",
      type: "object",
      group: "head",
      options: { collapsible: true, collapsed: false },
      fields: [
        line(
          "title",
          "Name",
          30,
          "Set to the width of the screen, so a longer name is simply set smaller. Below the full width it is broken to one word a line."
        ),
        {
          name: "image",
          title: "Picture",
          type: "image",
          options: { hotspot: true },
          description: "Held across the whole screen behind the name.",
          validation: (rule) => rule.required(),
        },
        line(
          "alt",
          "Picture, described",
          160,
          "What is in the photograph, for a reader who cannot see it."
        ),
      ],
    },
    {
      name: "intro",
      title: "Opening",
      type: "object",
      group: "body",
      options: { collapsible: true, collapsed: false },
      fields: [
        lines(
          "title",
          "The two lines",
          2,
          40,
          "Set large, one above the other, and read in as the screen is scrolled."
        ),
        paragraph(
          "body",
          "Paragraph",
          260,
          "Read a word at a time under the lines."
        ),
      ],
    },
    {
      name: "blocks",
      title: "Systems",
      description:
        "Read one at a time: the picture above, the name and its reading under it. Four is as many as the screen holds comfortably.",
      type: "array",
      group: "body",
      of: [
        {
          /* Not `block`: that name belongs to Sanity's own rich-text type, and
             an array member may not take a built-in's name. */
          type: "object",
          name: "systemBlock",
          title: "System",
          fields: [
            {
              name: "id",
              title: "Key",
              description:
                "A short, unchanging name for this system - used as its key in the page.",
              type: "slug",
              options: { source: "title", maxLength: 64 },
              validation: (rule) => rule.required(),
            },
            line("title", "Name", 48, null),
            paragraph("body", "Paragraph", 300, null),
            {
              name: "items",
              title: "Points",
              description:
                "A list instead of a paragraph, where a list reads better. Up to twelve, a line each.",
              type: "array",
              of: [{ type: "string", validation: (rule) => rule.max(70) }],
              validation: (rule) => rule.max(12),
            },
            {
              name: "image",
              title: "Picture",
              type: "image",
              options: { hotspot: true },
              description:
                "This system's own picture, held beside the reading and faded to as it is turned to. Every system has one.",
              validation: (rule) => rule.required(),
            },
            line(
              "alt",
              "Picture, described",
              160,
              "What is in the photograph, written for a search engine and for a reader who cannot see it. It has to describe the picture itself, so it is worth rewriting when the picture is changed."
            ),
          ],
          preview: {
            select: { title: "title", subtitle: "body", media: "image" },
          },
        },
      ],
      validation: (rule) => rule.max(10),
    },
    /*
     * Only the Citrine page ends on a sign-off. The three service pages end on
     * the other services instead - which is the site's own list of them, not
     * something written here - so the field is not shown on them at all rather
     * than offered and left empty.
     */
    {
      name: "closing",
      title: "Sign-off",
      description: "The last screen of the page.",
      type: "object",
      group: "body",
      hidden: ({ document }) => document?.slug?.current !== "citrine",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "title",
          title: "Words",
          description:
            "Read down the page, one to a line. Three is what the screen is set for.",
          type: "array",
          of: [{ type: "string", validation: (rule) => rule.max(20) }],
          validation: (rule) => rule.max(4),
        },
        paragraph("body", "Sentence", 220, null),
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "hero.image" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `/${subtitle}` : "no route yet",
      media,
    }),
  },
};
