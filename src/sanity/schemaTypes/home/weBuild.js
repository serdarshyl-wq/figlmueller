import { cta, lines, section } from "../fields";

export const weBuild = section("homeWeBuild", "We build", [
  lines(
    "headingWords",
    "The two words",
    2,
    9,
    "Parted and thrown off opposite edges of the screen. Long words do not fit the move - keep them to a word each."
  ),
  {
    name: "disciplines",
    title: "The list",
    type: "array",
    of: [{ type: "string", validation: (rule) => rule.max(34) }],
    validation: (rule) => rule.min(3).max(7),
    description:
      "Five is what the screen is set for. Each line is set to the width of the row below the full width, so a long one makes the whole list smaller.",
  },
  {
    name: "footnotes",
    title: "Notes at the foot",
    type: "array",
    of: [{ type: "text", rows: 3, validation: (rule) => rule.max(200) }],
    validation: (rule) => rule.max(3),
  },
  cta("cta", "Button", "The way through to the custom machinery page."),
]);
