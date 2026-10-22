import { line, section } from "../fields";

/*
 * The list the page is for. Each line of it is a resource: the name is read
 * down the screen, its picture is held beside the line that is pointed at, and
 * the button opens a panel from the right with the name set large in it.
 */
/*
 * A piece of what a resource has to say: words, and under them a picture if
 * there is one worth showing. They are read in the order they are written, so
 * a picture belongs to the words above it.
 */
const part = {
  type: "object",
  name: "part",
  fields: [
    {
      name: "text",
      title: "Words",
      type: "text",
      rows: 4,
      description: "A paragraph. Leave a line empty to start a new one.",
      validation: (rule) => rule.max(900),
    },
    {
      name: "image",
      title: "Picture under them",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional: set across the panel, under the words it belongs to.",
    },
  ],
  preview: {
    select: { text: "text", media: "image" },
    prepare: ({ text, media }) => ({
      title: text ? text.split("\n")[0] : "A picture on its own",
      media,
    }),
  },
};

const item = {
  type: "object",
  name: "resource",
  fields: [
    line(
      "title",
      "Name",
      40,
      "Read on the line, and again set large in the panel - where it is broken one word to a row, so a long name is set small."
    ),
    {
      name: "slug",
      title: "Its own address",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      description:
        "What this resource is called in the address bar while it is open: /resources?item=company-brochure. Press Generate after naming it - changing it afterwards breaks a link already sent to somebody. Left empty, it is worked out from the name.",
    },
    {
      name: "image",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
      description: "Held behind the list while this line is pointed at.",
      validation: (rule) => rule.required(),
    },
    {
      name: "body",
      title: "What it says when it is opened",
      type: "array",
      of: [part],
      validation: (rule) => rule.max(20),
      description:
        "The panel this resource opens, written a piece at a time: words, and under them a picture where there is one. Left empty, the panel says what is written at the foot of this page instead.",
    },
  ],
  preview: {
    select: { title: "title", media: "image", body: "body" },
    prepare: ({ title, media, body }) => ({
      title,
      subtitle: body?.length
        ? `${body.length} ${body.length === 1 ? "piece" : "pieces"}`
        : "Nothing written yet",
      media,
    }),
  },
};

export const gallery = section("resourcesGallery", "The list", [
  {
    name: "items",
    title: "The resources",
    type: "array",
    of: [item],
    validation: (rule) => rule.min(2).max(12),
    description:
      "Read down the screen in the order they are written. Eight is what the screen is set for.",
  },
  line(
    "ctaLabel",
    "Button words",
    20,
    "On the button at the end of every line."
  ),
  line(
    "panelNote",
    "Words in a panel with nothing in it yet",
    40,
    "Read in the middle of the panel of a resource that has not been written out above. A resource that has been written shows what it says instead."
  ),
]);
