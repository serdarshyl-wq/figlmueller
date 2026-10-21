/*
 * The shapes a page's sections are written out of.
 *
 * WHY EVERY FIELD IS CAPPED
 * These sections are not boxes that grow with their contents. The hero's two
 * phrases stand side by side in a corner; the two words of WE BUILD are thrown
 * off opposite edges by a timeline that measured them; ENGINEERING and
 * PHILOSOPHY are flown in from opposite sides of a picture. Type that outgrows
 * its design does not simply look long here - it breaks the move it is part of.
 *
 * So each field carries the length its design can hold, taken from what is on
 * the page today plus the room the layout actually has, and says in its own
 * description what it is. An editor is told before they type, rather than after
 * they publish. Where a size is worked out by measuring the words - the contact
 * section's two display words - the cap is looser, because those shrink to fit
 * on their own.
 *
 * Anything left empty falls back to what the site ships with, so a half-filled
 * section never leaves a hole in the page.
 */
export const line = (name, title, max, description) => ({
  name,
  title,
  type: "string",
  description,
  validation: (rule) => rule.max(max),
});

export const paragraph = (name, title, max, description) => ({
  name,
  title,
  type: "text",
  rows: 3,
  description,
  validation: (rule) => rule.max(max),
});

export const lines = (name, title, count, max, description) => ({
  name,
  title,
  type: "array",
  of: [{ type: "string", validation: (rule) => rule.max(max) }],
  description,
  validation: (rule) => rule.length(count),
});

export const cta = (name, title, description) => ({
  name,
  title,
  type: "object",
  description,
  options: { collapsible: true, collapsed: true },
  fields: [
    line("label", "Words", 34, "The wording on the button."),
    {
      name: "href",
      title: "Goes to",
      type: "string",
      description: "A path on this site, such as /citrine.",
      validation: (rule) => rule.max(120),
    },
  ],
});

/*
 * A section of a page: one document, opened by name, that cannot be made twice.
 * The title is what the editor reads in the list and at the top of the form, so
 * it is the name of the section as it appears on the page.
 */
export const section = (name, title, fields) => ({
  name,
  title,
  type: "document",
  fields,
  preview: { prepare: () => ({ title }) },
});
