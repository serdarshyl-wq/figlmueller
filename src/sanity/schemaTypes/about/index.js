import { ecosystem } from "./ecosystem";
import { founder } from "./founder";
import { mission } from "./mission";
import { opening } from "./opening";
import { philosophy } from "./philosophy";

/*
 * The about page, in the order it is read down the screen. One document per
 * section, the same way the home page is kept - and the same list the studio's
 * own folder is built from.
 *
 * Two of the page's screens are one document: the row of companies and the
 * field of pictures that passes through them are the same list read twice, so
 * they are written in one place rather than kept in step by hand.
 */
export const aboutSections = [
  opening,
  mission,
  philosophy,
  ecosystem,
  founder,
];
