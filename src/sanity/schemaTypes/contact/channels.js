import { line, section } from "../fields";

/*
 * The list the contact page opens on - and the same list the home page closes
 * with, so it is written once here and read in both places.
 *
 * A line of it is a reason to write, set as large as the screen allows; what is
 * under it only appears when it is pointed at, and on a phone when it is
 * tapped. The detail is not typed as a link: it is said what it is - an
 * address, a number, a place - and the page is what opens a mail, dials, or
 * simply prints it.
 */
const KINDS = [
  { title: "Email address", value: "email" },
  { title: "Phone number", value: "phone" },
  { title: "Place", value: "place" },
];

const detail = {
  type: "object",
  name: "detail",
  fields: [
    {
      name: "kind",
      title: "What it is",
      type: "string",
      options: { list: KINDS, layout: "radio" },
      initialValue: "email",
      description:
        "An address opens a mail when it is clicked, a number dials, a place is read as it is written.",
      validation: (rule) => rule.required(),
    },
    line(
      "value",
      "Written out",
      60,
      "Exactly as it is to be read: sales@figlmueller.ae, +971 4 123 4567, Dubai Industrial City, UAE."
    ),
  ],
  preview: {
    select: { title: "value", subtitle: "kind" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Nothing written yet",
      subtitle: KINDS.find((kind) => kind.value === subtitle)?.title,
    }),
  },
};

const topic = {
  type: "object",
  name: "topic",
  fields: [
    line(
      "label",
      "The words on the screen",
      28,
      "Set as large as the screen allows, so a longer line is simply set smaller."
    ),
    {
      name: "details",
      title: "What opens under it",
      type: "array",
      of: [detail],
      validation: (rule) => rule.min(1).max(3),
      description: "One, two or three lines, in the order they are written.",
    },
  ],
  preview: {
    select: { title: "label", details: "details" },
    prepare: ({ title, details }) => ({
      title: title || "No words yet",
      subtitle: (details || []).map((item) => item.value).join("  ·  "),
    }),
  },
};

export const channels = section("contactChannels", "Enquiries", [
  {
    name: "topics",
    title: "The reasons to write",
    type: "array",
    of: [topic],
    validation: (rule) => rule.min(2).max(6),
    description:
      "Read down the middle of the screen, one under the other. Four is what the screen is set for - the same list closes the home page.",
  },
]);
