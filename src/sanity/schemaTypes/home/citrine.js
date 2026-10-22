import { cta, line, section } from "../fields";

/*
 * The film here is not played: it is wound by the scroll, a frame at a time,
 * so the machine turns as the reader comes down the page. Which is why it is
 * uploaded in two cuts like the opening film - a frame cropped to a phone from
 * a wide film loses the machine off the sides, and there is nothing else on
 * the screen to make up for it.
 *
 * Left empty, the section winds the frames the site ships with.
 */
export const citrine = section("homeCitrine", "Citrine® introduction", [
  {
    name: "video",
    title: "Film",
    type: "responsiveVideo",
    description:
      "Two cuts of the same film: wide for a desk, tall for a phone. It is wound by the scroll rather than played, so a short film - a few seconds - is what this screen is for.",
  },
  line("leadIn", "Word above", 24, "Set small over the name."),
  line("heading", "Name", 24, "Set large, on one line, over the film."),
  cta("cta", "Button", "The way through to the Citrine® page."),
]);
