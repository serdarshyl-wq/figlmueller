import { line, lines, section } from "../fields";

export const opening = section("aboutOpening", "Opening", [
  {
    name: "image",
    title: "Picture",
    type: "image",
    options: { hotspot: true },
    description: "Held across the whole screen behind the title, darkened.",
    validation: (rule) => rule.required(),
  },
  line(
    "imageAlt",
    "Picture, described",
    160,
    "What is in the photograph, for a reader who cannot see it."
  ),
  lines(
    "headingLines",
    "Title",
    2,
    18,
    "Two words, one above the other. They are set to the width of the screen and may not wrap - on a phone they are measured and shrunk to fit, so a long word makes both lines small."
  ),
  line(
    "subtitle",
    "Line under the title",
    60,
    "Set small in capitals, under the title."
  ),
  {
    name: "body",
    title: "Paragraphs",
    type: "array",
    of: [{ type: "text", rows: 3, validation: (rule) => rule.max(260) }],
    validation: (rule) => rule.max(4),
    description:
      "Up to four, each read in as the screen is scrolled. Three is what the design was drawn for.",
  },
]);
