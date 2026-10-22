import { line, section } from "../fields";

/*
 * The companies, written once and read twice.
 *
 * The page names them in a row of cards and then passes through them again
 * below, one at a time, with a field of pictures flying past each name. Both
 * are this one list: a company is written here with its card and with the
 * pictures of its own pass, so the two cannot drift apart - there is no second
 * place to go and keep in step with this one.
 */
const SLIDER = "slider";

const word = {
  ...line(
    "word",
    "The word on the screen",
    12,
    "Set as large as the screen allows while this company's pictures fly past it, so it has to be one short word."
  ),
  fieldset: SLIDER,
};

const gallery = {
  name: "gallery",
  title: "The pictures that fly past",
  type: "array",
  of: [{ type: "image", options: { hotspot: true } }],
  validation: (rule) => rule.min(5).max(20),
  fieldset: SLIDER,
  description:
    "Every card is a picture, added one at a time: between five and twenty of them. They are thrown across the screen so that none touches another - five fill it as a handful of large cards, twenty as a field of smaller ones. The order here is the order they are laid out in.",
};

export const ecosystem = section("aboutEcosystem", "Industrial ecosystem", [
  line(
    "eyebrow",
    "Word above the title",
    24,
    "Set small over the title. It says how many companies there are, so it is worth changing when one is added."
  ),
  line("heading", "Title", 34, "One line, centred."),
  {
    name: "companies",
    title: "The companies",
    type: "array",
    of: [
      {
        type: "object",
        name: "company",
        fieldsets: [
          {
            name: SLIDER,
            title: "Its own pass of the slider",
            options: { collapsible: true, collapsed: false },
          },
        ],
        fields: [
          line(
            "name",
            "Name",
            34,
            "Read on the card and again under the field of pictures."
          ),
          line("body", "What it does", 90, "One line under the name."),
          {
            name: "image",
            title: "Card picture",
            type: "image",
            options: { hotspot: true },
            description: "Fills the card in the row.",
          },
          word,
          gallery,
        ],
        preview: {
          select: {
            title: "name",
            subtitle: "body",
            media: "image",
          },
        },
      },
    ],
    validation: (rule) => rule.min(2).max(12),
    description:
      "Three to a row on a desk, one to a row on a phone, in the order they are written. Each one is also a pass of the section below, with its own pictures.",
  },
]);

