import { ecosystem } from "./ecosystem";
import { founder } from "./founder";
import { mission } from "./mission";
import { opening } from "./opening";
import { philosophy } from "./philosophy";
import { showcase } from "./showcase";

/*
 * The about page, in the order it is read down the screen. One document per
 * section, the same way the home page is kept - and the same list the studio's
 * own folder is built from.
 */
export const aboutSections = [
  opening,
  mission,
  philosophy,
  ecosystem,
  showcase,
  founder,
];
