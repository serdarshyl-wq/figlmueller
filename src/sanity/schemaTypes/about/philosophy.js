import { line, section } from "../fields";

export const philosophy = section(
  "aboutPhilosophy",
  "Engineering philosophy",
  [
    line(
      "headingLeft",
      "Word on the left",
      16,
      "Flown in from the left edge of the screen onto the picture. A long word starts further out and arrives late."
    ),
    line("headingRight", "Word on the right", 16, "The same, from the right."),
    {
      name: "image",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
      description:
        "Set between the two words, at a little under half the width of the screen.",
      validation: (rule) => rule.required(),
    },
    line("imageAlt", "Picture, described", 160, null),
    {
      name: "body",
      title: "The reading",
      type: "array",
      of: [{ type: "text", rows: 2, validation: (rule) => rule.max(220) }],
      validation: (rule) => rule.max(4),
      description:
        "Each line rises out of its own mask, one after the other. Three is what the design was drawn for.",
    },
  ]
);
