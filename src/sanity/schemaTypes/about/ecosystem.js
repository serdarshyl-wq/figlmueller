import { CompanyPick } from "../../components/CompanyPick";
import { line, section } from "../fields";

/*
 * The companies, and then the slider that passes through them.
 *
 * They are two sections on the page and two here: the row of cards is written
 * first, and under it the passes of the slider - one to a company, nothing in
 * it but pictures. A pass does not name a company of its own; it picks one of
 * the ones written above it, which is the only reason the two cannot drift
 * apart. A company that has no pass simply does not pass, and one cannot be
 * picked twice.
 */
const company = {
  type: "object",
  name: "company",
  fields: [
    line(
      "name",
      "Name",
      34,
      "Read on the card, and again under its pictures in the slider below."
    ),
    line("body", "What it does", 90, "One line under the name."),
    {
      name: "image",
      title: "Card picture",
      type: "image",
      options: { hotspot: true },
      description: "Fills the card in the row.",
    },
    line(
      "word",
      "The word on the screen",
      12,
      "Set as large as the screen allows while this company's pictures fly past it in the slider, so it has to be one short word."
    ),
  ],
  preview: {
    select: { title: "name", subtitle: "body", media: "image" },
  },
};

const pass = {
  type: "object",
  name: "pass",
  fields: [
    {
      name: "company",
      title: "Whose pass it is",
      type: "string",
      components: { input: CompanyPick },
      description: "One of the companies written above this section.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return "Pick the company this pass belongs to.";

          const written = context.document || {};
          const names = (written.companies || [])
            .map((item) => item?.name)
            .filter(Boolean);

          if (!names.includes(value)) {
            return `"${value}" is not one of the companies above. Pick one of them.`;
          }

          const mine = context.path?.find((step) => step && step._key)?._key;
          const twice = (written.passes || []).some(
            (item) => item?._key !== mine && item?.company === value
          );

          if (twice) {
            return `${value} already has a pass. Each company passes once.`;
          }

          return true;
        }),
    },
    {
      name: "pictures",
      title: "The pictures that fly past",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      validation: (rule) => rule.min(5).max(20),
      description:
        "Every card is a picture, added one at a time: between five and twenty of them. They are thrown across the screen so that none touches another - five fill it as a handful of large cards, twenty as a field of smaller ones. The order here is the order they are laid out in.",
    },
  ],
  preview: {
    select: { title: "company", pictures: "pictures" },
    prepare: ({ title, pictures }) => ({
      title: title || "No company picked yet",
      subtitle: `${pictures?.length || 0} pictures`,
      media: pictures?.[0],
    }),
  },
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
    of: [company],
    validation: (rule) => rule.min(2).max(12),
    description:
      "Three to a row on a desk, one to a row on a phone, in the order they are written.",
  },
  {
    name: "passes",
    title: "The slider under the companies",
    type: "array",
    of: [pass],
    validation: (rule) => rule.max(12),
    description:
      "The screen goes black below the cards and the companies come through it one at a time, each with a field of its own pictures flying past its name. A pass is added here and handed one of the companies above - a company that is given no pass is left out of the slider, and adding a fourth company is what makes a fourth pass possible.",
  },
]);
