import { line, section } from "../fields";

/*
 * The second screen of the contact page: four addresses across it, each under
 * what it is for. They are written as one list and laid out from it - the first
 * on the left, the two after it in the middle one above the other, the last on
 * the right - so the order here is the order on the screen.
 */
const address = {
  type: "object",
  name: "address",
  fields: [
    line(
      "label",
      "What it is for",
      34,
      "Set small over the address, ending in a colon."
    ),
    {
      name: "email",
      title: "Address",
      type: "string",
      description: "Clicked to open a mail.",
      validation: (rule) => rule.required().email(),
    },
  ],
  preview: { select: { title: "email", subtitle: "label" } },
};

export const addresses = section("contactAddresses", "Addresses", [
  {
    name: "addresses",
    title: "The four addresses",
    type: "array",
    of: [address],
    validation: (rule) => rule.length(4),
    description:
      "Across the screen in the order they are written: the first on the left, the next two in the middle, one above the other, and the last on the right.",
  },
]);
