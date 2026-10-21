import { line, lines, section } from "../fields";

export const openingFilm = section("homeOpeningFilm", "Opening film", [
  {
    name: "video",
    title: "Film",
    type: "responsiveVideo",
    description:
      "Two cuts of the same film: wide for a desk, tall for a phone.",
  },
  lines(
    "headingLines",
    "Headline",
    2,
    20,
    "Two short phrases, set side by side as a signature in the bottom corner - about twenty letters each, so they still stand on one row on a phone."
  ),
  line("scrollLabel", "Scroll word", 12, "The small word above the arrow."),
]);
