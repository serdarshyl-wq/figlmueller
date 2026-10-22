import { line, lines, section } from "../fields";

/*
 * The sheet that slides in behind every Let's talk: the name of the page down
 * the left, and the form itself on the right, read as two screens - who is
 * writing, and then what about.
 *
 * What a box is called is written here; what it is wired to is not. A box
 * carries a name from a fixed list, and the page knows from that name what it
 * is - an email, a telephone number, a company - which is what makes it fill
 * itself in from a reader's own details and what makes an address checked as
 * an address. So a box can be renamed, moved, dropped or asked for again
 * without any of that being got wrong.
 */
const BOXES = [
  { title: "Name", value: "name" },
  { title: "Company", value: "company" },
  { title: "Designation", value: "designation" },
  { title: "Email", value: "email" },
  { title: "Phone", value: "phone" },
  { title: "Project location", value: "location" },
];

const box = {
  type: "object",
  name: "box",
  fields: [
    {
      name: "name",
      title: "What it asks for",
      type: "string",
      options: { list: BOXES },
      description:
        "Chosen rather than typed: it is what tells the page to check an address as an address and to let a reader fill in their own details.",
      validation: (rule) => rule.required(),
    },
    line("label", "What it is called", 34, "Read in the box until it is typed in, and small above it after."),
    {
      name: "optional",
      title: "Can be left empty",
      type: "boolean",
      initialValue: false,
      description:
        "A box that must be filled is marked with a star and holds the form back until it is.",
    },
  ],
  preview: {
    select: { title: "label", subtitle: "name", optional: "optional" },
    prepare: ({ title, subtitle, optional }) => ({
      title: title || subtitle,
      subtitle: optional ? "Can be left empty" : "Has to be filled in",
    }),
  },
};

const step = {
  type: "object",
  name: "step",
  fields: [
    line(
      "lead",
      "What it asks",
      120,
      "Set large over the boxes, in place of a title."
    ),
    {
      name: "fields",
      title: "The boxes",
      type: "array",
      of: [box],
      validation: (rule) => rule.min(1).max(8),
      description: "Read down the screen in the order they are written.",
    },
    line("action", "The button", 16, "The words on the button that carries on."),
  ],
  preview: {
    select: { title: "lead", fields: "fields", action: "action" },
    prepare: ({ title, fields, action }) => {
      const boxes = fields?.length ?? 0;

      return {
        title: title || "Nothing written yet",
        subtitle: `${boxes} ${boxes === 1 ? "box" : "boxes"}  ·  ${action ?? ""}`,
      };
    },
  },
};

export const panel = section("connectPanel", "Let's talk", [
  lines(
    "headingWords",
    "The name down the side",
    2,
    14,
    "Two words, one under the other, set as wide as the column allows."
  ),
  {
    name: "steps",
    title: "The two screens",
    type: "array",
    of: [step],
    validation: (rule) => rule.length(2),
    description:
      "The form is read in two: who is writing, and then what about. The second screen carries the kinds of enquiry, the message and the attachments as well.",
  },
  line("enquiryLegend", "Over the kinds of enquiry", 34, "Small, above the row of them."),
  {
    name: "enquiryTypes",
    title: "The kinds of enquiry",
    type: "array",
    of: [{ type: "string", validation: (rule) => rule.max(40) }],
    validation: (rule) => rule.min(2).max(8),
    description:
      "Read as a row of buttons on the second screen, one of which is picked. They wrap onto a second row where there is no room.",
  },
  line(
    "messageLabel",
    "The message box",
    60,
    "What the large box at the end is called. It has to be filled in, so it is worth ending in a star."
  ),
  line("attachLabel", "The attachment line", 30, "Beside the paperclip, until a file is picked."),
  line("previousLabel", "The way back", 16, "The button that returns to the first screen."),
  line(
    "requiredFault",
    "Said when a box is left empty",
    40,
    "Read in red under the box."
  ),
  line(
    "formatFault",
    "Said when an entry is not in order",
    40,
    "An address that is not an address, a number that is not a number."
  ),
]);
