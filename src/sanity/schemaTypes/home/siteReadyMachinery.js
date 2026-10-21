import { line, lines, section } from "../fields";

export const siteReadyMachinery = section(
  "homeSiteReadyMachinery",
  "Site-ready machinery",
  [
    lines("headingLines", "Heading", 2, 44, "Two lines above the reading."),
    {
      name: "body",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3, validation: (rule) => rule.max(260) }],
      validation: (rule) => rule.max(4),
      description: "Up to four. Three is what the design was drawn for.",
    },
    {
      name: "image",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
      description:
        "Opened across the screen on a desk, and across the top half below that.",
    },
    line(
      "imageAlt",
      "Picture, described",
      160,
      "What is in the photograph, for a reader who cannot see it."
    ),
  ]
);
