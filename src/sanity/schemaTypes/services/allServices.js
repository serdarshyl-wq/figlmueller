import { line, lines, section } from "../fields";

/*
 * The page the three service pages are reached from: a heading, the three
 * cards, and the band at the foot.
 *
 * Where each card goes is not asked for. The three routes exist in the site and
 * are what the cards are built around - what is written here is what is read on
 * them: the name, the picture and what the picture shows.
 */
export const allServices = section("servicesIndex", "All services", [
  line("heading", "Title", 30, "Read once above the three cards."),
  {
    name: "cards",
    title: "The three cards",
    type: "array",
    of: [
      {
        type: "object",
        name: "card",
        fields: [
          line(
            "label",
            "Name on the card",
            26,
            "Set across the card, so a longer name is set smaller."
          ),
          {
            name: "image",
            title: "Picture",
            type: "image",
            options: { hotspot: true },
            description: "Fills the card, and darkens under the name.",
            validation: (rule) => rule.required(),
          },
          line("alt", "Picture, described", 160, null),
        ],
        preview: { select: { title: "label", media: "image" } },
      },
    ],
    validation: (rule) => rule.length(3),
    description:
      "Three, in the order they are read: automation and control, custom machinery, applications. On a phone they are stacked and read one over the other.",
  },
  {
    name: "enquiries",
    title: "The band at the foot",
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      lines(
        "titleLines",
        "The two lines",
        2,
        14,
        "Set in the middle of the band, one above the other."
      ),
      line(
        "asideLeft",
        "Word behind, left",
        8,
        "Set at a sixth of the screen's width and run off the left edge, so it has to be one short word."
      ),
      line("asideRight", "Word behind, right", 8, "The same, on the right."),
    ],
  },
]);
