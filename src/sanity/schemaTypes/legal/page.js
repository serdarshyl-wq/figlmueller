import { line, paragraph } from "../fields";

/*
 * A legal page: the privacy policy, the terms, the cookie page.
 *
 * They are the same page three times over - a title, a line under it, the
 * date it was last changed, and a run of numbered clauses read beside an index
 * that follows the reader down the screen - so they are one type, told apart
 * by the route they are read at, the way the service pages are.
 *
 * A clause is written as paragraphs, with a list where a list reads better.
 * Nothing is typed as markup: an empty line starts a new paragraph and the
 * page sets the rest.
 */
const clause = {
  type: "object",
  name: "clause",
  fields: [
    line(
      "heading",
      "Heading",
      70,
      "Numbered on the page, and listed in the index beside it."
    ),
    {
      name: "body",
      title: "Paragraphs",
      type: "text",
      rows: 8,
      description: "Leave a line empty to start a new paragraph.",
      validation: (rule) => rule.max(4000),
    },
    {
      name: "points",
      title: "Points",
      type: "array",
      of: [{ type: "string", validation: (rule) => rule.max(240) }],
      validation: (rule) => rule.max(20),
      description:
        "A list under the paragraphs, where a list reads better than a sentence.",
    },
  ],
  preview: {
    select: { title: "heading", body: "body", points: "points" },
    prepare: ({ title, body, points }) => ({
      title: title || "No heading yet",
      subtitle: body
        ? body.replace(/\s+/g, " ").slice(0, 90)
        : `${points?.length ?? 0} points`,
    }),
  },
};

export const legalPage = {
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Page name",
      description: "For the studio's own lists - not shown on the site.",
      type: "string",
      validation: (rule) => rule.required().max(48),
    },
    {
      name: "slug",
      title: "Route",
      description:
        "The path this page is read at, without the leading slash: privacy-policy. The footer links to it by that path - leave it as it is.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    },
    line(
      "eyebrow",
      "Word above the title",
      24,
      "Small, over the title. The same word on all three pages is what ties them together."
    ),
    line(
      "heading",
      "Title",
      40,
      "Set as large as the screen allows, so a longer title is simply set smaller."
    ),
    paragraph(
      "lead",
      "The line under the title",
      240,
      "One sentence saying what the page covers."
    ),
    {
      name: "updated",
      title: "Last changed",
      type: "date",
      options: { dateFormat: "DD MMMM YYYY" },
      description:
        "Read under the title. Worth moving forward whenever the wording below is changed.",
    },
    line(
      "indexLabel",
      "Over the index",
      24,
      "Small, above the list of clauses that follows the reader down the page."
    ),
    {
      name: "clauses",
      title: "The clauses",
      type: "array",
      of: [clause],
      validation: (rule) => rule.min(1).max(30),
      description: "Numbered on the page in the order they are written.",
    },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", clauses: "clauses" },
    prepare: ({ title, subtitle, clauses }) => ({
      title,
      subtitle: `${subtitle ? `/${subtitle}` : "no route yet"}  ·  ${clauses?.length ?? 0} clauses`,
    }),
  },
};
