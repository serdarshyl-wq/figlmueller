import { line, lines, section } from "../fields";

/*
 * A sentence at a time.
 *
 * The chapters are read out sentence by sentence as the screen is held, so the
 * writing is kept as sentences rather than as a block of text: each one is a
 * line of its own in the studio, and each one is a step in the move. A chapter
 * with more sentences simply takes longer to read out - the timing is measured
 * from what is written here.
 */
const paragraphs = {
  name: "paragraphs",
  title: "Paragraphs",
  type: "array",
  of: [
    {
      type: "object",
      name: "paragraph",
      fields: [
        {
          name: "sentences",
          title: "Sentences",
          type: "array",
          of: [{ type: "string", validation: (rule) => rule.max(180) }],
          validation: (rule) => rule.max(6),
          description: "One line each. They appear one after the other.",
        },
      ],
      preview: {
        select: { sentences: "sentences" },
        prepare: ({ sentences = [] }) => ({
          title: sentences[0] ?? "Empty paragraph",
          subtitle:
            sentences.length > 1 ? `${sentences.length} sentences` : undefined,
        }),
      },
    },
  ],
  validation: (rule) => rule.max(3),
  description: "Two is what the design was drawn for.",
};

export const founder = section("aboutFounder", "Founder", [
  lines("headingLines", "Title", 2, 30, "Two lines, centred at the top."),
  line("leftLabel", "Word on the left", 14, "Set against the left edge."),
  line("rightLabel", "Word on the right", 14, "The same, on the right."),
  {
    name: "blocks",
    title: "The chapters",
    type: "array",
    of: [
      {
        type: "object",
        /* Not "block": that is the name Sanity's own rich text goes by, and an
           array member may not take a built-in type's name. */
        name: "chapter",
        fields: [
          line(
            "title",
            "Heading",
            24,
            "Left empty on the first chapter, which opens without one."
          ),
          {
            name: "image",
            title: "Picture",
            type: "image",
            options: { hotspot: true },
            description:
              "This chapter's own picture, held beside the writing and faded into the one before it. Every chapter has one.",
            validation: (rule) => rule.required(),
          },
          paragraphs,
        ],
        preview: {
          select: { title: "title", paragraphs: "paragraphs" },
          prepare: ({ title, paragraphs: written = [] }) => ({
            title: title || "Opening chapter",
            subtitle: written[0]?.sentences?.[0],
          }),
        },
      },
    ],
    validation: (rule) => rule.max(5),
    description:
      "Read out in order against a picture each, as the screen is held. Four is what the design was drawn for; the fourth is the one linked to from elsewhere on the site.",
  },
]);
