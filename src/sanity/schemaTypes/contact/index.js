import { addresses } from "./addresses";
import { channels } from "./channels";

/*
 * The contact page, in the order it is read down the screen: the list of
 * reasons to write, and then the addresses. The first of them is also the last
 * screen of the home page, written here and read in both places.
 */
export const contactSections = [channels, addresses];
