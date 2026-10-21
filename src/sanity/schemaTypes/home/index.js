import { allInOnePlace } from "./allInOnePlace";
import { citrine } from "./citrine";
import { nextGenMachinery } from "./nextGenMachinery";
import { openingFilm } from "./openingFilm";
import { regionalGrowth } from "./regionalGrowth";
import { siteReadyMachinery } from "./siteReadyMachinery";
import { weBuild } from "./weBuild";

/*
 * The home page, in the order it is read down the screen.
 *
 * One document per section rather than one document with every section in it:
 * an editor opens the part of the page they came to change and sees only its
 * own fields. The order here is the order of the list in the studio, so the
 * two cannot drift apart - the structure reads it rather than repeating it.
 */
export const homeSections = [
  openingFilm,
  allInOnePlace,
  siteReadyMachinery,
  citrine,
  weBuild,
  regionalGrowth,
  nextGenMachinery,
];
