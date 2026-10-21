import { aboutSections } from "./about";
import { homeSections } from "./home";
import { responsiveVideo } from "./objects/responsiveVideo";
import { servicePage } from "./servicePage";

/*
 * The pages that are kept a section at a time. There is one of each of these
 * documents and the site reads them by name, so they are also what is taken out
 * of the studio's new-document menu.
 */
export const singletons = [...homeSections, ...aboutSections];

/*
 * Everything the studio knows how to edit: the home page's sections, the about
 * page's sections, the service pages, and the shapes they are built out of.
 */
export const schema = {
  types: [...singletons, servicePage, responsiveVideo],
};
