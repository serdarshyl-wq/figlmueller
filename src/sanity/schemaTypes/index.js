import { aboutSections } from "./about";
import { connectSections } from "./connect";
import { contactSections } from "./contact";
import { homeSections } from "./home";
import { responsiveVideo } from "./objects/responsiveVideo";
import { resourcesSections } from "./resources";
import { servicePage } from "./servicePage";
import { servicesSections } from "./services";

/*
 * The documents there is one of, each read by name. They are what is taken out
 * of the studio's new-document menu, along with the service pages: those exist
 * one per route, and a route is made in the site rather than in the studio.
 */
export const singletons = [
  ...homeSections,
  ...aboutSections,
  ...servicesSections,
  ...contactSections,
  ...resourcesSections,
  ...connectSections,
];

export const madeInCode = [...singletons, servicePage];

/*
 * Everything the studio knows how to edit: the sections of the pages that are
 * kept a section at a time, the service pages, and the shapes they are built
 * out of.
 */
export const schema = {
  types: [...singletons, servicePage, responsiveVideo],
};
