import { line, lines, paragraph, section } from "../fields";

export const mission = section("aboutMission", "Mission & vision", [
  line("eyebrow", "Word above the title", 24, "Set small over the title."),
  lines(
    "titleLines",
    "Title",
    2,
    18,
    "Two lines, read before the card rises over them."
  ),
  line(
    "heldWord",
    "The word that is held",
    8,
    "Set beside each of the two words below and does not change with them - OUR mission, OUR vision. It is set at a tenth of the screen's width, so it has to be short."
  ),
  {
    name: "panels",
    title: "The two words",
    type: "array",
    of: [
      {
        type: "object",
        name: "panel",
        fields: [
          line(
            "word",
            "Word",
            9,
            "Rolled up into place beside the held word, set as large as the screen allows."
          ),
          paragraph("body", "The reading under it", 140, null),
        ],
        preview: { select: { title: "word", subtitle: "body" } },
      },
    ],
    validation: (rule) => rule.length(2),
    description:
      "Two, in the order they are read: the first is held, then rolled out for the second. The move is built for two and only two.",
  },
  {
    name: "cardImage",
    title: "The card",
    type: "image",
    options: { hotspot: true },
    description:
      "Stands upright in the middle of the screen and turns over. An upright picture - the card is cut to the shape of it.",
    validation: (rule) => rule.required(),
  },
  {
    name: "backImage",
    title: "Behind the card",
    type: "image",
    options: { hotspot: true },
    description:
      "What the card turns over onto, opened out to fill the screen and darkened under the words.",
    validation: (rule) => rule.required(),
  },
  line("backImageAlt", "Behind the card, described", 160, null),
]);
