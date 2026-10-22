import { aboutSections } from "@/sanity/schemaTypes/about";
import { connectSections } from "@/sanity/schemaTypes/connect";
import { contactSections } from "@/sanity/schemaTypes/contact";
import { homeSections } from "@/sanity/schemaTypes/home";
import { legalPages } from "@/sanity/schemaTypes/legal";
import { resourcesSections } from "@/sanity/schemaTypes/resources";
import {
  citrinePage,
  servicePages,
  servicesSections,
} from "@/sanity/schemaTypes/services";

/*
 * The studio's own left-hand list.
 *
 * Written out rather than left to the default, so what an editor opens is the
 * site's own shape - the pages in the order they are linked, each a folder of
 * its sections - rather than an alphabetical list of document types.
 *
 * Everything in it is opened by name: a section is always the same document,
 * and a service page is the document whose route it is. Nothing is reached
 * through a list with a single entry and a new button that would make a second
 * one.
 */
const sectionItem = (S, { name, title }) =>
  S.listItem()
    .title(title)
    .id(name)
    .child(S.document().schemaType(name).documentId(name).title(title));

/* A page told apart by its route rather than by its type: the id is the route,
   so the studio opens the document the site reads at that path. The service
   pages and the legal pages are both kept this way. */
const pageItem = (S, type, { slug, title }) =>
  S.listItem()
    .title(title)
    .id(slug)
    .child(S.document().schemaType(type).documentId(slug).title(title));

const servicePageItem = (S, page) => pageItem(S, "servicePage", page);

const folder = (S, id, title, items) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.list().title(title).items(items));

export const structure = (S) =>
  S.list()
    .title("Figlmueller")
    .items([
      folder(
        S,
        "homepage",
        "Homepage",
        homeSections.map((section) => sectionItem(S, section))
      ),
      folder(
        S,
        "aboutpage",
        "About",
        aboutSections.map((section) => sectionItem(S, section))
      ),
      folder(S, "servicespages", "Services", [
        ...servicesSections.map((section) => sectionItem(S, section)),
        S.divider(),
        ...servicePages.map((page) => servicePageItem(S, page)),
      ]),
      folder(
        S,
        "contactpage",
        "Contact",
        contactSections.map((section) => sectionItem(S, section))
      ),
      /* One page rather than a folder of sections: it is written as a page in
         the studio the way the service pages are. */
      servicePageItem(S, citrinePage),
      folder(
        S,
        "resourcespage",
        "Resources",
        resourcesSections.map((section) => sectionItem(S, section))
      ),
      /* One form rather than a page of sections, reached from every Let's
         talk on the site. */
      ...connectSections.map((section) => sectionItem(S, section)),
      /* The three the footer ends on. */
      folder(
        S,
        "legalpages",
        "Legal",
        legalPages.map((page) => pageItem(S, "legalPage", page))
      ),
    ]);
