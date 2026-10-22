import { aboutSections } from "@/sanity/schemaTypes/about";
import { contactSections } from "@/sanity/schemaTypes/contact";
import { homeSections } from "@/sanity/schemaTypes/home";
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

/* A service page is a `servicePage` document, told apart by its route: the id
   is the route, so the studio opens the page the site reads at that path. */
const servicePageItem = (S, { slug, title }) =>
  S.listItem()
    .title(title)
    .id(slug)
    .child(
      S.document().schemaType("servicePage").documentId(slug).title(title)
    );

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
    ]);
