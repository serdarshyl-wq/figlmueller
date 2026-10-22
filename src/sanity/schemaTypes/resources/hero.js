import { lines, section } from "../fields";

/*
 * The screen the resources page opens on: a film held behind four statements
 * that are read in one at a time, and then the three rows of the title drawn
 * across it.
 *
 * The film is the same pair of cuts the home page opens with - wide for a
 * desk, tall for a phone - because this screen is held the same way.
 */
export const hero = section("resourcesHero", "Opening film", [
  {
    name: "video",
    title: "Film",
    type: "responsiveVideo",
    description:
      "Two cuts of the same film: wide for a desk, tall for a phone.",
  },
  {
    name: "poster",
    title: "Still shown before it plays",
    type: "image",
    options: { hotspot: true },
    description:
      "Held for the moment between the page arriving and the film starting. The first frame of the film is what it is for.",
  },
  {
    name: "statements",
    title: "The statements",
    type: "array",
    of: [{ type: "text", rows: 2, validation: (rule) => rule.max(48) }],
    validation: (rule) => rule.min(2).max(6),
    description:
      "Read in one at a time, each one leaving before the next arrives. Every line you type is a row on the screen - two at most, which is how a long statement is broken on a phone.",
  },
  lines(
    "stackRows",
    "The title drawn across the screen",
    3,
    18,
    "Three rows, one under the other, each pulled across the screen a little behind the one above it."
  ),
]);
