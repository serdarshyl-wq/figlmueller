import { lines, paragraph, section } from "../fields";

export const allInOnePlace = section("homeAllInOnePlace", "All in one place", [
  lines(
    "titleLines",
    "Opening lines",
    3,
    36,
    "Three lines, read one after the other as the section is scrolled."
  ),
  paragraph(
    "what",
    "What the company builds",
    220,
    "One sentence, set large and centred. Longer than this and it takes more of the screen than the line after it."
  ),
  paragraph(
    "experience",
    "The experience behind it",
    220,
    "The same size as the line above it, and the same room."
  ),
  lines(
    "closerLines",
    "Closing words",
    2,
    14,
    "The line the section ends on, in two parts. It is set across the whole screen and may not wrap - keep each part short."
  ),
]);
