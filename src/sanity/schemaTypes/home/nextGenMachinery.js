import { line, lines, paragraph, section } from "../fields";

export const nextGenMachinery = section(
  "homeNextGenMachinery",
  "Next gen machinery",
  [
    lines(
      "displayLines",
      "The two display words",
      2,
      14,
      "Measured and set to the width of the row, so they shrink to fit - but a long word makes the whole line small."
    ),
    paragraph(
      "heading",
      "Line above the reading",
      120,
      "Set in capitals under the machine."
    ),
    paragraph("lead", "The reading", 200, "The sentence under the line."),
    {
      name: "actions",
      title: "The two buttons",
      type: "array",
      of: [
        {
          type: "object",
          name: "action",
          fields: [
            line("label", "Words", 34, null),
            { name: "href", title: "Goes to", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
      validation: (rule) => rule.max(2),
    },
    {
      name: "image",
      title: "The machine",
      type: "image",
      options: { hotspot: true },
      description:
        "A cut-out on a clear ground - it stands on the page, not in a box.",
    },
    line("imageAlt", "Machine, described", 160, null),
  ]
);
