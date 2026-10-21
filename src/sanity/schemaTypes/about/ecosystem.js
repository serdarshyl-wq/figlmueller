import { line, section } from "../fields";

export const ecosystem = section("aboutEcosystem", "Industrial ecosystem", [
  line("eyebrow", "Word above the title", 24, "Set small over the title."),
  line("heading", "Title", 34, "One line, centred."),
  {
    name: "companies",
    title: "The three companies",
    type: "array",
    of: [
      {
        type: "object",
        name: "company",
        fields: [
          line("name", "Name", 34, null),
          line("body", "What it does", 90, "One line under the name."),
        ],
        preview: { select: { title: "name", subtitle: "body" } },
      },
    ],
    validation: (rule) => rule.length(3),
    description:
      "Three, side by side in a row of three. The same three are named again in the section below this one.",
  },
]);
