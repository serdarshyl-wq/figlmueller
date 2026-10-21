/*
 * A service page, as the site already reads one.
 *
 * The shape is taken from the four files in `src/data` rather than invented:
 * a head with a picture and a name, an opening paragraph, a run of blocks that
 * carry either a paragraph or a list, and - on the Citrine page - a sign-off.
 * Nothing here asks the editor for anything the page does not render, and
 * nothing the page renders is missing.
 *
 * The slug is what ties a document to its route: `citrine` is read by
 * /citrine, `services-custom-machinery` by its own page. It is typed rather
 * than generated from the title, because the routes exist already and the
 * title is not what they were named after.
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
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Route",
      description:
        "The path this page is read at, without the leading slash: citrine, services-custom-machinery.",
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
        {
          name: "title",
          title: "Name",
          description:
            "Set to the width of the screen. Below the full width it is broken to one word a line.",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          name: "image",
          title: "Picture",
          type: "image",
          options: { hotspot: true },
          validation: (rule) => rule.required(),
        },
        {
          name: "alt",
          title: "Picture, described",
          description: "What is in the photograph, for a reader who cannot see it.",
          type: "string",
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      name: "intro",
      title: "Opening",
      type: "object",
      group: "body",
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: "title", title: "Line", type: "text", rows: 2 },
        { name: "body", title: "Paragraph", type: "text", rows: 4 },
      ],
    },
    {
      name: "blocks",
      title: "Systems",
      description:
        "Read one at a time: the picture above, the name and its reading under it.",
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
                "A short, unchanging name for this block - used as its key in the page.",
              type: "slug",
              options: { source: "title", maxLength: 64 },
              validation: (rule) => rule.required(),
            },
            {
              name: "title",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            },
            { name: "body", title: "Paragraph", type: "text", rows: 4 },
            {
              name: "items",
              title: "Points",
              description: "A list instead of a paragraph, where a list reads better.",
              type: "array",
              of: [{ type: "string" }],
            },
            {
              name: "image",
              title: "Picture",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: "title", subtitle: "body", media: "image" },
          },
        },
      ],
    },
    {
      name: "closing",
      title: "Sign-off",
      description: "The last screen of the page. Only the Citrine page has one.",
      type: "object",
      group: "body",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "title",
          title: "Words",
          description: "Read down the page below the full width, one to a line.",
          type: "text",
          rows: 2,
        },
        { name: "body", title: "Sentence", type: "text", rows: 3 },
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
