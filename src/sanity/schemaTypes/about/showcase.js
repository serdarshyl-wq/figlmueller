import { line, section } from "../fields";

export const showcase = section("aboutShowcase", "The three companies", [
  {
    name: "companies",
    title: "The three companies",
    type: "array",
    of: [
      {
        type: "object",
        name: "company",
        fields: [
          line(
            "word",
            "The word on the screen",
            12,
            "Set as large as the screen allows while the tiles fly past it, so it has to be one short word."
          ),
          line("label", "Name in the list", 34, "Read at the foot of the screen."),
        ],
        preview: { select: { title: "word", subtitle: "label" } },
      },
    ],
    validation: (rule) => rule.length(3),
    description:
      "Three, in the order they are passed through. The move is timed to three - the same three named in the section above.",
  },
]);
