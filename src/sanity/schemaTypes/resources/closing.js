import { line, section } from "../fields";

/*
 * The last screen: a question read in a line at a time, the button under it,
 * and the name drawn across the foot of the page as wide as it will go.
 */
export const closing = section("resourcesClosing", "Sign-off", [
  {
    name: "lines",
    title: "The question",
    type: "array",
    of: [{ type: "string", validation: (rule) => rule.max(40) }],
    validation: (rule) => rule.min(1).max(3),
    description: "One line at a time, in the order they are written.",
  },
  line(
    "word",
    "The word across the foot",
    18,
    "Set as wide as the screen allows, so a longer word is simply set smaller."
  ),
]);
