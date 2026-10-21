import { line, lines, paragraph, section } from "../fields";

export const regionalGrowth = section("homeRegionalGrowth", "Regional growth", [
  lines(
    "headingLines",
    "The three lines",
    3,
    30,
    "Each crosses the screen on its own. They are not allowed to wrap, so a long line simply runs further - keep them close to the length they are."
  ),
  line("mapCentre", "Name on the map", 28, "Set in the middle of the field."),
  {
    name: "markers",
    title: "Marks on the map",
    type: "array",
    of: [
      {
        type: "object",
        name: "marker",
        fields: [
          line("label", "Words", 30, null),
          {
            name: "top",
            title: "Down the field (%)",
            type: "number",
            validation: (rule) => rule.min(0).max(100),
          },
          {
            name: "left",
            title: "Across the field (%)",
            type: "number",
            validation: (rule) => rule.min(0).max(100),
          },
        ],
        preview: {
          select: { title: "label", top: "top", left: "left" },
          prepare: ({ title, top, left }) => ({
            title,
            subtitle: `${top ?? "?"}% down, ${left ?? "?"}% across`,
          }),
        },
      },
    ],
    validation: (rule) => rule.max(12),
    description:
      "Placed by hand, as a share of the field. Nine is what the field is spaced for.",
  },
  lines(
    "ctaLines",
    "Button, in two lines",
    2,
    26,
    "The button at the centre of the map carries its wording on two lines."
  ),
  {
    name: "ctaHref",
    title: "Button goes to",
    type: "string",
    validation: (rule) => rule.max(120),
  },
  paragraph(
    "noteLeft",
    "Note, left",
    220,
    "Set into the left-hand corner, in a column half the width of the screen."
  ),
  paragraph("noteRight", "Note, right", 220, "The same, on the right."),
]);
