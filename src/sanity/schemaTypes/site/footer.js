import { line, paragraph, section } from "../fields";

/*
 * The foot of every page.
 *
 * It is not a page of its own and it is not part of one: it is read under all
 * of them, so it is written once here. What a social button looks like is not
 * written - the mark is chosen from the ones the site draws, and only the
 * address behind it is typed, which is what keeps a button from ending up with
 * somebody else's logo on it.
 *
 * The credit in the right-hand corner is not here either. It is the signature
 * of whoever built the site and it belongs in the build, not in a field that
 * can be emptied from the studio.
 */
const PLACES = [
  { title: "Instagram", value: "instagram" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "X", value: "x" },
  { title: "YouTube", value: "youtube" },
];

const social = {
  type: "object",
  name: "social",
  fields: [
    {
      name: "place",
      title: "Which one",
      type: "string",
      options: { list: PLACES, layout: "radio" },
      description: "The mark drawn on the button.",
      validation: (rule) => rule.required(),
    },
    {
      name: "href",
      title: "The address",
      type: "url",
      description: "The full address of the account, opened in a new tab.",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: { title: "place", subtitle: "href" },
    prepare: ({ title, subtitle }) => ({
      title: PLACES.find((place) => place.value === title)?.title || title,
      subtitle,
    }),
  },
};

const link = {
  type: "object",
  name: "footerLink",
  fields: [
    line("label", "Words", 30, null),
    line(
      "href",
      "Goes to",
      120,
      "A path on this site, such as /privacy-policy."
    ),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
};

export const footer = section("siteFooter", "Footer", [
  paragraph(
    "notice",
    "The sentence across the top",
    400,
    "Read in the middle, above the social buttons. The address below is turned into a mail link wherever it appears in this sentence."
  ),
  {
    name: "noticeEmail",
    title: "The address in that sentence",
    type: "string",
    description:
      "Written into the sentence above, and clicked to open a mail. Changing it here changes it in both places.",
    validation: (rule) => rule.email(),
  },
  {
    name: "socials",
    title: "The social buttons",
    type: "array",
    of: [social],
    validation: (rule) => rule.max(6),
    description:
      "A row of round buttons under the sentence, in the order they are written. Left empty, the row is not drawn at all.",
  },
  {
    name: "links",
    title: "The row of links",
    type: "array",
    of: [link],
    validation: (rule) => rule.max(6),
    description:
      "Read along the foot of the page, in the middle on a desk and wrapped on a phone.",
  },
  line(
    "copyright",
    "The line on the left",
    40,
    "It carries the year, so it is worth looking at every January."
  ),
  line("rights", "And after it", 40, "Set beside the line on the left, and under it where there is no room."),
]);
